"use client";
import React from "react";

const dummyUsers = [
  {
    name: "John Doe",
    phone: "123-456-7890",
    payment: "Paid",
    swipes: 12,
    skips: 3,
    likes: 5,
    dislikes: 2,
    superlikes: 1,
  },

  {
    name: "Jane Smith",
    phone: "987-654-3210",
    payment: "Unpaid",
    swipes: 8,
    skips: 1,
    likes: 3,
    dislikes: 1,
    superlikes: 0,
  },
  
];

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-gray-200 py-2 px-4 text-center font-medium text-sm border-b">Admin</div>
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-48 bg-white border-r flex flex-col pt-6">
          <button className="text-left px-6 py-2 text-gray-700 hover:bg-gray-100">Users</button>
          <button className="text-left px-6 py-2 text-gray-700 hover:bg-gray-100">Add Questions</button>
          <button className="text-left px-6 py-2 text-gray-700 font-semibold bg-gray-100 border-l-4 border-pink-400">Analytics</button>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left font-semibold">Sl.</th>
                  <th className="px-4 py-2 text-left font-semibold">Name</th>
                  <th className="px-4 py-2 text-left font-semibold">Phone No.</th>
                  <th className="px-4 py-2 text-left font-semibold">Payment</th>
                  <th className="px-4 py-2 text-left font-semibold">How many cards they swipe</th>
                  <th className="px-4 py-2 text-left font-semibold">How many cards they skip</th>
                  <th className="px-4 py-2 text-left font-semibold">Cards they like</th>
                  <th className="px-4 py-2 text-left font-semibold">Cards they dislike</th>
                  <th className="px-4 py-2 text-left font-semibold">Cards they superlike</th>
                </tr>
              </thead>
              <tbody>
                {dummyUsers.map((user, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.phone}</td>
                    <td className="px-4 py-2">{user.payment}</td>
                    <td className="px-4 py-2">{user.swipes}</td>
                    <td className="px-4 py-2">{user.skips}</td>
                    <td className="px-4 py-2">{user.likes}</td>
                    <td className="px-4 py-2">{user.dislikes}</td>
                    <td className="px-4 py-2">{user.superlikes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
