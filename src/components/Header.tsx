"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { FiLogOut, FiMessageSquare } from "react-icons/fi";

export default function Header() {
    // const { isAuthenticated, logout, user } = useAuth();
    const { isAuthenticated, logout, user } = useAuth();
    //  const isAuthenticated = true;
    return (
        <header className="bg-[#F8F8F8] text-[#BE1847] sticky top-0 z-50 shadow-[0_8px_32px_rgba(190,24,71,0.15)] backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center ">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-lg md:text-xl font-tilt font-bold"
                >
                    BurningSawals
                </Link>

                {/* Right side */}
                <div className="flex gap-3 items-center">
                    {isAuthenticated ? (
                        // Authenticated user buttons
                        <>
                            <span className="text-pink-600 text-sm md:text-base font-bold font-quicksand">
                                feedback & suggestions
                            </span>

                            <button
                                onClick={logout}
                                className="flex items-center justify-center w-10 h-10 text-[#BE1847] bg-gray-200 hover:bg-gray-300 rounded-full transition cursor-pointer"
                                title="Logout"
                            >
                                <FiLogOut size={18} />
                            </button>
                        </>
                    ) : (
                        // Non-authenticated user buttons
                        <>
                            <Link
                                href="/login"
                                className="px-4 py-2 bg-[#BE1847] text-white rounded-md font-rubik text-sm md:text-base hover:bg-flameRed transition cursor-pointer"
                            >
                                Login
                            </Link>
                            <Link
                                href="/login"
                                className="text-[#BE1847] font-rubik text-sm md:text-base hover:underline cursor-pointer"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
