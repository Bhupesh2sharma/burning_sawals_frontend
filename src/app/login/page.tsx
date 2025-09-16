"use client";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../components/AuthProvider";
import { useRouter } from "next/navigation";
import RecaptchaV3 from "../../components/RecaptchaV3";
import { executeRecaptchaV3 } from "../../components/RecaptchaV3";

declare global {
    interface Window {
        grecaptcha: any;
    }
}

export default function PhoneNumberPage() {
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [isExistingUser, setIsExistingUser] = useState<boolean | null>(null);
    const [captchaError, setCaptchaError] = useState("");
    const [recaptchaReady, setRecaptchaReady] = useState(false);
    const { sendOTP } = useAuth();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: { phone: "" },
    });

    // Debug: Log validation errors
    useEffect(() => {
        console.log("Form errors:", errors);
    }, [errors]);

    const onSubmit = async (data: any) => {
        console.log("onSubmit called with:", data);
        console.log("recaptchaReady:", recaptchaReady);
        setApiError("");
        setCaptchaError("");
        setLoading(true);

        // For reCAPTCHA v3, we need to execute it when the form is submitted
        let captchaToken: string;
        try {
            if (!recaptchaReady) {
                setCaptchaError(
                    "Security verification is still loading. Please wait a moment."
                );
                setLoading(false);
                return;
            }

            console.log("Executing reCAPTCHA v3 for form submission...");
            captchaToken = await executeRecaptchaV3(
                process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
                    "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
                "submit"
            );
            console.log("reCAPTCHA token obtained:", captchaToken);
        } catch (error) {
            console.error("reCAPTCHA execution error:", error);
            setCaptchaError("Security verification failed. Please try again.");
            setLoading(false);
            return;
        }

        try {
            console.log(
                "Sending OTP to:",
                data.phone,
                "with token:",
                captchaToken
            );
            const result = await sendOTP(data.phone, captchaToken);

            if (result.success) {
                console.log("OTP sent successfully");
                setOtpSent(true);
                setIsExistingUser(result.is_existing_user || false);
                localStorage.setItem("auth_phone", data.phone);
                localStorage.setItem(
                    "is_existing_user",
                    String(result.is_existing_user || false)
                );
                router.push("/verify-otp");
            } else {
                setApiError(result.message);
                // Clear CAPTCHA token on error for retry
                setCaptchaToken("");
            }
        } catch (err: any) {
            console.error("Error sending OTP:", err);
            setApiError("Failed to send OTP");
            // Clear CAPTCHA token on error for retry
            setCaptchaToken("");
        } finally {
            setLoading(false);
        }
    };

    const handleCaptchaError = (error: string) => {
        setCaptchaError(error);
    };

    const handleRecaptchaReady = () => {
        console.log("reCAPTCHA is ready");
        setRecaptchaReady(true);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md flex flex-col items-center">
                <h1 className="text-3xl font-bold text-rose-700 mb-6">
                    Login / Register
                </h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full flex flex-col gap-4"
                >
                    <input
                        type="tel"
                        placeholder="Enter your phone number"
                        className="border rounded px-4 py-2 w-full"
                        {...register("phone", {
                            required: "Phone number is required",
                            validate: (value) => {
                                const cleaned = value.replace(/\D/g, "");
                                if (cleaned.length !== 10) {
                                    return "Phone number must be 10 digits";
                                }
                                if (
                                    !["6", "7", "8", "9"].includes(cleaned[0])
                                ) {
                                    return "Phone number must start with 6, 7, 8, or 9";
                                }
                                return true;
                            },
                        })}
                        disabled={loading || otpSent}
                    />
                    {errors.phone && (
                        <span className="text-red-500 text-sm">
                            {errors.phone.message as string}
                        </span>
                    )}

                    {/* reCAPTCHA v3 Component */}
                    <RecaptchaV3
                        siteKey={
                            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
                            "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                        }
                        onVerify={() => {}} // Not used since we execute manually
                        onError={handleCaptchaError}
                        onReady={handleRecaptchaReady}
                    />
                    {captchaError && (
                        <div className="text-red-500 text-sm text-center">
                            {captchaError}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="bg-rose-700 text-white py-2 rounded font-semibold hover:bg-rose-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading || otpSent}
                        onClick={() =>
                            console.log(
                                "Button clicked, loading:",
                                loading,
                                "otpSent:",
                                otpSent
                            )
                        }
                    >
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                    {apiError && (
                        <div className="text-red-600 text-sm text-center">
                            {apiError}
                        </div>
                    )}
                    {otpSent && (
                        <div className="text-green-600 text-sm text-center">
                            OTP sent! Please check your phone.
                        </div>
                    )}
                </form>
                <div className="mt-4 text-xs text-gray-500">
                    By continuing, you agree to our{" "}
                    <a href="#" className="underline">
                        Terms and Conditions
                    </a>
                    .
                </div>
            </div>
        </div>
    );
}
