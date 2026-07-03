import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../http/api";
import { toast } from "react-toastify";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();

  const email = state?.email;

  const handleVerify = async () => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("otp", otp);

      const res = await API.post("/verify-otp", formData);

      if (res?.message) {
        toast.success("OTP Verified");

        navigate("/reset-password", { state: { email, otp } });
      }
    } catch (err) {
      toast.error(err.message || "Invalid OTP");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100vh", background: "#f8f9fa" }}
    >
      <div
        className="p-4 bg-white shadow rounded"
        style={{ width: "350px" }}
      >
        <h3 className="text-center mb-2">Verify OTP</h3>

        <p className="text-muted text-center mb-4" style={{ fontSize: "14px" }}>
          Enter the OTP sent to your email
        </p>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="form-control form-control-lg text-center mb-3"
          maxLength={6}
        />

        <button
          onClick={handleVerify}
          className="btn btn-primary w-100"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
}