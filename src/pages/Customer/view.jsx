import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { confirmAction, formatDateInHyphen } from '../../constants/functions';
import API from '../../http/api';
import Loader from '../../components/loader/Loader';
import { toast } from 'react-toastify';

const CustomerView = () => {
  const location = useLocation();
  const id = location.state;
  if (!id) {
    return <div>No customer selected</div>;
  }

  const [customer, setCustomer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImg, setPreviewImg] = useState(null);

  // Delete Invoice API call
  const handleViewInvoice = async (invoiceId) => {
    try {
      setLoading(true);

      const response = await API.post('delete-invoice', { invoice_id: invoiceId });

      if (response?.status === 200) {
        toast.success(response?.message)
        // setCustomer(response?.data); 
        fetchCustomerData();
      } else {
        toast.error(response?.message || "Failed to fetch invoice data.");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong while fetching the invoice data.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCustomerData();
  }, [id]);

  // Fetch customer + invoices
  const fetchCustomerData = async () => {
    try {
      setLoading(true);

      const response = await API.post(`customers-invoices/${id}`);
      if (response?.status === 200) {
        setCustomer(response?.data);
      } else {
        toast.error(response?.message || "Failed to fetch customer data.");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong while fetching the customer data.");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <>
        <div className="main-content app-content">
          <div className="container-fluid">
            <Loader />
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="main-content app-content">
      <div className="container-fluid">
        <div className="d-md-flex d-block align-items-center justify-content-between my-4 page-header-breadcrumb">
          <h1 className="page-title fw-semibold fs-18 mb-0">Customer Details</h1>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="card custom-card">
              <div className="card-header justify-content-between">
                <div className="card-title">Customer Information</div>
              </div>

              {/* Customer Information Card */}
              <div className="card bg-light m-2">
                <div className="card-body">
                  <div className="row gy-2">
                    <div className="col-md-4">
                      <h5 className="card-title">Name</h5>
                      <p className="card-text">{customer?.customer?.name}</p>
                    </div>

                    <div className="col-md-4">
                      <h5 className="card-title">Email</h5>
                      <p className="card-text">{customer?.customer?.email}</p>
                    </div>
                    <div className="col-md-4">
                      <h5 className="card-title">Phone Number</h5>
                      <p className="card-text">{customer?.customer?.mobile}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoices Table */}
              <div className="card-header justify-content-between">
                <div className="card-title">Invoices</div>
              </div>

              <div className="card">
                <div className="card-body pt-1">
                  <div className="table-responsive">
                    <table className="table table-hover table-bordered">
                      <thead>
                        <tr className="bg-light">
                          <th>Date</th>
                          <th>Invoice</th>
                          <th>Coupon Code</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customer?.invoices?.map((invoice) => (
                          <tr key={invoice?.invoice_id}>
                            <td>{formatDateInHyphen(invoice?.
                              invoice_date)}</td>
                            <td>
                              {(() => {
                                const files = Array.isArray(invoice.invoice_file)
                                  ? invoice.invoice_file
                                  : invoice.invoice_file
                                    ? [invoice.invoice_file]
                                    : [];

                                if (files.length === 0) return <span>No image</span>;

                                return files.map((file, index) =>
                                  file.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                    <img
                                      key={index}
                                      src={`https://tiffanyback.thewebsdeveloper.com/uploads/invoices/${file}`}
                                      alt={`Invoice ${invoice.invoice_id}`}
                                      style={{
                                        width: "90px",
                                        height: "90px",
                                        objectFit: "cover",
                                        borderRadius: "6px",
                                        border: "1px solid #ddd",
                                        cursor: "pointer",
                                        marginRight: "5px",
                                      }}
                                      onClick={() =>
                                        setPreviewImg(`https://tiffanyback.thewebsdeveloper.com/uploads/invoices/${file}`)
                                      }
                                    />
                                  ) : file.match(/\.pdf$/i) ? (
                                    <span
                                      key={index}
                                      className="badge bg-danger"
                                      style={{ cursor: "pointer", marginRight: "5px" }}
                                      onClick={() =>
                                        setPreviewImg(`https://tiffanyback.thewebsdeveloper.com/uploads/invoices/${file}`)
                                      }
                                    >
                                      📄 View PDF
                                    </span>
                                  ) : (
                                    <span key={index}>Unsupported</span>
                                  )
                                );
                              })()}
                            </td>

                            <td>{invoice?.coupon_code}</td>
                            <td>
                              <button
                                type="button"
                                onClick={() =>
                                  confirmAction(
                                    "Delete this invoice?",
                                    () => handleViewInvoice
                                      (invoice?.invoice_id)

                                  )}
                                className="btn btn-icon waves-effect waves-light btn-sm btn-danger-light"
                              >
                                <i className="ri-delete-bin-line" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {previewImg && (
        <div
          onClick={() => setPreviewImg(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            cursor: "zoom-out"
          }}
        >
          {previewImg.toLowerCase().endsWith(".pdf") ? (
            <iframe
              src={previewImg}
              title="pdf"
              style={{
                width: "90%",
                height: "90%",
                background: "#fff",
                borderRadius: "8px"
              }}
            />
          ) : (

            <img
              src={previewImg}
              alt="preview"
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                borderRadius: "8px",
                boxShadow: "0 0 20px #000"
              }}
            />
          )}
        </div>
      )}

    </div>
  );
};

export default CustomerView;




