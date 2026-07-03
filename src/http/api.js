import axios from "axios";

const API = axios.create({
  baseURL: "https://tiffany-backend-570r.onrender.com/",

  headers: {
    "Content-type": "application/json"
  },
});

// ✅ attach token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("x-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ return only data (matches your login code)
API.interceptors.response.use(
  (response) => {
    console.log("API Response:", response?.data); // log the data
    return response?.data;
  },
  (error) => {
    if (error?.response?.status === 401 && window.location.pathname !== "/") {
      localStorage.removeItem("x-token");
      window.location.replace("/");
      return;
    }
    throw new Error(
      error?.response?.data?.data || "Something went wrong, Please try after sometime."
    );
  }
);

export default API;
