"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../components/AuthProvider";
import { useRouter } from "next/navigation";
import RecaptchaV3, { executeRecaptchaV3 } from "../../components/RecaptchaV3";

export default function EmailPage() {
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [, setIsExistingUser] = useState<boolean | null>(null);
    const [recaptchaError, setRecaptchaError] = useState("");
    const { sendOTP } = useAuth();
    const router = useRouter();

    const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

    // Debug: Log the site key on component mount
    React.useEffect(() => {
        console.log(
            "Login page loaded - RECAPTCHA_SITE_KEY:",
            RECAPTCHA_SITE_KEY
        );
        console.log("Environment variables:", {
            NEXT_PUBLIC_RECAPTCHA_SITE_KEY:
                process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
            NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        });
    }, [RECAPTCHA_SITE_KEY]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: { email: "" },
    });

    const onSubmit = async (data: { email: string }) => {
        setApiError("");
        setRecaptchaError("");
        setLoading(true);

        try {
            // Generate reCAPTCHA token
            console.log(
                "Generating reCAPTCHA token with site key:",
                RECAPTCHA_SITE_KEY
            );
            const captchaToken = await executeRecaptchaV3(
                RECAPTCHA_SITE_KEY,
                "send_otp"
            );
            console.log(
                "reCAPTCHA token generated:",
                captchaToken ? "success" : "failed"
            );

            const result = await sendOTP(data.email, captchaToken);

            if (result.success) {
                setOtpSent(true);
                setIsExistingUser(result.is_existing_user || false);
                localStorage.setItem("auth_email", data.email);
                localStorage.setItem(
                    "is_existing_user",
                    String(result.is_existing_user || false)
                );
                router.push("/verify-otp");
            } else {
                setApiError(result.message);
            }
        } catch (err: unknown) {
            console.error("Login error:", err);

            // Handle reCAPTCHA errors
            if (err instanceof Error && err.message.includes("reCAPTCHA")) {
                setRecaptchaError(
                    "Security verification failed. Please refresh the page and try again."
                );
            }
            // Handle different types of errors
            else if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as {
                    response?: {
                        status?: number;
                        data?: { message?: string; error?: string };
                    };
                };
                if (axiosError.response?.status === 429) {
                    setApiError(
                        "Too many requests. Please wait a few minutes before trying again."
                    );
                } else if (axiosError.response?.data?.message) {
                    setApiError(
                        `Backend Error: ${axiosError.response.data.message}`
                    );
                } else if (axiosError.response?.data?.error) {
                    setApiError(
                        `Backend Error: ${axiosError.response.data.error}`
                    );
                } else {
                    setApiError("Failed to send OTP. Please try again.");
                }
            } else {
                setApiError("Failed to send OTP. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100">
            <div className=" p-8  w-full max-w-md flex flex-col items-center">
                <h1 className="text-3xl font-bold text-rose-700 mb-6 font-quicksand">
                    Sign in / Register
                </h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full flex flex-col gap-4"
                >
                    <div className="w-full">
                        <label className="text-xl text-rose-700 mb-2 font-quicksand block">
                            Email Address -
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="bg-gray-200 rounded-lg px-4 py-3 w-full text-lg font-quicksand"
                            {...register("email", {
                                required: "Email address is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message:
                                        "Please enter a valid email address",
                                },
                            })}
                            disabled={loading || otpSent}
                        />
                    </div>
                    {errors.email && (
                        <span className="text-red-500 text-sm font-quicksand">
                            {errors.email.message as string}
                        </span>
                    )}

                    {/* reCAPTCHA Component */}
                    <RecaptchaV3
                        siteKey={RECAPTCHA_SITE_KEY}
                        onVerify={(token) => {
                            console.log(
                                "reCAPTCHA verified:",
                                token ? "success" : "failed"
                            );
                        }}
                        onError={(error) => {
                            console.error("reCAPTCHA error:", error);
                            setRecaptchaError(error);
                        }}
                        onReady={() => {
                            console.log("reCAPTCHA ready");
                        }}
                    />

                    <button
                        type="submit"
                        className="bg-rose-700 text-pink-100 py-3 px-6 rounded-lg font-bold font-quicksand text-2xl hover:bg-rose-800 transition disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer"
                        disabled={loading || otpSent}
                    >
                        {loading ? "Sending..." : "Send OTP"}
                    </button>

                    {recaptchaError && (
                        <div className="text-red-600 text-sm text-center font-quicksand">
                            {recaptchaError}
                        </div>
                    )}
                    {apiError && (
                        <div className="text-red-600 text-sm text-center font-quicksand">
                            {apiError}
                        </div>
                    )}
                    {otpSent && (
                        <div className="text-green-600 text-sm text-center font-quicksand">
                            OTP sent! Please check your phone.
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
