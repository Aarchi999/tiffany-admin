import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../http/api";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const { state } = useLocation();

  const email = state?.email;
  const otp = state?.otp;

  const handleReset = async () => {
    // only necessary validation (must keep)
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("otp", otp);
      formData.append("new_password", password);

      const res = await API.post("/reset-password", formData);

      if (res?.message) {
        toast.success("Password reset successful");
        navigate("/");
      }
    } catch (err) {
      toast.error(err.message || "Error resetting password");
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
        <h3 className="text-center mb-2">Reset Password</h3>

        <p className="text-muted text-center mb-4" style={{ fontSize: "14px" }}>
          Set your new password below
        </p>

        {/* NEW PASSWORD */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          className="form-control form-control-lg mb-3"
        />

        {/* CONFIRM PASSWORD */}
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="form-control form-control-lg mb-3"
        />

        <button
          onClick={handleReset}
          className="btn btn-primary w-100"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}