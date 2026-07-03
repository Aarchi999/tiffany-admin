
import { useDocumentTitle } from "@uidotdev/usehooks";
import React, { useEffect, useState } from "react";
import Card from "../../components/Cards";
import API from "../../http/api";
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css"; // optional, for styling

export default function Dashboard() {
  useDocumentTitle("Dashboard");
  const [customers, setCustomers] = useState(0);
  const [coupons, setCoupons] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // alert()
    fetchCustomers();
    fetchtotalcoupons();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await API.get('customer');
      // setCustomers(response?.data?.total); 
        // console.log("Customer API Response:", response);
      if (response?.status === 200) {
        setCustomers(response?.total ?? 0);
      } else {
        toast.error(response?.message || "Failed to fetch customer data.");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong while fetching the customer data.");
    } finally {
      setLoading(false);
    }
  };
  const fetchtotalcoupons = async () => {
    try {
      setLoading(true);
      const response = await API.get('dashboard-count');
      // console.log("Coupons API Response:", response);
      if (Array.isArray(response)){
        // setCoupons(response?.data[0]?.total_coupons);
        setCoupons(response[0]?.total_coupons ?? 0);

        //    // Handle both array or object response from backend
        // const total =
        //   Array.isArray(response?.data)
        //     ? response?.data[0]?.total_coupons ?? 0
        //     : response?.data?.total_coupons ?? 0;
        // setCoupons(total);

      } else {
        toast.error(response?.message || "Failed to fetch customer data.");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong while fetching the customer data.");
    } finally {
      setLoading(false);
    }
  };

  const cardItems = [
    {
      title: 'Number Of Participants',
      description: `${customers} `,
      bgClass: 'white',
      navigate: "/customer",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" color="#111C43" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-flower"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M12 2a3 3 0 0 1 3 3c0 .562 -.259 1.442 -.776 2.64l-.724 1.36l1.76 -1.893c.499 -.6 .922 -1 1.27 -1.205a2.968 2.968 0 0 1 4.07 1.099a3.011 3.011 0 0 1 -1.09 4.098c-.374 .217 -.99 .396 -1.846 .535l-2.664 .366l2.4 .326c1 .145 1.698 .337 2.11 .576a3.011 3.011 0 0 1 1.09 4.098a2.968 2.968 0 0 1 -4.07 1.098c-.348 -.202 -.771 -.604 -1.27 -1.205l-1.76 -1.893l.724 1.36c.516 1.199 .776 2.079 .776 2.64a3 3 0 0 1 -6 0c0 -.562 .259 -1.442 .776 -2.64l.724 -1.36l-1.76 1.893c-.499 .601 -.922 1 -1.27 1.205a2.968 2.968 0 0 1 -4.07 -1.098a3.011 3.011 0 0 1 1.09 -4.098c.374 -.218 .99 -.396 1.846 -.536l2.664 -.366l-2.4 -.325c-1 -.145 -1.698 -.337 -2.11 -.576a3.011 3.011 0 0 1 -1.09 -4.099a2.968 2.968 0 0 1 4.07 -1.099c.348 .203 .771 .604 1.27 1.205l1.76 1.894c-1 -2.292 -1.5 -3.625 -1.5 -4a3 3 0 0 1 3 -3z" /></svg>
      )
    },
    {
      title: 'Number Of Entries',
      description: `${coupons} `,
  
      bgClass: 'white',
      navigate:"/customer",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" color="#111C43" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-coin-rupee">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336zm-2 3.66h-6c-1.287 0 -1.332 1.864 -.133 1.993l.133 .007h1a2 2 0 0 1 1.732 1h-2.732a1 1 0 0 0 0 2l2.732 .001a2 2 0 0 1 -1.732 .999h-1c-.89 0 -1.337 1.077 -.707 1.707l3 3a1 1 0 0 0 1.414 0l.083 -.094a1 1 0 0 0 -.083 -1.32l-1.484 -1.485l.113 -.037a4.009 4.009 0 0 0 2.538 -2.77l1.126 -.001a1 1 0 0 0 0 -2h-1.126a3.973 3.973 0 0 0 -.33 -.855l-.079 -.145h1.535a1 1 0 0 0 1 -1l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
        </svg>
      )
    }
  ];
  return (
    <>
      <div className="main-content app-content">
        <div className="container-fluid">
          <div className="d-md-flex d-block align-items-center justify-content-end my-4 page-header-breadcrumb">
            <div className="ms-md-1 ms-0">
              <nav>
                <ol className="breadcrumb mb-0">
                  {/* <li className="breadcrumb-item active" aria-current="page">Dashboard</li> */}
                </ol>
              </nav>
            </div>
          </div>

          <div className="d-flex gap-2">
           

            {cardItems.map((item, index) => (
              <Card key={index} item={item} />
            ))}
          </div>


        </div>
      </div>
    </>
  );
}
