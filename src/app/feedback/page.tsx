"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiMessageSquare, FiStar } from "react-icons/fi";

export default function FeedbackPage() {
    const [submitted, setSubmitted] = useState(false);
    const [rating, setRating] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (data: any) => {
        console.log("Feedback submitted:", { ...data, rating });
        setSubmitted(true);
        reset();
        setRating(0);

        // Here you would typically send the feedback to your backend
        // await submitFeedback({ ...data, rating });
    };

    const handleRatingClick = (value: number) => {
        setRating(value);
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
                    <div className="text-green-600 text-6xl mb-4">✓</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        Thank You!
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Your feedback has been submitted successfully. We
                        appreciate your input!
                    </p>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="px-6 py-2 bg-[#BE1847] text-white rounded-md hover:bg-[#A0153A] transition cursor-pointer"
                    >
                        Submit Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-pink-100 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <FiMessageSquare className="text-[#BE1847]" size={32} />
                        <h1 className="text-3xl font-bold text-gray-800">
                            Feedback & Suggestions
                        </h1>
                    </div>

                    <p className="text-gray-600 mb-8">
                        We'd love to hear your thoughts! Help us improve
                        BurningSawals by sharing your feedback, suggestions, or
                        reporting any issues.
                    </p>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                How would you rate your experience?
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => handleRatingClick(value)}
                                        className={`p-2 rounded-full transition cursor-pointer ${
                                            value <= rating
                                                ? "text-yellow-400 bg-yellow-50"
                                                : "text-gray-300 hover:text-yellow-400"
                                        }`}
                                    >
                                        <FiStar
                                            size={24}
                                            fill={
                                                value <= rating
                                                    ? "currentColor"
                                                    : "none"
                                            }
                                        />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="text-sm text-gray-600 mt-2">
                                    {rating === 1 && "Poor"}
                                    {rating === 2 && "Fair"}
                                    {rating === 3 && "Good"}
                                    {rating === 4 && "Very Good"}
                                    {rating === 5 && "Excellent"}
                                </p>
                            )}
                        </div>

                        {/* Feedback Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type of Feedback
                            </label>
                            <select
                                {...register("type", {
                                    required: "Please select a feedback type",
                                })}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#BE1847] focus:border-transparent"
                            >
                                <option value="">Select feedback type</option>
                                <option value="bug">Bug Report</option>
                                <option value="feature">Feature Request</option>
                                <option value="improvement">
                                    Improvement Suggestion
                                </option>
                                <option value="general">
                                    General Feedback
                                </option>
                                <option value="other">Other</option>
                            </select>
                            {errors.type && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.type.message as string}
                                </p>
                            )}
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subject
                            </label>
                            <input
                                type="text"
                                {...register("subject", {
                                    required: "Subject is required",
                                })}
                                placeholder="Brief description of your feedback"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#BE1847] focus:border-transparent"
                            />
                            {errors.subject && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.subject.message as string}
                                </p>
                            )}
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Message
                            </label>
                            <textarea
                                {...register("message", {
                                    required: "Message is required",
                                })}
                                rows={6}
                                placeholder="Please provide detailed feedback, suggestions, or describe any issues you encountered..."
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#BE1847] focus:border-transparent resize-none"
                            />
                            {errors.message && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.message.message as string}
                                </p>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Email (Optional)
                            </label>
                            <input
                                type="email"
                                {...register("email")}
                                placeholder="your.email@example.com"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#BE1847] focus:border-transparent"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                We'll only use this to follow up on your
                                feedback if needed
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 bg-[#BE1847] text-white py-3 px-6 rounded-md font-medium hover:bg-[#A0153A] transition focus:outline-none focus:ring-2 focus:ring-[#BE1847] focus:ring-offset-2 cursor-pointer"
                            >
                                Submit Feedback
                            </button>
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
