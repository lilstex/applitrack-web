import axios from "axios";
import Cookies from "js-cookie";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to automatically add the JWT token
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("token"); // Look in cookies now!
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
