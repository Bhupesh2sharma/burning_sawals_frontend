"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";

export default function OTPVerificationPage() {
    const router = useRouter();
    const { verifyOTP, checkUsername, sendOTP } = useAuth();
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [isExistingUser, setIsExistingUser] = useState<boolean | null>(null);
    const [usernameStatus, setUsernameStatus] = useState<
        "idle" | "checking" | "available" | "taken"
    >("idle");
    const [usernameError, setUsernameError] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [otpInputs, setOtpInputs] = useState<HTMLInputElement[]>([]);
    const [currentStep, setCurrentStep] = useState<"username" | "otp">(
        "username"
    );
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const storedEmail = localStorage.getItem("auth_email");
        const storedUserStatus = localStorage.getItem("is_existing_user");

        if (!storedEmail) {
            router.push("/login");
        } else {
            setEmail(storedEmail);
            const isExisting = storedUserStatus === "true";
            setIsExistingUser(isExisting);
            // Skip username step for existing users
            if (isExisting) {
                setCurrentStep("otp");
            }
        }
    }, [router]);

    // Real-time username validation with debouncing
    useEffect(() => {
        if (!userName || userName.length < 3 || isExistingUser) {
            setUsernameStatus("idle");
            setUsernameError("");
            return;
        }

        const timeoutId = setTimeout(async () => {
            setUsernameStatus("checking");
            try {
                const result = await checkUsername(userName);
                if (result.success) {
                    setUsernameStatus(result.available ? "available" : "taken");
                    setUsernameError(
                        result.available ? "" : "Username is already taken"
                    );
                } else {
                    setUsernameStatus("idle");
                    setUsernameError("Failed to check username");
                }
            } catch (error) {
                setUsernameStatus("idle");
                setUsernameError("Failed to check username");
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [userName, isExistingUser, checkUsername]);

    // OTP handling functions
    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return; // Only allow single digit

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all digits are entered
        if (newOtp.every((digit) => digit !== "") && !newOtp.includes("")) {
            handleOtpSubmit(newOtp.join(""));
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);
        const newOtp = [...otp];

        for (let i = 0; i < pastedData.length && i < 6; i++) {
            newOtp[i] = pastedData[i];
        }

        setOtp(newOtp);

        // Focus the next empty input or the last one
        const nextEmptyIndex = newOtp.findIndex((digit) => digit === "");
        const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
        otpRefs.current[focusIndex]?.focus();

        // Auto-submit if all digits are filled
        if (newOtp.every((digit) => digit !== "")) {
            handleOtpSubmit(newOtp.join(""));
        }
    };

    const resendOTP = async () => {
        setApiError("");
        setLoading(true);
        try {
            // For resend, we'll need to show CAPTCHA again
            // For now, we'll use a placeholder token - in production, you'd want to show CAPTCHA again
            const result = await sendOTP(email, "resend-token-placeholder");
            if (result.success) {
                console.log("OTP resent successfully");
                setIsExistingUser(result.is_existing_user || false);
                localStorage.setItem(
                    "is_existing_user",
                    String(result.is_existing_user || false)
                );
            } else {
                setApiError(result.message);
            }
        } catch (err: any) {
            console.error("Resend OTP error:", err);

            // Handle different types of errors
            if (err.response?.status === 429) {
                setApiError(
                    "Too many OTP requests. Please wait a few minutes before trying again."
                );
            } else if (err.response?.data?.message) {
                setApiError(err.response.data.message);
            } else {
                setApiError("Failed to resend OTP. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle username step completion
    const handleUsernameNext = () => {
        if (!userName.trim()) {
            setApiError("Username is required");
            return;
        }

        if (usernameStatus !== "available") {
            setApiError("Please choose an available username");
            return;
        }

        setCurrentStep("otp");
        setApiError("");
    };

    // Handle OTP submission
    const handleOtpSubmit = async (otpValue: string) => {
        console.log("OTP verification started with:", {
            email,
            otp: otpValue,
            userName,
            isExistingUser,
        });
        setApiError("");
        setLoading(true);
        try {
            const result = await verifyOTP(
                email,
                otpValue,
                isExistingUser ? undefined : userName
            );

            if (result.success) {
                console.log("Verification successful, redirecting to home");
                setSuccess(true);
                // Clear stored data
                localStorage.removeItem("auth_email");
                localStorage.removeItem("is_existing_user");
                setTimeout(() => {
                    router.push("/home");
                }, 1000);
            } else {
                setApiError(result.message);
                // Clear OTP on error
                setOtp(["", "", "", "", "", ""]);
                otpRefs.current[0]?.focus();
            }
        } catch (err: any) {
            console.error("OTP verification error:", err);

            // Handle different types of errors
            if (err.response?.status === 429) {
                setApiError(
                    "Too many verification attempts. Please wait a few minutes before trying again."
                );
            } else if (err.response?.data?.message) {
                setApiError(err.response.data.message);
            } else {
                setApiError("An unexpected error occurred. Please try again.");
            }

            // Clear OTP on error
            setOtp(["", "", "", "", "", ""]);
            otpRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md flex flex-col items-center">
                <h1 className="text-3xl font-bold text-rose-700 mb-6">
                    {isExistingUser ? "Welcome Back!" : "Complete Registration"}
                </h1>

                {/* Progress indicator */}
                <div className="flex items-center justify-center mb-8">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            currentStep === "username"
                                ? "bg-rose-700 text-white"
                                : "bg-green-500 text-white"
                        }`}
                    >
                        1
                    </div>
                    <div
                        className={`w-16 h-1 mx-2 ${
                            currentStep === "otp"
                                ? "bg-green-500"
                                : "bg-gray-300"
                        }`}
                    ></div>
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            currentStep === "otp"
                                ? "bg-rose-700 text-white"
                                : "bg-gray-300 text-gray-600"
                        }`}
                    >
                        2
                    </div>
                </div>

                {/* Step 1: Username (for new users only) */}
                {currentStep === "username" && !isExistingUser && (
                    <div className="w-full flex flex-col gap-4">
                        <div className="text-center text-gray-600 mb-2">
                            Choose a username to continue
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Choose a username"
                                className={`border rounded px-4 py-3 w-full text-center text-lg ${
                                    usernameStatus === "taken"
                                        ? "border-red-500"
                                        : usernameStatus === "available"
                                        ? "border-green-500"
                                        : "border-gray-300"
                                }`}
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                disabled={loading || success}
                                autoFocus
                            />

                            {/* Real-time username feedback */}
                            {usernameStatus === "checking" && (
                                <div className="text-blue-500 text-sm text-center mt-2">
                                    <div className="inline-flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                                        Checking availability...
                                    </div>
                                </div>
                            )}
                            {usernameStatus === "available" && (
                                <div className="text-green-500 text-sm text-center mt-2">
                                    ✓ Username is available
                                </div>
                            )}
                            {usernameStatus === "taken" && (
                                <div className="text-red-500 text-sm text-center mt-2">
                                    ✗ Username is already taken
                                </div>
                            )}
                            {usernameError && (
                                <div className="text-red-500 text-sm text-center mt-2">
                                    {usernameError}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleUsernameNext}
                            className="bg-rose-700 text-white py-3 rounded font-semibold hover:bg-rose-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={
                                loading ||
                                success ||
                                !userName.trim() ||
                                usernameStatus !== "available"
                            }
                        >
                            Continue to OTP
                        </button>
                    </div>
                )}

                {/* Step 2: OTP */}
                {currentStep === "otp" && (
                    <div className="w-full flex flex-col gap-4">
                        <div className="text-center text-gray-600 mb-2">
                            Enter the 6-digit OTP sent to {email}
                        </div>

                        {/* Back button for new users */}
                        {!isExistingUser && (
                            <button
                                onClick={() => setCurrentStep("username")}
                                className="text-gray-500 text-sm underline hover:text-gray-700 transition self-start"
                                disabled={loading || success}
                            >
                                ← Back to username
                            </button>
                        )}

                        {/* OTP Input Squares */}
                        <div className="flex justify-center gap-3 mb-4">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => {
                                        otpRefs.current[index] = el;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) =>
                                        handleOtpChange(index, e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        handleOtpKeyDown(index, e)
                                    }
                                    onPaste={
                                        index === 0 ? handleOtpPaste : undefined
                                    }
                                    className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loading || success}
                                    autoComplete="off"
                                />
                            ))}
                        </div>

                        <div className="text-center text-sm text-gray-500 mb-4">
                            OTP will be submitted automatically when all digits
                            are entered
                        </div>

                        {!success && (
                            <button
                                type="button"
                                onClick={resendOTP}
                                className="text-rose-600 text-sm underline hover:text-rose-800 transition disabled:opacity-50"
                                disabled={loading}
                            >
                                Resend OTP
                            </button>
                        )}
                    </div>
                )}

                {/* Error and Success Messages */}
                {apiError && (
                    <div className="text-red-600 text-sm text-center mt-4 p-3 bg-red-50 rounded-lg">
                        {apiError}
                    </div>
                )}
                {success && (
                    <div className="text-green-600 text-sm text-center mt-4 p-3 bg-green-50 rounded-lg">
                        OTP verified! Redirecting...
                    </div>
                )}
            </div>
        </div>
    );
}
