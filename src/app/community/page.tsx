import React from "react";

const messages = [
  {
    avatar: "👩🏽‍🦱",
    text: "What's the best moisturizer?",
    type: "question",
  },
  {
    avatar: "👩‍🎤",
    text: "Cetaphil",
    type: "answer",
  },
  {
    avatar: "🧑‍🎤",
    text: "That’s overrated",
    type: "answer",
  },
  {
    avatar: "🧑‍💻",
    text: "Try CeraVe",
    type: "answer",
  },
  {
    avatar: "🧑‍🔬",
    text: "Honestly Ponds worked best for me hahahaha",
    type: "answer",
  },
  {
    avatar: "👩🏽‍🦱",
    text: "How to fix roomate problems?",
    type: "question",
  },
  {
    avatar: "👩🏽‍🦱",
    text: "What's the best dating app?",
    type: "question",
  },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-pink-100 px-2 pt-4 pb-2 flex flex-col items-center">
      <h1 className="text-2xl font-serif font-bold mb-4 w-full text-left pl-2">Community Chit-Chats</h1>
      <div className="w-full max-w-md flex flex-col gap-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="text-2xl mt-1">{msg.avatar}</span>
            <span
              className={
                msg.type === "question"
                  ? "bg-sky-200 text-black rounded-xl px-3 py-2 font-medium max-w-[80%]"
                  : "bg-gray-200 text-black rounded-xl px-3 py-2 font-serif max-w-[80%]"
              }
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
