import axios from "axios";

const API = axios.create({
  baseURL: "https://tiffany-backend-570r.onrender.com",

  headers: {
    "Content-type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("x-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (
      error?.response?.status === 401 &&
      window.location.pathname !== "/"
    ) {
      localStorage.removeItem("x-token");
      window.location.replace("/");
    }

    return Promise.reject(error);
  }
);

export default API;
