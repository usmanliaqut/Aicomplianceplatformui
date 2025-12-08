import { useMutation, useQuery } from "@tanstack/react-query";
import {
  loginUser,
  registerUser,
  getMe,
  LoginPayload,
  RegisterPayload,
} from "../api/auth";
import useUserStore from "../store/useUserStore";
import { useNavigate } from "react-router-dom";
import { User } from "../types/user";
import { toast } from "react-hot-toast";

export const useAuth = () => {
  const setUser = useUserStore((state) => state.setUser);
  const logout = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  // Login mutation: only store token
  const login = useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),
    onSuccess: ({ access_token }) => {
   
     localStorage.setItem("token", access_token); // save token
  
  
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });

  // Register mutation: only store token
  const register = useMutation({
    mutationFn: (payload: RegisterPayload) => registerUser(payload),
    onSuccess: ({ access_token }) => {
      localStorage.setItem("token", access_token);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });

  // Me query: fetch current user and populate store
  const me = useQuery<User, Error>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const user = await getMe();
        setUser(user); // set user only here
        return user;
      } catch (error) {
        localStorage.removeItem("token");
        logout();
        toast.error("Session expired. Please login again.");
        throw error;
      }
    },
    enabled: !!localStorage.getItem("token"),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  return { login, register, me };
};
