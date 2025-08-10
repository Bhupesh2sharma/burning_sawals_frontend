import React from "react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100">
      <h1 className="text-4xl font-bold text-rose-700 mb-8 mt-4 text-center">Register</h1>
      <div className="w-full max-w-md flex flex-col items-center">
        <label className="self-start text-rose-700 font-semibold mb-2 ml-2" htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          className="w-full rounded-xl bg-gray-200 px-4 py-4 mb-6 outline-none text-lg"
          placeholder="Enter your username"
        />
        <label className="self-start text-rose-700 font-semibold mb-2 ml-2" htmlFor="phone">Phone No. -</label>
        <input
          id="phone"
          type="tel"
          className="w-full rounded-xl bg-gray-200 px-4 py-4 mb-8 outline-none text-lg"
          placeholder="Enter your phone number"
        />
      </div>
    </div>
  );
}
