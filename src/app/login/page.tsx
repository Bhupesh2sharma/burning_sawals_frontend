"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthService } from "../../utils/api";
import { useRouter } from "next/navigation";

// Removed zod schema - using inline validation instead

export default function PhoneNumberPage() {
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
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
    setApiError("");
    setLoading(true);
    try {
      console.log("Sending OTP to:", data.phone);
      await AuthService.sendOTP(data.phone);
      console.log("OTP sent successfully");
      setOtpSent(true);
      localStorage.setItem("auth_phone", data.phone);
      router.push("/verify-otp");
    } catch (err: any) {
      console.error("Error sending OTP:", err);
      setApiError(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold text-rose-700 mb-6">Login / Register</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
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
                if (!["6", "7", "8", "9"].includes(cleaned[0])) {
                  return "Phone number must start with 6, 7, 8, or 9";
                }
                return true;
              }
            })}
            disabled={loading || otpSent}
          />
          {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message as string}</span>}
          <button
            type="submit"
            className="bg-rose-700 text-white py-2 rounded font-semibold hover:bg-rose-800 transition"
            disabled={loading || otpSent}
            onClick={() => console.log("Button clicked, loading:", loading, "otpSent:", otpSent)}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
          {apiError && <div className="text-red-600 text-sm text-center">{apiError}</div>}
          {otpSent && <div className="text-green-600 text-sm text-center">OTP sent! Please check your phone.</div>}
        </form>
        <div className="mt-4 text-xs text-gray-500">
          By continuing, you agree to our <a href="#" className="underline">Terms and Conditions</a>.
        </div>
      </div>
    </div>
  );
}
