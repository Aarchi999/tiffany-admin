import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserRoleProvider } from "./context/userRoleContext";
import "./app.css"

import Login from "./pages/Login";
import routes from "./constants/routesConstants";
import Dashboard from "./pages/Dashboard";
import Wrapper from "./components/Wrapper";
// import Setting from "./pages/Setting";
import PrivateRoute from "./components/PrivateRoute";
import Customers from "./pages/Customer";
import Campaigning from "./pages/Campaigning";
import CampaigningView from "./pages/Campaigning/view";
import CustomerView from "./pages/Customer/view";
import CampaigningWinner from "./pages/Campaigning/Winner";
import CampaigningSpin from "./pages/Campaigning/Spin";
import CampaigningParticipants from "./pages/Campaigning/Participants";
// ✅
import AddCampaign from "./pages/Campaigning/AddCampaign";

import VerifyOtp from "./pages/Login/VerifyOtp";
import ResetPassword from "./pages/Login/ResetPassword";

const withPrivateRoute = (Component) => (
  <PrivateRoute>
    <Wrapper>
      <Component />
    </Wrapper>
  </PrivateRoute>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.Login} element={<Login pageType="login" />} exact />
        <Route path={routes.ForgotPassword} element={<Login pageType="forgotpass" />} exact />
        <Route path={routes.VerifyOtp} element={<VerifyOtp />} />
        <Route path={routes.ResetPassword} element={<ResetPassword />} />

        <Route path={routes.Dashboard} element={withPrivateRoute(Dashboard)} exact />
        {/* <Route path={routes.Setting} element={withPrivateRoute(Setting)} exact /> */}



        {/* //======================== customer =========================== ======== */}
        <Route path={routes.Customer} element={withPrivateRoute(Customers)} exact />
        <Route path={routes.CustomerView} element={withPrivateRoute(CustomerView)} exact />


        {/*  ===========================  campaigning =====================*/}
        <Route path={routes.Campaigning} element={withPrivateRoute(Campaigning)} exact />
        <Route path={routes.CampaigningView} element={withPrivateRoute(CampaigningView)} exact />
        <Route path={routes.CampaigningWinner} element={withPrivateRoute(CampaigningWinner)} exact />
        <Route path={routes.CampaigningSpin} element={withPrivateRoute(CampaigningSpin)} exact />
        <Route path={routes.CampaigningParticipants} element={withPrivateRoute(CampaigningParticipants)} exact />
        
 {/* Add Campaign */}
        <Route path={routes.AddCampaign} element={withPrivateRoute(AddCampaign)} />


      </Routes>
    </BrowserRouter>
  );
}

