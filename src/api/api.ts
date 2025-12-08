import axios from "axios";
import { User } from "../types/user";

const baseURL = import.meta.env.VITE_API_URL || "http://3.229.120.223:8000";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach token ONLY if it's not a login or register request
api.interceptors.request.use((config) => {
  const user: User | null = JSON.parse(localStorage.getItem("user") || "null");

  if (
    user?.token &&
    config.url &&
    !config.url.includes("/auth/login") &&
    !config.url.includes("/auth/register")
  ) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default api;
