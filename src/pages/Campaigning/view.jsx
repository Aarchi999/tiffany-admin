import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import Loader from '../../components/loader/Loader'; // Import Loader component
import API from '../../http/api';
import { toast } from 'react-toastify';

const CampaigningDetailView = () => {
  // const { state } = useLocation(); // Get the passed state (campaignData)
  // const { campaignData } = state || {}; // Destructure the campaignData
  // const campaignId = state?.campaignData?.id || null ;
  const { id } = useParams();
  const campaignId = id;

  const [campaignData, setCampaignData] = useState(null);
  const [prizeName, setPrizeName] = useState("");
  const [prizeQty, setPrizeQty] = useState("");
  const [loading, setLoading] = useState(true); // Loading state for handling async operations
  const [editId, setEditId] = useState(null);
  // useEffect(() => {
  //   if (!campaignData) {   
  //     setLoading(false);
  //   } else {
  //     setLoading(false);
  //   }
  // }, [campaignData]);
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        // const response = await API.get(`campaign-view/${campaignId}`);
        // if (response?.status === 200) {
        //   setCampaignData(response.data);
        // }
        const response = await API.get(`campaign-view/${campaignId}`);

        if (response?.status === 200) {
          setCampaignData(response.data);
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch campaign details");
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      fetchCampaign();
    } else {
      setLoading(false);
    }
  }, [campaignId]);

  if (loading) {
    return <Loader />;
  }

  if (!campaignData) {
    return <div>No campaign data found.</div>; // Show message when no campaignData is available
  }
  const startEdit = (prize) => {
    setPrizeName(prize.prize_name);
    setPrizeQty(prize.quantity_allocated);
    setEditId(prize.id);
  };
  const handleAddPrize = async () => {
    if (!prizeName || !prizeQty) {
      toast.error("Prize name and quantity required");
      return;
    }

    try {

      // ✅ UPDATE MODE
      if (editId) {

        await API.put(`update-prize/${editId}`, {
          prize_name: prizeName,
          quantity_allocated: Number(prizeQty)
        });

        setCampaignData((prev) => ({
          ...prev,
          prizes: prev.prizes.map((p) =>
            p.id === editId
              ? { ...p, prize_name: prizeName, quantity_allocated: prizeQty }
              : p
          )
        }));

        toast.success("Prize updated");

        setEditId(null);
      }

      // ✅ ADD MODE
      else {

        const response = await API.post(`add-prize/${campaignId}`, {
          prize_name: prizeName,
          quantity_allocated: Number(prizeQty)
        });

        setCampaignData((prev) => ({
          ...prev,
          prizes: [...(prev.prizes || []), response.data.data]
        }));

        toast.success("Prize added successfully");
      }

      setPrizeName("");
      setPrizeQty("");

    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    console.log("Deleting prize id:", id);

    try {
      await API.delete(`delete-prize/${id}`);

      setCampaignData((prev) => ({
        ...prev,
        prizes: prev.prizes.filter((p) => p.id !== id)
      }));

      toast.success("Prize deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="main-content app-content">
      <div className="container-fluid">
        <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
          <h1 className="page-title fw-semibold fs-18 mb-0">{campaignData.name}</h1>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="card custom-card">
              <div className="card-header justify-content-between">
                <div className="card-title">Campaign Information</div>
              </div>

              <div className="card-body">
                <div className="row">
                  <div className="col-md-4">
                    <div className="card">
                      <div className="card-body bg-light">
                        <h6 className="card-title">Campaign Name</h6>
                        <p className="card-text">{campaignData?.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card for Campaign Date */}
                  <div className="col-md-4">
                    <div className="card">
                      <div className="card-body bg-light">
                        <h6 className="card-title">Campaign Date</h6>
                        <p className="card-text">{campaignData?.start_date}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card for Number of Prices */}
                  <div className="col-md-4">
                    <div className="card">
                      <div className="card-body bg-light">
                        <h6 className="card-title">Number of Prices</h6>
                        {/* <p className="card-text">{campaignData.max_winners}</p> */}
                        <p className="card-text">
                          {campaignData?.prizes?.reduce(
                            (total, prize) => total + Number(prize.quantity_allocated || 0),
                            0
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price List Table */}
                <div className="card-header justify-content-between d-flex">
                  <div className="card-title">Prices</div>

                  <div className="d-flex gap-2">

                    <input
                      type="text"
                      placeholder="Prize Name"
                      className="form-control"
                      value={prizeName}
                      onChange={(e) => setPrizeName(e.target.value)}
                    />

                    <input
                      type="number"
                      placeholder="Quantity"
                      className="form-control"
                      value={prizeQty}
                      onChange={(e) => setPrizeQty(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handleAddPrize}>
                      {editId ? "Update" : "Add"}
                    </button>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body pt-1">
                    <div className="table-responsive">
                      <table className="table table-hover table-bordered">
                        <thead>
                          <tr>
                            <th>Price Name</th>
                            {/* <th>Price Amount</th> */}
                            <th>Quantity</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {campaignData?.prizes?.length > 0 ? (
                            campaignData.prizes.map((prize, index) => (
                              <tr key={prize.id || index}>
                                <td>{prize.prize_name}</td>
                                <td>{prize.quantity_allocated}</td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-warning me-2"
                                    onClick={() => startEdit(prize)}
                                  >
                                    Edit
                                  </button>

                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(prize.id)}
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3" className="text-center">
                                No prizes available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaigningDetailView; 
