import React from "react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100">
      <h1 className="text-4xl font-bold text-rose-700 mb-8 mt-4 text-center">Sign in</h1>
      <div className="w-full max-w-md flex flex-col items-center">
        <label className="self-start text-rose-700 font-semibold mb-2 ml-2" htmlFor="phone">Phone No. -</label>
        <input
          id="phone"
          type="tel"
          className="w-full rounded-xl bg-gray-200 px-4 py-4 mb-8 outline-none text-lg"
          placeholder="Enter your phone number"
        />
        <div className="w-full flex flex-col items-center">
          <span className="font-semibold mb-4">OTP</span>
          <div className="flex gap-4">
            {[0, 1, 2, 3].map((i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                className="w-14 h-14 border-2 border-black rounded-md text-center text-2xl focus:outline-none bg-white"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
