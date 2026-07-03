import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import API from "../../http/api";
import Loader from "../../components/loader/Loader";
import Search from "../../components/search/Search";
import Pagination from "../../components/pagination/Pagination";
import { confirmAction } from "../../constants/functions";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
// import "jspdf-arabic";
import _ from "lodash";

const CampaigningWinner = () => {
  // const location = useLocation();
  // const id = location.state || null;
  const { id } = useParams();
  const [campaigning, setCampaigning] = useState([]);
  const [campaigningDetails, setCampaigningDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const [links, setLinks] = useState([]);

  
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      await Promise.all([fetchCampaigning(), fetchCampaigningDetails()]);
      setLoading(false);
    };
    fetchInitialData();
  }, []);


useEffect(() => {
  setCurrPage(1);
}, [searchKey]);

   useEffect(() => {
  fetchCampaigning(searchKey);
}, [currPage, searchKey]);

 const fetchCampaigning = async (searchValue = searchKey) => {
    try {
      setLoading(true);
     const response = await API.post(`winner-list?search=${searchValue || ""}&page=${currPage}`, {
        campaign_id: id,
      });

      // console.log("awadsdassad", response)

      if (response?.status === 200) {
setCampaigning(
  Array.isArray(response?.data)
    ? response.data
    : response?.data?.data || []
);        // setCurrPage(response?.current_page || 1);
        // setTotalPages(response?.last_page || 1);
        setLinks(response?.links ?? []);
      } else {
        toast.error("Failed to fetch winners.");
      }

    } catch (error) {
      toast.error(error?.message || "Something went wrong.");
      // handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // console.log("asdasdadsasd", campaigning)



  const fetchCampaigningDetails = async () => {
    try {
      // const response = await API.get(`campaigns-details/${id}`);
      const response = await API.get(`campaign-view/${id}`);
      if (response?.status === 200) {
        setCampaigningDetails(response.data || {});
      } else {
        toast.error(response?.message || "Failed to fetch campaign details.");
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      toast.error(error.response.data?.message || "Server error occurred.");
    } else if (error.request) {
      toast.error("No response from server. Please try again.");
    } else {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleWinners = async (winnerId) => {
    try {
      setLoading(true);
      const response = await API.post(`delete-winner`, { winner_id: winnerId });
      if (response?.status === 200) {
        fetchCampaigning();
        toast.success(response?.message || "Winner deleted successfully.");
      } else {
        toast.error(response?.message || "Failed to delete winner.");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

const downloadListPDF = async () => {
  try {
    setLoading(true);

    let allWinners = [];
    let page = 1;
    let totalPages = 1;

    do {
      const response = await API.post(`winner-list?page=${page}`, {
        campaign_id: id,
      });

      if (response?.status === 200) {
        allWinners = [...allWinners, ...response.data];
        totalPages = response.last_page || 1;
        page++;
      } else {
        break;
      }
    } while (page <= totalPages);

    if (allWinners.length === 0) {
      toast.info("No winners to download.");
      return;
    }

    const formattedData = allWinners.map((customer, index) => [
      index + 1,
      `${customer.customer.first_name} ${customer.customer.last_name}`,
      customer.customer.email,
      customer.customer.mobile,
      customer.coupon_code,
      customer.prize.name,
    ]);

    const doc = new jsPDF();

    doc.text(`Winners - ${campaigningDetails?.name}`, 14, 20);

    doc.autoTable({
      head: [["#", "Name", "Email", "Phone", "Coupon", "Prize"]],
      body: formattedData,
      startY: 30,
    });

    doc.save(`Winners_${campaigningDetails?.name}.pdf`);

  } catch (error) {
    toast.error("Download failed");
  } finally {
    setLoading(false);
  }
};


  // console.log("Pagination props values:");
  // console.log("apiEndPoint:", "winner-list");
  // console.log("loading:", loading);
  // console.log("setLoading:", setLoading);
  console.log("list:", campaigning);
  // console.log("setList:", setCampaigning);
  // console.log("currPage:", currPage);
  // console.log("setCurrPage:", setCurrPage);
  // console.log("totalPages:", totalPages);
  // console.log("setTotalPages:", setTotalPages);
  // console.log("setLinks:", setLinks);
  // console.log("searchKey:", searchKey);
  console.log("links:", links);

  return (
    <div className="main-content app-content">
      <div className="container-fluid">
        <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
          <h1 className="page-title fw-semibold fs-18 mb-0">Winners</h1>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="card custom-card">
              <div className="card-header justify-content-between">
                <div className="card-title">All Winners</div>
                <Search searchKey={searchKey} setSearchKey={setSearchKey} />
               {campaigningDetails?.status === "closed" && (
  <button
    type="button"
    onClick={downloadListPDF}
    className="btn btn-icon waves-effect waves-light btn-sm btn-info"
    title="download list"
  >
    <i className="bx bxs-file-export fs-18 me-2 op-7" />
  </button>
)}
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  {loading ? (
                    <Loader />
                  ) : campaigning.length === 0 ? (
                    <div className="alert alert-info">No Winners Found</div>
                  ) : (
                    <table className="table table-hover table-bordered">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Winner Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Coupon Code</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaigning.map((customer, index) => (
                          <tr key={customer.id}>
                            <td>{index + 1}</td>
                            <td>
                              {customer.customer.first_name} {customer.customer.last_name}
                            </td>
                            <td>{customer.customer.email}</td>
                            <td>{customer.customer.mobile}</td>
                            <td>{customer.coupon_code}</td>
                            <td>
                              <button
                                type="button"
                                onClick={() =>
                                  confirmAction(customer.winner_id, handleWinners)
                                }
                                className="btn btn-icon waves-effect waves-light btn-sm btn-danger-light"
                                title="Delete"
                              >
                                <i className="ri-delete-bin-5-line fs-18" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                {campaigning?.length > 0 && (
                  <div className="card-footer">
                    <Pagination
                      apiEndPoint={`winner-list`}
                      loading={loading}
                      setLoading={setLoading}
                      list={campaigning}
                      setList={setCampaigning}
                      currPage={currPage}
                      setCurrPage={setCurrPage}
                      totalPages={totalPages}
                      setTotalPages={setTotalPages}
                      setLinks={setLinks}
                      searchKey={searchKey}
                      // links={links}
                      links={links.length > 0 ? links : undefined}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaigningWinner;
