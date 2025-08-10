"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white text-[#BE1847] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-lg md:text-xl font-tilt font-bold">
          BurningSawals
        </Link>

        {/* Right side */}
        <div className="flex gap-3 items-center">
          <Link
            href="/login"
            className="px-4 py-2 bg-[#BE1847] text-white rounded-md font-rubik text-sm md:text-base hover:bg-flameRed transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-[#BE1847] font-rubik text-sm md:text-base hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}
