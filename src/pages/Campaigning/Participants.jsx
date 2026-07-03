import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import API from '../../http/api';
import { toast } from 'react-toastify';
import Loader from '../../components/loader/Loader';
import Pagination from '../../components/pagination/Pagination';
import Search from '../../components/search/Search';

const CampaigningParticipants = () => {
  // const location = useLocation();
  // const id = location.state;
  const { id } = useParams();
  const [campaigning, setCampaigning] = useState([]);
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKey, setSearchKey] = useState('');


  // ✅ reset page when search changes
  useEffect(() => {
    setCurrPage(1);
  }, [searchKey]);

  useEffect(() => {
    if (id) fetchCampaigning();
  }, [id, currPage, searchKey]);

//   const fetchCampaigning = async () => {
//     try {
//       setLoading(true);

//       const response = await API.get(`all-participants/${id}`, {
//         params: {
//           search: searchKey, // Add search query
//           page: currPage  // Add pagination query
//         },
//  headers: {
//     "Cache-Control": "no-cache"
//   }
//       });



//       if (response?.status === 200) {

//       const participants = response?.data?.data?.data || [];

// setCampaigning(participants);
// setCurrPage(response?.data?.data?.current_page || 1);
// setTotalPages(response?.data?.data?.last_page || 1);
//         // setLinks(payload?.links || []);

//         // Ensure links is always an array
//         const safeLinks = (response?.data?.data?.links || []).map((link) => ({
//           url: link?.url || null,
//           label: link?.label || "",
//           active: link?.active || false,
//         }));
//         setLinks(safeLinks);

//         // setLinks(response?.data?.links || "");

//       } else {
//         toast.error(response?.message || "Failed to fetch campaigns.");
//         setCampaigning([]);
//         setLinks([]);
//       }
//     } catch (error) {
//       setCampaigning([]);
//       setLinks([]);
//       toast.error(error?.response?.data?.message || "Something went wrong while fetching campaign data.");
//     } finally {
//       setLoading(false);
//     }
//   };


const fetchCampaigning = async () => {
  try {
    setLoading(true);

    const response = await API.get(`all-participants/${id}`, {
      params: {
        search: searchKey,
        page: currPage
      }
    });

    if (response) {

      const participants = response?.data?.data || [];

      setCampaigning(participants);
      setCurrPage(response?.data?.current_page || 1);
      setTotalPages(response?.data?.last_page || 1);

      const safeLinks = (response?.data?.links || []).map((link) => ({
        url: link?.url || null,
        label: link?.label || "",
        active: link?.active || false,
      }));

      setLinks(safeLinks);
    }

  } catch (error) {
    setCampaigning([]);
    setLinks([]);
    toast.error(error?.message || "Something went wrong while fetching participants.");
  } finally {
    setLoading(false);
  }
};
  // const CampaigningParticipants = () => {
  //   const { id } = useParams(); // <-- get campaign id from URL

  //   const [campaigning, setCampaigning] = useState([]);
  //   const [loading, setLoading] = useState(false);
  //   const [links, setLinks] = useState([]);
  //   const [currPage, setCurrPage] = useState(1);
  //   const [totalPages, setTotalPages] = useState(1);
  //   const [searchKey, setSearchKey] = useState('');

  //   // useEffect(() => {
  //   //   if (id) fetchCampaigning();
  //   // }, [id, currPage, searchKey]);
  //   useEffect(() => {
  //   setCurrPage(1);
  // }, [searchKey]);

  //   const fetchCampaigning = async () => {
  //     try {
  //       setLoading(true);

  //       const response = await API.get(`all-participants/${id}`, {
  //         params: { search: searchKey, page: currPage },
  //       });

  //       if (response?.status === 200) {
  //         setCampaigning(response?.data?.data || []);
  //         setCurrPage(response?.data?.current_page || 1);
  //         setTotalPages(response?.data?.last_page || 1);

  //         // Ensure links is always an array with proper defaults
  //         const safeLinks = (response?.data?.links || []).map(link => ({
  //           url: link?.url || "#",
  //           label: link?.label || "",
  //           active: link?.active || false,
  //         }));
  //         setLinks(safeLinks);
  //       } else {
  //         toast.error(response?.message || "Failed to fetch participants.");
  //         setCampaigning([]);
  //         setLinks([]);
  //       }
  //     } catch (error) {
  //       setCampaigning([]);
  //       setLinks([]);
  //       toast.error(error?.message || "Something went wrong while fetching participants.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };


  return (
    <div className="main-content app-content">
      <div className="container-fluid">
        <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
          <h1 className="page-title fw-semibold fs-18 mb-0">Participants</h1>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="card custom-card">
              <div className="card-header justify-content-between">
                <div className="card-title">All Participants</div>
                <Search searchKey={searchKey} setSearchKey={setSearchKey} />
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  {loading ? (
                    <Loader />
                  ) : campaigning.length === 0 ? (
                    <div className="alert alert-info">
                      No Participants Found
                    </div>
                  ) : (
                    <table className="table table-hover table-bordered">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Email</th>
                          <th>Phone Number</th>
                          {/* <th>Coupon Code</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {campaigning.map((customer, index) => (
                      <tr key={`${customer.id}-${index}`}>
                            <td>{(currPage - 1) * 10 + index + 1}</td>
                            <td>{customer?.first_name}</td>
                            <td>{customer?.last_name}</td>
                            <td>{customer?.email}</td>
                            <td>{customer?.mobile}</td>
                            {/* <td>{customer?.coupon_code}</td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
              {campaigning.length > 0 && (
                <div className="card-footer">
                  <Pagination
                    apiEndPoint={`all-participants/${id}`}
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
                    links={links}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaigningParticipants;
