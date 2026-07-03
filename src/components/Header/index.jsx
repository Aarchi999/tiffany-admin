import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import routes from "../../constants/routesConstants";
import useAuth from "../../context/authContext";

export default function Header() {
  const location = useLocation();
  const { logout } = useAuth(); // Get user data from context



  useEffect(() => {
    const htmlTag = document.documentElement;
    const responsiveOverlay = document.getElementById("responsive-overlay");
    if (responsiveOverlay.classList.contains("active")) {
      responsiveOverlay.classList.remove("active");
      htmlTag.removeAttribute("data-vertical-style");
      htmlTag.setAttribute("data-toggled", "close");
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    const htmlTag = document.documentElement;
    htmlTag.setAttribute(
      "data-vertical-style",
      htmlTag.getAttribute("data-vertical-style") === "overlay" ? "" : "overlay"
    );
    htmlTag.setAttribute(
      "data-toggled",
      htmlTag.getAttribute("data-toggled") === "icon-overlay-close"
        ? ""
        : "icon-overlay-close"
    );
    if (window.innerWidth <= 1024) {
      document.getElementById("responsive-overlay").classList.toggle("active");
    }
  };

  return (
    <header className="app-header">
      <div className="main-header-container container-fluid">
        <div className="header-content-left">
          <div className="header-element">
            <div className="horizontal-logo">
              <Link to={routes.Dashboard} className="header-logo">
                <img
                  src="/assets/images/logo.png"
                  alt="logo"
                  className="desktop-logo"
                />
                <img
                  src="/assets/images/logo.png"
                  alt="logo"
                  className="toggle-logo"
                />
                <img
                  src="/assets/images/logo.png"
                  alt="logo"
                  className="desktop-dark"
                />
                <img
                  src="/assets/images/logo.png"
                  alt="logo"
                  className="toggle-dark"
                />
                <img
                  src="/assets/images/logo.png"
                  alt="logo"
                  className="desktop-white"
                />
                <img
                  src="/assets/images/logo.png"
                  alt="logo"
                  className="toggle-white"
                />
              </Link>
            </div>
          </div>
          <div className="header-element">
            <a
              aria-label="Hide Sidebar"
              className="sidemenu-toggle header-link animated-arrow hor-toggle horizontal-navtoggle"
              data-bs-toggle="sidebar"
              href="#"
              onClick={toggleSidebar}
            >
              <span />
            </a>
          </div>
        </div>

        <div className="header-content-right">
          <div className="header-element">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="header-link dropdown-toggle"
              id="mainHeaderProfile"
              data-bs-toggle="dropdown"
              data-bs-auto-close="outside"
              aria-expanded="false"
            >
              <div className="d-flex align-items-center">
                <div className="me-sm-2 me-0">
                  <img
                    src="/assets/images/user.png"
                    alt="logo"
                    width={32}
                    height={32}
                    className="rounded-circle"
                  />
                </div>
                <div className="d-sm-block d-none">
                  {/* <p className="fw-semibold mb-0 lh-1">{name}</p> */}
                  <p className="fw-semibold mb-0 lh-1">Tiffany 
                  Chocolate</p>
                  {/* <span className="op-7 fw-normal d-block fs-11">{role}</span>
                  <p className="fw-semibold mb-0 lh-1">{user.name}</p> */}
                  {/* <span className="op-7 fw-normal d-block fs-11">{user.Roles}</span> */}
                </div>
              </div>
            </a>
            <ul
              className="main-header-dropdown dropdown-menu pt-0 overflow-hidden header-profile-dropdown dropdown-menu-end"
              aria-labelledby="mainHeaderProfile"
            >         

              <li>
                <button
                  className="dropdown-item d-flex"
                  onClick={() => logout()}
                >
                  <i className="ti ti-logout fs-18 me-2 op-7" />
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
