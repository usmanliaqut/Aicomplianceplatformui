
import axios from "axios";
import { User } from "../types/user";

const baseURL = import.meta.env.VITE_API_URL || "http://3.229.120.223:8000";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Attach token ONLY if it's not a login or register request
api.interceptors.request.use((config) => {
  
  const token = localStorage.getItem("token");
 

if (
    token && // Check if token exists and is non-empty
    config.url &&
    !config.url.includes("/auth/login") &&
    !config.url.includes("/auth/signup")
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
