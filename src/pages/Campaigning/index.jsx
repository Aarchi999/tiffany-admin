import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../http/api';
import { toast } from 'react-toastify';
import Loader from '../../components/loader/Loader';

const CampaigningView = () => {

  const navigate = useNavigate();
  const [campaigning, setCampaigning] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchCampaigning();
  }, []);

  const fetchCampaigning = async () => {
    try {
      setLoading(true);

      const response = await API.get(`campaigns-details`);
      if (response?.status === 200) {

        // Only use API campaigns now
        setCampaigning(response?.data || []);
      } else {
        toast.error(response?.message || "Failed to fetch campaigns.");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong while fetching campaign data.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (campaignData) => {
    navigate(`/campaigning/view/${campaignData.id}`);
  };

  const getWinner = (id) => {
    navigate(`/campaigning/winnerlist/${id}`);
  };
  const getstart = (id, totalPrize) => {
    navigate(`/campaigning/spin/${id}`, { state: { totalPrize } });
  };
  const getparticipants = (id) => {

    navigate(`/campaigning/participants/${id}`);
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

// Delete campaign from backend
const handleDeleteCampaign = async (campaignId) => {
  if (!window.confirm("Are you sure you want to delete this campaign?")) return;

  try {
    const response = await API.delete(`delete-campaign/${campaignId}`); // API endpoint must exist
    if (response?.status === 200) {
      toast.success("Campaign deleted successfully");
 fetchCampaigning(); // reload list from DB
    } else {
      toast.error("Failed to delete campaign");
    }
  } catch (error) {
    toast.error("Failed to delete campaign");
  }
};

  return (
    <div className="main-content app-content">
      <div className="container-fluid">
        <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
          <h1 className="page-title fw-semibold fs-18 mb-0">Campaigns</h1>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="card custom-card">
              {/* <div className="card-header justify-content-between">
                <div className="card-title">All Campaigns</div>
              </div> */}
              <div className="card-header d-flex justify-content-between align-items-center">
                <div className="card-title">All Campaigns</div>

                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/create-campaign")}
                >
                  + Add Campaign
                </button>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  {loading ? (
                    <Loader />
                  ) : campaigning.length === 0 ? (
                    <div className="alert alert-info">
                      No Campaigning Found
                    </div>
                  ) : (
                    <table className="table table-hover table-bordered">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Campaigning Name</th>
                          <th>Date</th>
                          <th>No. of Prize</th>
                          <th>Actions</th>
                        </tr>                   
                      </thead>
                      <tbody>
                        {campaigning && campaigning?.map((customer, index) => (
                          <tr key={customer.id}>
                            <td>{index + 1}</td>
                            <td>{customer.name}</td>
                            <td>{formatDate(customer.start_date)}</td>
                            {/* <td>{customer.max_winners}</td> */}
                            <td>
                              {customer.prizes
                                ? customer.prizes.reduce(
                                  (total, prize) => total + Number(prize.quantity_allocated || 0),
                                  0
                                )
                                : customer.max_winners}
                            </td>
                            <td>
                              <div className="hstack gap-2 fs-15">
                               
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCampaign(customer.id)}
                                    className="btn btn-icon waves-effect waves-light btn-sm btn-danger-light"
                                    title="Delete"
                                  >
                                    <i className="ri-delete-bin-6-line"></i>
                                  </button>
                                
                                <button
                                  type="button"
                                  onClick={() => handleView(customer)}
                                  className="btn btn-icon waves-effect waves-light btn-sm btn-secondary-light"
                                  title="Details"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-info-circle pe-1 pb-1">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 9h-1l-.117 .007a1 1 0 0 0 0 1.986l.117 .007v3l.007 .117a1 1 0 0 0 .876 .876l.117 .007h1l.117 -.007a1 1 0 0 0 .876 -.876l.007 -.117l-.007 -.117a1 1 0 0 0 -.764 -.857l-.112 -.02l-.117 -.006v-3l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007zm.01 -3l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => getparticipants(customer?.id)}
                                  className="btn btn-icon waves-effect waves-light btn-sm btn-secondary-light"
                                  title="participants"
                                >
                                  <i className=" ri-user-fill" />

                                </button>

                                <button
                                  type="button"
                                  onClick={() => getstart(customer?.id, customer?.max_winners)}

                                  className="btn btn-icon waves-effect waves-light btn-sm btn-success-light ml-2"
                                  title="Start"
                                >
                                  <i className="bi bi-arrow-clockwise"></i>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => getWinner(customer?.id)}

                                  className="btn btn-icon waves-effect waves-light btn-sm btn-success-light ml-2"
                                  title="Winners"
                                >
                                  <i className='bx bx-trophy'></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaigningView;

