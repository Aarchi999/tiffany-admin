import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import routes from "../../constants/routesConstants";
import SimpleBar from 'simplebar';
import 'simplebar/dist/simplebar.min.css';

const Sidebar = () => {
 

  const sidebarRef = useRef(null);

  useEffect(() => {
    if (sidebarRef.current) {
      new SimpleBar(sidebarRef.current, { autoHide: true });
    }
  }, []);

  return (
    <div className="app-sidebar sticky" id="sidebar">
      {/* Sidebar image present in upper side */}
      <div className="main-sidebar-header">
        <Link to={routes.Dashboard} className="header-logo">
          <img
            src="/assets/images/logo.png"
            alt="logo"
            className="desktop-logo h-50 w-50 mx-auto"
          />
          <img
            src="/assets/images/logo.png"
            alt="logo"
            className="toggle-logo h-100 w-100 mx-auto"
          />
          <img
            src="/assets/images/logo.png"
            alt="logo"
            className="desktop-dark h-50 w-50 mx-auto"
          />
          <img
            src="/assets/images/logo.png"
            alt="logo"
            className="toggle-dark h-100 w-100 mx-auto"
          />
          <img
            src="/assets/images/logo.png"
            alt="logo"
            className="desktop-white h-50 w-50 mx-auto"
          />
          <img
            src="/assets/images/logo.png"
            alt="logo22"
            className="toggle-white h-100 w-100 mx-auto"
          />
        </Link>
      </div>

      {/* Sidebar list */}
      <div className="main-sidebar h-100">
        <div id="sidebar-scroll" className="h-100 overflow-auto" ref={sidebarRef}>
          <nav className="main-menu-container nav nav-pills flex-column sub-open overflow-y-auto">
            {/* Sidebar List */}
            <ul className="main-menu">
              {/* Main */}
              <li className="slide__category"><span className="category-name">Main</span></li>

              {/* Dashboard */}
              <li className="slide">
                <Link to={routes.Dashboard} className="side-menu__item">
                  <i className="bx bx-home side-menu__icon" />
                  <span className="side-menu__label">Dashboard</span>
                </Link>
              </li>

              {/* Management */}
              <li className="slide__category"><span className="category-name">Management</span></li>

              {/* Customers */}
              <li className="slide has-sub">
                <Link to={routes.Customer} className="side-menu__item">
                  <i className="fs-18 me-2 op-7 ri-user-fill" />
                  <span className="side-menu__label">Customers</span>
                </Link>
           
              </li>
              {/* campaigning */}
              <li className="slide has-sub">
                <Link to={routes.Campaigning} className="side-menu__item">
                  <i className="ri-money-rupee-circle-fill fs-18 me-2 op-7" />
                  <span className="side-menu__label"> All Campaigns</span>
                </Link>
           
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
