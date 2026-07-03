import React, { useState, useEffect, createContext, useContext } from "react";
import API from "../http/api";
import { toast } from "react-toastify";


const AuthContext = createContext({
  isLoggedIn: false,
  login: async (data) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("x-token") !== null);


  // useEffect(() => {
  //   const token = localStorage.getItem("x-token");
  //   if (token) {
  //     logoutHandler(); // Log out if the token is expired
  //   }
  // }, []);

  const logoutHandler = async () => {
    try {
      const response = await API.get("logout");
      if (response?.status === 200) {
        setIsLoggedIn(false);
        localStorage.removeItem("x-token");
        window.location.replace("/");
      } else {
        toast.error(response?.message || "Something went wrong during logout");
      }
    } catch (error) {
      toast.error("Error during logout.");
    }
  };

  const loginHandler = (data) => {
    try {
      if (!data?.Token) {
        throw new Error('Token is missing');
      }
      localStorage.setItem("x-token", data.Token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error during login:', error);
      toast.error("An error occurred during login: " + error.message); // Use toast instead of alert
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login: loginHandler, logout: logoutHandler }}>
      {props.children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
