import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../http/api";

const AddCampaign = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    totalPrize: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.date || !formData.totalPrize) {
    toast.error("Please fill all fields");
    return;
  }

  try {
     // ✅ Save campaign to backend
    const response = await API.post("create-campaign", {
      name: formData.name,
      start_date: formData.date,
      max_winners: Number(formData.totalPrize)
    });

    if (response?.status === 200) {
      toast.success("Campaign Created Successfully");
      navigate("/campaigning"); // Go back to campaign list
    }
  } catch (error) {
    toast.error("Failed to create campaign");
  }
};

  return (
    <div className="main-content app-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-12">
            <div className="card custom-card">

              {/* Header with Back Button */}
              <div className="card-header d-flex justify-content-between align-items-center">
                <div className="card-title">Create Campaign</div>

                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/campaigning")}
                >
                  ← Back to Campaigns
                </button>
              </div>

              <div className="card-body">
                <form onSubmit={handleSubmit}>

                  <div className="mb-3">
                    <label className="form-label">Campaign Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">No. of Prize</label>
                    <input
                      type="number"
                      name="totalPrize"
                      className="form-control"
                      value={formData.totalPrize}
                      onChange={handleChange}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Create Campaign
                  </button>

                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );

};
export default AddCampaign;