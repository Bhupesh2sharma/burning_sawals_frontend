"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { AuthService } from "../../utils/api";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";

export default function OTPVerificationPage() {
  const router = useRouter();
  const { verifyOTP } = useAuth();
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const storedPhone = localStorage.getItem("auth_phone");
    if (!storedPhone) {
      router.push("/login");
    } else {
      setPhone(storedPhone);
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { otp: "" },
  });

  const resendOTP = async () => {
    setApiError("");
    setLoading(true);
    try {
      await AuthService.sendOTP(phone);
      setOtpSent(true);
      console.log("OTP resent successfully");
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      setApiError(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };


  const onSubmit = async (data: any) => {
    if (!userName.trim()) {
      setApiError("Please enter your name");
      return;
    }
    
    console.log("OTP verification started with:", { phone, otp: data.otp, userName });
    setApiError("");
    setLoading(true);
    try {
      const result = await verifyOTP(phone, data.otp, userName);
      
      if (result.success) {
        console.log("Verification successful, redirecting to home");
        setSuccess(true);
        setTimeout(() => {
          router.push("/home");
        }, 1000);
      } else {
        setApiError(result.message);
      }
    } catch (err: any) {
      console.error("OTP verification error:", err);
      setApiError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold text-rose-700 mb-6">Verify OTP</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
          <div className="text-center text-gray-600 mb-2">
            Enter the 6-digit OTP sent to {phone}
          </div>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            className="border rounded px-4 py-2 w-full text-center tracking-widest text-lg"
            maxLength={6}
            {...register("otp", {
              required: "OTP is required",
              validate: (value) => {
                if (value.length !== 6) {
                  return "OTP must be exactly 6 digits";
                }
                if (!/^\d{6}$/.test(value)) {
                  return "OTP must contain only digits";
                }
                return true;
              }
            })}
            disabled={loading || success}
          />
          {errors.otp && <span className="text-red-500 text-sm">{errors.otp.message as string}</span>}
          
          <input
            type="text"
            placeholder="Enter your name"
            className="border rounded px-4 py-2 w-full"
            value={userName}
            onChange={e => setUserName(e.target.value)}
            disabled={loading || success}
            required
          />
          
          <button
            type="submit"
            className="bg-rose-700 text-white py-2 rounded font-semibold hover:bg-rose-800 transition"
            disabled={loading || success || !userName.trim()}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          {!success && (
            <button
              type="button"
              onClick={resendOTP}
              className="text-rose-600 text-sm underline hover:text-rose-800 transition"
              disabled={loading}
            >
              Resend OTP
            </button>
          )}
          {apiError && <div className="text-red-600 text-sm text-center">{apiError}</div>}
          {success && <div className="text-green-600 text-sm text-center">OTP verified! Redirecting...</div>}
        </form>
      </div>
    </div>
  );
}
