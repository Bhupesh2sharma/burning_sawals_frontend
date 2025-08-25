"use client";
import React, { useState } from "react";

const dummyQuestions = [
  {
    question: "What gets you in a bad mood?",
    prompt: "Take a shot and answer",
  },
  {
    question: "What gets you in a bad mood?",
    prompt: "Be honest",
  },
  {
    question:
      "What's one thing you've done out of your comfort zone that you are most proud of?",
    prompt: "Hi 5 each other",
  },
];

const categories = ["For First Dates", "For Friends", "For Family"];
const starters = ["Conversation Starters", "Deep Questions", "Fun Prompts"];

export default function AdminPage() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedStarter, setSelectedStarter] = useState(starters[0]);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showAddPrompt, setShowAddPrompt] = useState(false);
  const [questions, setQuestions] = useState(dummyQuestions);
  const [newQuestion, setNewQuestion] = useState("");
  const [newPrompt, setNewPrompt] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-gray-200 py-2 px-4 text-center font-medium text-sm border-b">Admin</div>
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-48 bg-white border-r flex flex-col pt-6">
          <button className="text-left px-6 py-2 text-gray-700 hover:bg-gray-100">Users</button>
          <button className="text-left px-6 py-2 text-gray-700 font-semibold bg-gray-100 border-l-4 border-pink-400">Add Questions</button>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Dropdowns */}
          <div className="flex gap-4 mb-6">
            <div>
              <select
                className="bg-pink-400 text-white px-6 py-2 rounded-full font-medium focus:outline-none"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="bg-pink-400 text-white px-6 py-2 rounded-full font-medium focus:outline-none"
                value={selectedStarter}
                onChange={e => setSelectedStarter(e.target.value)}
              >
                {starters.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Add Question Section */}
          <div className="mb-4">
            <button
              className="w-full bg-gray-200 text-gray-500 py-2 rounded cursor-not-allowed mb-2"
              disabled
            >
              Add Questions
            </button>
            {showAddQuestion && (
              <div className="flex gap-2 mb-2">
                <input
                  className="flex-1 border px-2 py-1 rounded"
                  placeholder="Enter question..."
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                />
                <button className="text-pink-500 font-medium" onClick={() => setShowAddQuestion(false)}>Add</button>
                <button className="text-gray-500" onClick={() => setShowAddQuestion(false)}>Cancel</button>
              </div>
            )}
          </div>

          {/* Add Prompt Section */}
          <div className="mb-4">
            <button
              className="w-full bg-gray-200 text-gray-500 py-2 rounded cursor-not-allowed mb-2"
              disabled
            >
              Add Prompt
            </button>
            {showAddPrompt && (
              <div className="flex gap-2 mb-2">
                <input
                  className="flex-1 border px-2 py-1 rounded"
                  placeholder="Enter prompt..."
                  value={newPrompt}
                  onChange={e => setNewPrompt(e.target.value)}
                />
                <button className="text-pink-500 font-medium" onClick={() => setShowAddPrompt(false)}>Add</button>
                <button className="text-gray-500" onClick={() => setShowAddPrompt(false)}>Cancel</button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left font-semibold">Question</th>
                  <th className="px-4 py-2 text-left font-semibold">Prompt</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2 align-top w-1/2">{q.question}</td>
                    <td className="px-4 py-2 align-top w-1/3">{q.prompt}</td>
                    <td className="px-2 py-2 align-top flex gap-2">
                      <button className="text-green-600 hover:text-green-800" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.788l-4 1 1-4 14.362-14.3z" />
                        </svg>
                      </button>
                      <button className="text-red-500 hover:text-red-700" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="text-center mt-8 text-gray-600">Page 1</div>
        </main>
      </div>
    </div>
  );
}
