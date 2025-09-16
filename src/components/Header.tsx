"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { FiLogOut, FiMessageSquare } from "react-icons/fi";

export default function Header() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="bg-white text-[#BE1847] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-lg md:text-xl font-tilt font-bold">
          BurningSawals
        </Link>

        {/* Right side */}
        <div className="flex gap-3 items-center">
          {isAuthenticated ? (
            // Authenticated user buttons
            <>
              <span className="text-gray-600 text-sm md:text-base font-rubik">
                Welcome, {user?.user_name || user?.phone_number}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-[#BE1847] font-rubik text-sm md:text-base hover:bg-gray-100 rounded-md transition"
                title="Logout"
              >
                <FiLogOut size={16} />
                Logout
              </button>
              <Link
                href="/feedback"
                className="flex items-center gap-2 px-4 py-2 text-[#BE1847] font-rubik text-sm md:text-base hover:bg-gray-100 rounded-md transition"
                title="Feedback & Suggestions"
              >
                <FiMessageSquare size={16} />
                Feedback
              </Link>
            </>
          ) : (
            // Non-authenticated user buttons
            <>
              <Link
                href="/login"
                className="px-4 py-2 bg-[#BE1847] text-white rounded-md font-rubik text-sm md:text-base hover:bg-flameRed transition"
              >
                Login
              </Link>
              <Link
                href="/login"
                className="text-[#BE1847] font-rubik text-sm md:text-base hover:underline"
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
