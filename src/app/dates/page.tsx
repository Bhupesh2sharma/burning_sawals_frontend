import React from "react";

export default function DatesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-pink-100">
      {/* Top Bar */}
      <header className="flex items-center justify-center relative py-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl cursor-pointer">🏠</span>
        <h1 className="text-xl font-bold text-black text-center">Dates <span>🥲</span></h1>
      </header>

      {/* Category Buttons */}
      <div className="flex gap-2 justify-center mb-4 px-2">
        <button className="bg-rose-700 text-white rounded-full px-4 py-2 text-xs font-semibold shadow">Conversation starters</button>
        <button className="bg-rose-300 text-black rounded-full px-4 py-2 text-xs font-semibold shadow">Rapid Fire</button>
        <button className="bg-rose-300 text-black rounded-full px-4 py-2 text-xs font-semibold shadow">Hot and Spicy</button>
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative bg-rose-700 rounded-xl w-full max-w-md mx-auto p-6 flex flex-col items-center min-h-[320px] shadow-lg">
          {/* Top label and icon */}
          <div className="flex w-full justify-between items-center mb-8">
            <span className="text-white text-lg font-semibold">Be honest</span>
            <span className="text-2xl">🌸</span>
          </div>
          {/* Question */}
          <div className="flex-1 flex items-center justify-center w-full">
            <span className="text-white text-center text-xl font-semibold px-2">
              What are the qualities<br />you are looking for in a partner?
            </span>
          </div>
          {/* Navigation arrows */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl text-white cursor-pointer select-none">&#60;</div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl text-white cursor-pointer select-none">&#62;</div>
          {/* Heart icon */}
          <div className="w-full flex justify-center mt-8">
            <span className="text-2xl text-white">❤️</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="flex justify-between items-center px-8 py-2 bg-pink-100 max-w-md mx-auto w-full mt-4">
        <span className="text-2xl">💬</span>
        <span className="text-2xl">👍</span>
        <span className="text-2xl">🔥</span>
        <span className="text-2xl">👎</span>
      </nav>

      {/* Footer */}
      <footer className="py-2 text-center text-xs text-black font-serif border-t border-gray-300 bg-pink-100">
        Designed to deepen human connection
      </footer>
    </div>
  );
}
