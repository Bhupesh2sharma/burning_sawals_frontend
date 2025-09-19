"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../components/AuthProvider";
import { useRouter } from "next/navigation";


export default function PhoneNumberPage() {
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [isExistingUser, setIsExistingUser] = useState<boolean | null>(null);
    const { sendOTP } = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: { phone: "" },
    });


    const onSubmit = async (data: any) => {
        setApiError("");
        setLoading(true);

        try {
            const result = await sendOTP(data.phone, "");

            if (result.success) {
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
            }
        } catch (err: any) {
            // Handle different types of errors
            if (err.response?.status === 429) {
                setApiError("Too many requests. Please wait a few minutes before trying again.");
            } else if (err.response?.data?.message) {
                setApiError(`Backend Error: ${err.response.data.message}`);
            } else if (err.response?.data?.error) {
                setApiError(`Backend Error: ${err.response.data.error}`);
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
                            Phone No. -
                        </label>
                        <input
                            type="tel"
                            placeholder=""
                            className="bg-gray-200 rounded-lg px-4 py-3 w-full text-lg font-quicksand"
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
                    </div>
                    {errors.phone && (
                        <span className="text-red-500 text-sm font-quicksand">
                            {errors.phone.message as string}
                        </span>
                    )}


                    <button
                        type="submit"
                        className="bg-rose-700 text-pink-100 py-3 px-6 rounded-lg font-bold font-quicksand text-2xl hover:bg-rose-800 transition disabled:opacity-50 disabled:cursor-not-allowed w-full"
                        disabled={loading || otpSent}
                    >
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                    
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
