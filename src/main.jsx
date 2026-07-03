import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { UserRoleProvider } from "./context/userRoleContext.jsx";
import { AuthContextProvider } from "./context/authContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <UserRoleProvider>
      <App />
      <ToastContainer />
    </UserRoleProvider>
  </AuthContextProvider>
);
