import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Không redirect, chỉ throw error để component xử lý
    return Promise.reject(error);
  }
);

export default axiosInstance;
