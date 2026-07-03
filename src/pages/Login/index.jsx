import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import routes from "../../constants/routesConstants";
import { useDocumentTitle } from "@uidotdev/usehooks";
import useAuth from "../../context/authContext";
import API from "../../http/api";

// Define validation schema for login form
const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required.")
    // .email("Email is invalid.")
    .max(42),
  password: yup.string().required("Password is required.").max(42),
});

const forgotPasswordValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required.")
    // .email("Email is invalid.")
    .max(42),
});

export default function Login({ pageType }) {
  useDocumentTitle("Login");
  const { state } = useLocation();
  const navigate = useNavigate(); // Using navigate hook
  const { isLoggedIn, login } = useAuth();

  // Track loading state for login form and forgot password form
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useDocumentTitle(pageType === "forgot-password" ? "Forgot Password" : "Login");

  // If the user is already logged in, redirect them to the dashboard
  useEffect(() => {
    if (isLoggedIn) {
      navigate(state?.path || routes.Dashboard);
    }
  }, [state, navigate, isLoggedIn]);

  // Toggle password visibility in login form
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };


  const validationSchema = pageType === "forgotpass"
    ? forgotPasswordValidationSchema
    : loginValidationSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { isAcceptConditions: false },
  });

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      
      const formData = new FormData();
      formData.append("username", data.email);// backend expects username=email  //admin@test.com
      formData.append("password", data.password);  //123456

      const response = await API.post("login", formData);
      setLoading(false);

       console.log("LOGIN RESPONSE:", response);

      if (response && response [0]) {
        localStorage.setItem("x-token", response[0].Token);
        login(response[0]);
        navigate(routes.Dashboard);
      } else {
        toast.error("Invalid credentials");
      }
     
  
      // if (response.status === 200) {
      //   console.log("re",response?.data)
      //   localStorage.setItem("x-token", response?.data?.[0].Token);
      //   login(response?.data?.[0]);
      //   navigate(routes.Dashboard);
      // } else {
      //   toast.error("Invalid credentials");
      // }
    } catch (error) {
      setLoading(false);
      toast.error(error.message ||"Apologies, unable to fulfill your request now. Please try again later.");
    }
  };

  // const handleForgotPassword = async (data) => {
  //   setLoading(true);
  //   try {
  //     const formData = new FormData();
  //     formData.append("email", data.email);

  //     const response = await API.post("forgot-password", formData);
  //     setLoading(false);

  //     if (response?.status === 200) {
  //       toast.success(response?.message);
  //       navigate("/");
  //     } else {
  //       toast.error(response?.message || "Something went wrong.");
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     toast.error(Response?.message);
  //   }
  // };

 const handleForgotPassword = async (data) => {
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("email", data.email);

    const response = await API.post("/forgot-password", formData);

    setLoading(false);

    if (response?.status === 200) {
      toast.success(response?.message || "Reset link sent to your email");
    navigate("/verify-otp", { state: { email: data.email } });
    } else {
      toast.error(response?.message || "Something went wrong.");
    }
  } catch (error) {
    setLoading(false);
    toast.error(error.message || "Failed to send reset email");
  }
};


  return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: "100vh", position: "relative" }}>
      {/* Main Content */}
      <div className="d-flex flex-row align-items-center gap-5">
        <div className="p-5">
          <img src="assets/images/logo.png" alt="logo" style={{ height: "9vh", marginLeft: "50%", cursor: "pointer" }} />
          <p className="h5 fw-semibold mt-4 mb-2">{pageType === "forgotpass" ? "Forgot Password" : "Sign In"}</p>
          <p className="mb-5 text-muted op-7 fw-normal">
            {pageType === "forgotpass" ? "Enter your email to reset your password." : "One step away from your work. Let's Start!"}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(pageType === "forgotpass" ? handleForgotPassword : handleLogin)}>
            <div className="row gy-3">
              <div className="col-xl-12 mt-0">
                <label htmlFor="email" className="form-label text-default">Email</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="email"
                  placeholder="Email"
                  autoFocus
                  {...register("email")}
                  maxLength={42}
                />
                {errors.email?.message && <span className="error mt-2 text-danger d-block">{errors.email?.message}</span>}
              </div>
              {pageType === "login" && (
                <div className="col-xl-12 mb-3">
                  <label htmlFor="password" className="form-label text-default d-block">Password</label>
                  <div className="input-group">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      className="form-control form-control-lg"
                      id="password"
                      placeholder="Password"
                      {...register("password")}
                      maxLength={42}
                    />
                    <button
                      className="btn btn-light" 
                      type="button"
                      onClick={togglePasswordVisibility}
                      id="button-addon2"
                    >
                      <i className={passwordVisible ? "ri-eye-line align-middle" : "ri-eye-off-line align-middle"} />
                    </button>
                  </div>
                  {errors.password?.message && <span className="error mt-2 text-danger d-block">{errors.password?.message}</span>}
                </div>
              )}
              <div className="mt-2">
                {pageType === "login" && (
                  <div className="form-check d-flex justify-content-between">
                    <div>
                      <input className="form-check-input" type="checkbox" id="rememberPassword" />
                      <label className="form-check-label text-muted fw-normal" htmlFor="rememberPassword">Remember password?</label>
                    </div>
                    <a onClick={() => navigate(routes.ForgotPassword)} style={{ cursor: "pointer" }}>Forgot password?</a>
                  </div>
                )}
              </div>

              <div className="col-xl-12 d-grid mt-2">
                <button
                  type="submit"
                  className="btn btn-lg btn-primary min-w-fit-content text-nowrap"
                  disabled={loading}
                  style={{ maxWidth: "120px", marginLeft: "45%" }}
                >
                  {pageType === "forgotpass"
                    ? loading
                      ? "Sending..."
                      : "Send Reset Link"
                    : loading
                      ? "Signing In..."
                      : "Sign In"}
                </button>
              </div>
            </div>
          </form>

        </div>

        <div className="d-flex justify-content-center align-items-center col-xxl-5 col-xl-5 col-lg-5 d-xl-block d-none px-0">
          <img src="assets/images/MainPoster.png" alt="logo" className="w-75" />
        </div>
      </div>
    </div>
  );
}
