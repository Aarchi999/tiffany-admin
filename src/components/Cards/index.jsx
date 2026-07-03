import React from 'react'
import { useNavigate } from 'react-router-dom';


const Card = ({ item }) => {
  const navigate = useNavigate();
  return (
    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6">
      <div className={`card custom-card ${item.bgClass}`} style={{ border: "2px solid #111C43", cursor:"pointer" }} onClick={() => { navigate(`${item?.navigate}`)}}>
        <div className="card-body">
          <div className="row align-items-center">
            {/* Icon */}
            <div className="col-xxl-3 col-xl-2 col-lg-3 col-md-3 col-sm-4 col-4 d-flex align-items-center justify-content-center ecommerce-icon px-0" >
              <span className="rounded p-3 bg-light-transparent" style={{ border: "1px solid #111C43" }}>{item.icon}</span>
            </div>
            {/* Details */}
            <div className="col-xxl-9 col-xl-10 col-lg-9 col-md-9 col-sm-8 col-8 px-0 fw-semibold">
              <div className="mb-2 fs-20 lh-1">{item.title}</div>
              <div className="fs-26 mb-0">{item.description}</div>
            </div>
          </div>  
        </div>
      </div>
    </div>
  )
}

export default Card;