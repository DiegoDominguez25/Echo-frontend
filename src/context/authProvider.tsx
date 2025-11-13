import { useState, type ReactNode, useEffect } from "react";
import type { AuthContextType, AuthUser } from "./authContext";
import { AuthContext } from "./authContext";
import type { UserApplicationData } from "@/data/interfaces/UserData";
import { userService } from "@/services/api/user/userService";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState<UserApplicationData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading || !user) {
      setProfileLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setProfileLoading(true);
        const response = await userService.getUserApplication(user.id);
        setProfile(response.data);
      } catch (error) {
        console.error(
          "AuthProvider: Error al cargar el perfil del usuario:",
          error
        );
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, authLoading]);

  const login = (userData: AuthUser, token: string) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const value: AuthContextType = {
    user,
    profile,
    isAuthenticated: !!user,
    login,
    logout,
    authLoading,
  };

  if (authLoading || profileLoading) {
    return <div>Loading session...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
