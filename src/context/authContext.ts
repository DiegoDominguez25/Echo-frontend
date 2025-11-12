import type { UserApplicationData } from "@/data/interfaces/UserData";
import { createContext } from "react";

export interface User {
  id: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  profile: UserApplicationData | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  authLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
