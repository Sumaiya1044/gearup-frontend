import { create } from "zustand";

export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "ACTIVE" | "SUSPENDED";
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  loadAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  login: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({
      token,
      user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },

  loadAuth: () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser) as AuthUser;

        set({
          token,
          user,
          isAuthenticated: true,
        });
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  },
}));