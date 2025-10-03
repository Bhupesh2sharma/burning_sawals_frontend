"use client";
import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode,
} from "react";
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
    sendOTP: (
        phoneNumber: string,
        captchaToken: string
    ) => Promise<{
        success: boolean;
        message: string;
        otp_id?: string;
        is_existing_user?: boolean;
    }>;
    verifyOTP: (
        phoneNumber: string,
        otp: string,
        userName?: string
    ) => Promise<{ success: boolean; user?: User; message: string }>;
    checkUsername: (
        userName: string
    ) => Promise<{ success: boolean; available: boolean; message: string }>;
    logout: () => void;
    refreshToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start as true to check local storage

    useEffect(() => {
        const storedToken = localStorage.getItem("auth_token");
        if (storedToken) {
            setToken(storedToken);
            // In a real app, you'd verify the token with the backend here
            // For now, assume it's valid and fetch user info if needed
            // setUser(decodeToken(storedToken)); // Example: decode token to get user info
        }
        setIsLoading(false);
    }, []);

    const sendOTP = async (email: string, captchaToken: string) => {
        try {
            console.log("AuthProvider sendOTP called with:", {
                email,
                captchaToken: captchaToken
                    ? `${captchaToken.substring(0, 20)}...`
                    : "null",
                captchaTokenLength: captchaToken?.length,
            });

            const response = await AuthService.sendOTP(email, captchaToken);

            console.log("AuthService.sendOTP response:", response);

            return {
                success: true,
                message: response.data.message,
                otp_id: response.data.data.otp_id,
                is_existing_user: response.data.data.is_existing_user,
            };
        } catch (error: any) {
            console.error("AuthProvider sendOTP error:", error);
            console.error("Error response data:", error.response?.data);
            console.error("Error response status:", error.response?.status);

            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Failed to send OTP",
            };
        }
    };

    const verifyOTP = async (email: string, otp: string, userName?: string) => {
        try {
            const response = await AuthService.verifyOTP(email, otp, userName);
            const newToken = response.data.data.token;
            const newUser = response.data.data.user;
            localStorage.setItem("auth_token", newToken);
            setToken(newToken);
            setUser(newUser);
            return {
                success: true,
                user: newUser,
                message: response.data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                message:
                    error.response?.data?.message || "Failed to verify OTP",
            };
        }
    };

    const checkUsername = async (userName: string) => {
        try {
            const response = await AuthService.checkUsername(userName);
            return {
                success: true,
                available: response.data.data.available,
                message: response.data.data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                available: false,
                message:
                    error.response?.data?.message || "Failed to check username",
            };
        }
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
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
        checkUsername,
        logout,
        refreshToken,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
