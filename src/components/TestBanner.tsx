"use client";

import React, { useState } from "react";
import { FiAlertTriangle, FiZap } from "react-icons/fi";

export default function TestBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 animate-gradient-x"></div>

            {/* Animated border */}
            <div className="absolute inset-0 border-b-2 border-white/30"></div>

            {/* Main content */}
            <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white py-6 px-4 z-50 shadow-2xl">
                <div className="max-w-7xl mx-auto flex items-center justify-center">
                    <div className="flex items-center space-x-6">
                        {/* Animated icon section */}
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <FiZap
                                    size={28}
                                    className="text-yellow-300 animate-bounce"
                                />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full animate-ping"></div>
                            </div>
                            <FiAlertTriangle
                                size={26}
                                className="text-yellow-200 animate-pulse"
                            />
                        </div>

                        {/* Animated dots */}
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
                            <div
                                className="w-4 h-4 bg-white rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                                className="w-4 h-4 bg-white rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                            ></div>
                        </div>

                        {/* Text content */}
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <div className="flex items-center space-x-3">
                                <span className="font-black text-xl sm:text-2xl bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                                    🧪 TEST ENVIRONMENT
                                </span>
                                <div className="hidden sm:block w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                <div
                                    className="hidden sm:block w-2 h-2 bg-white rounded-full animate-pulse"
                                    style={{ animationDelay: "0.5s" }}
                                ></div>
                                <div
                                    className="hidden sm:block w-2 h-2 bg-white rounded-full animate-pulse"
                                    style={{ animationDelay: "1s" }}
                                ></div>
                            </div>
                            <span className="text-base sm:text-lg text-yellow-100 font-medium">
                                Development version • Happy Testing! 🎉
                            </span>
                        </div>
                    </div>
                </div>

                {/* Animated bottom border */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"></div>
            </div>

            {/* Custom animations */}
            <style jsx>{`
                @keyframes gradient-x {
                    0%,
                    100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 3s ease infinite;
                }
            `}</style>
        </div>
    );
}
