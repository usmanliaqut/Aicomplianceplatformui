import { create } from "zustand";
import { User } from "../types/user";

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  setUser: (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },
}));

export default useUserStore;
