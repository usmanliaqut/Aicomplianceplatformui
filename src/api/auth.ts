// src/api/auth.ts
import api from "./api";
import { User } from "../types/user";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const loginUser = async (
  payload: LoginPayload
): Promise<{ user: User; token: string }> => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const registerUser = async (
  payload: RegisterPayload
): Promise<{ user: User; token: string }> => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

// <-- Add this
export const getMe = async (): Promise<User> => {
  const { data } = await api.get("/auth/me");
  return data;
};
