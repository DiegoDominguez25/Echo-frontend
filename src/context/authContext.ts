import type { UserApplicationData } from "@/data/interfaces/UserData";
import { createContext } from "react";

export interface AuthUser {
  id: string;
  name: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  profile: UserApplicationData | null;
  isAuthenticated: boolean;
  login: (userData: AuthUser, token: string) => void;
  logout: () => void;
  authLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
