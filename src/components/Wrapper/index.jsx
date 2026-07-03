import React from "react";
import Header from "../Header";
import { Outlet } from "react-router-dom";
import Footer from "../Footer";
import Sidebar from "../sidebar/Sidebar";
import PrivateRoute from "../PrivateRoute";

export default function Wrapper({ children }) {
  const hideSidebar = () => {
    const htmlTag = document.documentElement;
    const responsiveOverlay = document.getElementById("responsive-overlay");
    responsiveOverlay.classList.remove("active");
    htmlTag.removeAttribute("data-vertical-style");
    htmlTag.setAttribute("data-toggled", "close");
  };
  
  return (
    <div className="page">
      <Header />
      <Sidebar />
      {children}
      <Footer />
      <div className="scrollToTop">
        <span className="arrow">
          <i className="ri-arrow-up-s-fill fs-20" />
        </span>
      </div>
      <div id="responsive-overlay" onClick={hideSidebar} />
    </div>
  );
}
