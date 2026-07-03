import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../http/api'; // Ensure your API service is correctly set up
import { toast } from 'react-toastify'; // Import toast for notifications
import Loader from '../../components/loader/Loader'; // Import loader component
import Pagination from '../../components/pagination/Pagination';
import Search from "../../components/search/Search";
import { confirmAction } from '../../constants/apiFunctions';


const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state
  const [links, setLinks] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKey, setSearchKey] = useState('');
  const navigate = useNavigate();

  const handleView = (id) => {

    navigate('/customer/view', { state: id });
  };

  // useEffect(() => {
  //   fetchCustomers();
  // }, []);

  useEffect(() => {
    fetchCustomers(currPage, searchKey);
  }, [searchKey, currPage]);


  const handleCustomer = async (id) => {
    try {
      setLoading(true);

      const response = await API.delete(`customer-delete/${id}`);

      if (response?.status === 200) {
        toast.success(response?.message)
        // setCustomer(response?.data); 
        // fetchCustomers()
        fetchCustomers(currPage, searchKey)
      } else {
        toast.error(response?.message || "Failed to fetch customer data.");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong while fetching the invoice data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async (page = 1, search = "") => {
    try {
      setLoading(true);

      const res = await API.get(`customer-invoice?page=${page}&search=${search}`);

      if (res.status === 200) {
        setCustomers(res.data);
        setCurrPage(res.current_page);
        setTotalPages(res.last_page);
        setLinks(res.links);
      }

    } catch (e) {
      console.error(e);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content app-content">
      <div className="container-fluid">
        <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
          <h1 className="page-title fw-semibold fs-18 mb-0">Customers</h1>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="card custom-card">
              <div className="card-header justify-content-between">
                <div className="card-title">All Customers</div>
                <Search searchKey={searchKey} setSearchKey={setSearchKey} />
                <div className=""></div>
              </div>

              {/* Customer Table */}
              <div className="card-body">
                <div className="table-responsive">
                  {loading ? (
                    <Loader />
                  ) : customers?.length === 0 ? (
                    <div className="alert alert-info">
                      No Customers Found
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
                          <th>No. of Invoices</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Loop through customers and display their details */}
                        {customers && customers?.length > 0 && customers.map((customer, i) => (
                          <tr key={customer?.id}>
                            <td>{(currPage - 1) * 10 + i + 1}</td>
                            <td>{customer?.first_name}</td>
                            <td>{customer?.last_name}</td>
                            <td>{customer?.email}</td>
                            <td>{customer?.mobile}</td>
                            <td>{customer?.invoices_count}</td>
                            <td>
                              <div className="hstack gap-2 fs-15">
                                <button
                                  type="button"
                                  onClick={() => handleView(customer?.id)}
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
                                  onClick={() =>
                                    confirmAction(
                                      "Are you sure you want to delete this customer?",
                                      customer?.id,
                                      handleCustomer
                                    )
                                  }


                                  className="btn btn-icon waves-effect waves-light btn-sm btn-danger-light"
                                  title="Delete"
                                >
                                  <i className="ri-delete-bin-line" />
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
              {customers?.length > 0 && (
                <div className="card-footer">
                  <Pagination apiEndPoint={`customer-invoice`}
                    loading={loading}
                    setLoading={setLoading}
                    list={customers}
                    setList={setCustomers} currPage={currPage} setCurrPage={setCurrPage} totalPages={totalPages} setTotalPages={setTotalPages} setLinks={setLinks} searchKey={searchKey} links={links} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;


