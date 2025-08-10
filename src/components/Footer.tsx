import { FaInstagram, FaYoutube } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Navigation */}
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
          <div className="flex gap-6 font-rubik text-sm">
            <Link href="/dashboard" className="hover:text-flameYellow transition">Dashboard</Link>
            <Link href="/contact" className="hover:text-flameYellow transition">Contact us</Link>
          </div>
          
          {/* Social Icons */}
          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="bg-white text-black p-2 rounded hover:scale-105 transition">
              <FaInstagram size={20} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="bg-white text-black p-2 rounded hover:scale-105 transition">
              <FaYoutube size={20} />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-4"></div>

        {/* Copyright */}
        <div className="text-center text-xs md:text-sm font-rubik opacity-80">
          © {new Date().getFullYear()} Burning Sawals. All Rights Reserved. Designed to deepen human connection.
        </div>
      </div>
    </footer>
  );
}
