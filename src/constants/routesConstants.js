

const routes = {
  //======================== Login And Dashboard, Settings ========
  Login: "/",
  ForgotPassword: "/forgotPassword",
    VerifyOtp: "/verify-otp",
  ResetPassword: "/reset-password",
  Dashboard: "/dashboard",
  
  // Setting: "/setting",
  
  //======================== customer ========
  Customer: "/customer",
  CustomerView: "/customer/view",


  //======================== customer ========
  Campaigning: "/campaigning",
  CampaigningView: "/campaigning/view/:id", 
  CampaigningWinner: "/campaigning/winnerlist/:id", 
  CampaigningSpin: "/campaigning/spin/:id", 
  CampaigningParticipants: "/campaigning/participants/:id", 
    // ✅ ADD THIS
  AddCampaign: "/create-campaign"
};
export default routes;
