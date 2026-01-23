import axios from "axios";

// 1. Create Axios Instance
const api = axios.create({
  baseURL: "http://localhost:4000/api", // Point to Platform Service
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Add Interceptor (Attach Token Automatically)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get token from storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
export default api;