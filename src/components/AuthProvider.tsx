"use client";
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { AuthService } from "../utils/api";
import { useRouter } from "next/navigation";

interface User {
  user_id: string;
  phone_number: string;
  is_new_user?: boolean;
  user_name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sendOTP: (phoneNumber: string) => Promise<{ success: boolean; message: string; otp_id?: string }>;
  verifyOTP: (phoneNumber: string, otp: string, userName?: string) => Promise<{ success: boolean; user?: User; message: string }>;
  login: (phoneNumber: string, otp: string) => Promise<{ success: boolean; user?: User; message: string }>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true to check local storage

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");
    
    if (storedToken) {
      setToken(storedToken);
      // Try to parse stored user data
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (error) {
          console.error("Error parsing stored user data:", error);
        }
      }
    }
    setIsLoading(false);
  }, []);

  const sendOTP = async (phoneNumber: string) => {
    try {
      const response = await AuthService.sendOTP(phoneNumber);
      return { success: true, message: response.data.message, otp_id: response.data.data.otp_id };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to send OTP" };
    }
  };

  const verifyOTP = async (phoneNumber: string, otp: string, userName?: string) => {
    try {
      const response = await AuthService.verifyOTP(phoneNumber, otp, userName);
      const newToken = response.data.data.token;
      const newUser = response.data.data.user;
      localStorage.setItem("auth_token", newToken);
      localStorage.setItem("auth_user", JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      return { success: true, user: newUser, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to verify OTP" };
    }
  };

  const login = async (phoneNumber: string, otp: string) => {
    try {
      const response = await AuthService.login(phoneNumber, otp);
      const newToken = response.data.data.token;
      const loggedInUser = response.data.data.user;
      localStorage.setItem("auth_token", newToken);
      localStorage.setItem("auth_user", JSON.stringify(loggedInUser));
      setToken(newToken);
      setUser(loggedInUser);
      return { success: true, user: loggedInUser, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
    // router.push("/login"); // Redirect to login after logout
  };

  const refreshToken = async () => {
    // Implement token refresh logic here
    console.log("Refresh token not implemented yet.");
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    sendOTP,
    verifyOTP,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

