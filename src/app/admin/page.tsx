"use client";
import React, { useState } from "react";
import { createQuestionType, getAllQuestionTypes, renameQuestionType, deleteQuestionType, createGenre, getGenres, renameGenreById, deleteGenreById, createQuestion, getQuestionsByGenre, updateQuestion, getAllQuestions } from "../../utils/api";

const categories = ["For First Dates", "For Friends", "For Family"];
const starters = ["Conversation Starters", "Deep Questions", "Fun Prompts"];

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

export default function AdminPage() {
  const [selectedSection, setSelectedSection] = useState("Users");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedStarter, setSelectedStarter] = useState(starters[0]);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showAddPrompt, setShowAddPrompt] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newPrompt, setNewPrompt] = useState("");
  const [newGenreIds, setNewGenreIds] = useState<number[]>([]);
  const [showAddQuestionType, setShowAddQuestionType] = useState(false);
  const [questionTypeName, setQuestionTypeName] = useState("");
  const [addTypeStatus, setAddTypeStatus] = useState<{success?: string, error?: string}>({});
  const [showQuestionTypes, setShowQuestionTypes] = useState(false);
  const [questionTypes, setQuestionTypes] = useState<any[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [renameTypeId, setRenameTypeId] = useState<string | null>(null);
  const [renameTypeName, setRenameTypeName] = useState("");
  const [renameStatus, setRenameStatus] = useState<{success?: string, error?: string}>({});

  // Genre management state
  const [showAddGenre, setShowAddGenre] = useState(false);
  const [genreName, setGenreName] = useState("");
  const [genreTypeId, setGenreTypeId] = useState("");
  const [addGenreStatus, setAddGenreStatus] = useState<{success?: string, error?: string}>({});
  const [showGenres, setShowGenres] = useState(false);
  const [genres, setGenres] = useState<any[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(false);
  const [renameGenreId, setRenameGenreId] = useState<string | null>(null);
  const [renameGenreName, setRenameGenreName] = useState("");
  const [genreStatus, setGenreStatus] = useState<{success?: string, error?: string}>({});

  // Add Question state
  const [questionText, setQuestionText] = useState("");
  const [questionPrompt, setQuestionPrompt] = useState("");
  const [questionGenreIds, setQuestionGenreIds] = useState<string[]>([]);
  const [addQuestionStatus, setAddQuestionStatus] = useState<{success?: string, error?: string}>({});
  const [showQuestions, setShowQuestions] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [editingQuestionText, setEditingQuestionText] = useState("");
  const [editingGenreIds, setEditingGenreIds] = useState<number[]>([]);
  const [questionEditStatus, setQuestionEditStatus] = useState<{success?: string, error?: string}>({});

  // Fetch all questions using getAllQuestions
  const fetchAllQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const data = await getAllQuestions();
      console.log('Fetched questions:', data);
      setQuestions(Array.isArray(data.data?.items) ? data.data.items : []);
    } catch (err) {
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Fetch questions on mount
  React.useEffect(() => {
    fetchAllQuestions();
  }, []);

  // Update handleAddQuestion to refresh questions after adding
  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddQuestionStatus({});
    const payload = {
      question: newQuestion,
      prompt: newPrompt,
      genre_ids: newGenreIds,
    };
    console.log('Submitting question:', payload);
    try {
      await createQuestion(payload);
      setAddQuestionStatus({ success: "Question added!" });
      setNewQuestion("");
      setNewPrompt("");
      setNewGenreIds([]);
      fetchAllQuestions();
    } catch (err) {
      setAddQuestionStatus({ error: "Failed to add question." });
    }
  };

  // Update question
  const handleEditQuestion = async (id: number) => {
    setQuestionEditStatus({});
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/questions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: editingQuestionText,
          genre_ids: editingGenreIds,
        })
      });
      setQuestions(qs => qs.map(q => q.question_id === id ? { ...q, question: editingQuestionText, genre_ids: editingGenreIds } : q));
      setEditingQuestionId(null);
      setEditingQuestionText("");
      setEditingGenreIds([]);
      setQuestionEditStatus({ success: "Question updated!" });
    } catch (err) {
      setQuestionEditStatus({ error: "Failed to update question." });
    }
  };

  // Delete question
  const handleDeleteQuestion = async (id: number) => {
    setQuestionEditStatus({});
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/questions/${id}`, {
        method: 'DELETE',
      });
      setQuestions(qs => qs.filter(q => q.question_id !== id));
      setQuestionEditStatus({ success: "Question deleted!" });
    } catch (err) {
      setQuestionEditStatus({ error: "Failed to delete question." });
    }
  };

  // UI state for nav bar
  const [activeAdminTab, setActiveAdminTab] = useState('add-question');

  const handleViewAllTypes = async () => {
    setLoadingTypes(true);
    setRenameStatus({});
    try {
      const typesResponse = await getAllQuestionTypes();
      setQuestionTypes(typesResponse.data);
      setShowQuestionTypes(true);
    } catch (err) {
      setRenameStatus({ error: "Failed to fetch question types." });
    } finally {
      setLoadingTypes(false);
    }
  };

  const handleRenameType = async (id) => {
    setRenameStatus({});
    try {
      await renameQuestionType(id, { type_name: renameTypeName });
      setQuestionTypes(qts => qts.map(qt => qt.id === id ? { ...qt, type_name: renameTypeName } : qt));
      setRenameTypeId(null);
      setRenameTypeName("");
      setRenameStatus({ success: "Renamed successfully!" });
    } catch (err) {
      setRenameStatus({ error: "Failed to rename." });
    }
  };

  const handleDeleteType = async (type_id) => {
    setRenameStatus({});
    try {
      await deleteQuestionType(type_id);
      setQuestionTypes(qts => qts.filter(qt => qt.type_id !== type_id));
      setRenameStatus({ success: "Deleted successfully!" });
    } catch (err) {
      setRenameStatus({ error: "Failed to delete." });
    }
  };

  const handleViewAllGenres = async () => {
    setLoadingGenres(true);
    setGenreStatus({});
    try {
      const genresResponse = await getGenres();
      setGenres(genresResponse.data || genresResponse); // support both array and {data: array}
      setShowGenres(true);
    } catch (err) {
      setGenreStatus({ error: "Failed to fetch genres." });
    } finally {
      setLoadingGenres(false);
    }
  };

  const handleCreateGenre = async (e) => {
    e.preventDefault();
    setAddGenreStatus({});
    try {
      await createGenre({ genre_name: genreName, type_id: Number(genreTypeId) });
      setAddGenreStatus({ success: "Genre added!" });
      setGenreName("");
      setGenreTypeId("");
      setShowAddGenre(false);
      handleViewAllGenres(); // refresh genres
    } catch (err) {
      setAddGenreStatus({ error: "Failed to add genre." });
    }
  };

  const handleRenameGenre = async (id) => {
    setGenreStatus({});
    try {
      await renameGenreById(id, { genre_name: renameGenreName });
      setGenres(gs => gs.map(g => g.genre_id === id ? { ...g, name: renameGenreName, genre_name: renameGenreName } : g));
      setRenameGenreId(null);
      setRenameGenreName("");
      setGenreStatus({ success: "Renamed successfully!" });
    } catch (err) {
      setGenreStatus({ error: "Failed to rename genre." });
    }
  };

  const handleDeleteGenre = async (id) => {
    setGenreStatus({});
    try {
      await deleteGenreById(id);
      setGenres(gs => gs.filter(g => g.genre_id !== id));
      setGenreStatus({ success: "Deleted successfully!" });
    } catch (err) {
      setGenreStatus({ error: "Failed to delete genre." });
    }
  };

  const handleShowAddGenre = async () => {
    setShowAddGenre(v => !v);
    if (!showAddGenre) {
      // Only fetch if opening the form
      try {
        const typesResponse = await getAllQuestionTypes();
        setQuestionTypes(typesResponse.data);
      } catch (err) {
        // Optionally handle error
      }
    }
  };

  // Fetch all genres for the genre select
  const fetchGenresForQuestions = async () => {
    try {
      const genresResponse = await getGenres();
      setGenres(genresResponse.data || genresResponse);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-gray-200 py-2 px-4 text-center font-medium text-sm border-b">Admin</div>
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-48 bg-white border-r flex flex-col pt-6">
          <button
            className={`text-left px-6 py-2 text-gray-700 hover:bg-gray-100 ${selectedSection === "Users" ? "font-semibold bg-gray-100 border-l-4 border-pink-400" : ""}`}
            onClick={() => setSelectedSection("Users")}
          >
            Users
          </button>
          <button
            className={`text-left px-6 py-2 text-gray-700 hover:bg-gray-100 ${selectedSection === "Add Questions" ? "font-semibold bg-gray-100 border-l-4 border-pink-400" : ""}`}
            onClick={() => setSelectedSection("Add Questions")}
          >
            Add Questions
          </button>
          <button
            className={`text-left px-6 py-2 text-gray-700 hover:bg-gray-100 ${selectedSection === "Analytics" ? "font-semibold bg-gray-100 border-l-4 border-pink-400" : ""}`}
            onClick={() => setSelectedSection("Analytics")}
          >
            Analytics
          </button>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8">
          {selectedSection === "Users" && (
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
          )}
          {selectedSection === "Add Questions" && (
            <>
              {/* Admin Action Nav Bar */}
              <div className="flex gap-2 mb-6 border-b pb-2">
                <button
                  className={`px-4 py-2 rounded-t font-medium ${activeAdminTab === 'add-question' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={async () => {
                    setActiveAdminTab('add-question');
                    await fetchGenresForQuestions();
                  }}
                >
                  Add Question
                </button>
                <button
                  className={`px-4 py-2 rounded-t font-medium ${activeAdminTab === 'add-question-type' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => setActiveAdminTab('add-question-type')}
                >
                  Add Question Type
                </button>
                <button
                  className={`px-4 py-2 rounded-t font-medium ${activeAdminTab === 'view-question-types' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={async () => {
                    setActiveAdminTab('view-question-types');
                    setLoadingTypes(true);
                    setRenameStatus({});
                    try {
                      const typesResponse = await getAllQuestionTypes();
                      setQuestionTypes(typesResponse.data);
                      setShowQuestionTypes(true);
                    } catch (err) {
                      setRenameStatus({ error: "Failed to fetch question types." });
                    } finally {
                      setLoadingTypes(false);
                    }
                  }}
                >
                  View All Question Types
                </button>
                <button
                  className={`px-4 py-2 rounded-t font-medium ${activeAdminTab === 'add-genre' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={async () => {
                    setActiveAdminTab('add-genre');
                    try {
                      const typesResponse = await getAllQuestionTypes();
                      setQuestionTypes(typesResponse.data);
                    } catch {}
                  }}
                >
                  Add Genre
                </button>
                <button
                  className={`px-4 py-2 rounded-t font-medium ${activeAdminTab === 'view-genres' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={async () => {
                    setActiveAdminTab('view-genres');
                    setLoadingGenres(true);
                    setGenreStatus({});
                    try {
                      const genresResponse = await getGenres();
                      setGenres(genresResponse.data || genresResponse);
                      setShowGenres(true);
                    } catch (err) {
                      setGenreStatus({ error: "Failed to fetch genres." });
                    } finally {
                      setLoadingGenres(false);
                    }
                  }}
                >
                  View All Genres
                </button>
              </div>
              {/* Only show the active section */}
              {activeAdminTab === 'add-question' && (
                <div className="mb-4">
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
                  {/* Add Question Form */}
                  <form className="flex flex-col gap-2 mb-2 bg-white p-4 rounded shadow" onSubmit={handleAddQuestion}>
                <input
                      className="border px-2 py-1 rounded"
                      placeholder="Question (e.g. What is the derivative of x²?)"
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                      required
                    />
                <input
                      className="border px-2 py-1 rounded"
                      placeholder="Prompt (e.g. Remember to use the power rule...)"
                  value={newPrompt}
                  onChange={e => setNewPrompt(e.target.value)}
                      required
                    />
                    <select
                      className="border px-2 py-1 rounded"
                      multiple
                      value={newGenreIds.map(String)}
                      onChange={e => setNewGenreIds(Array.from(e.target.selectedOptions, option => Number(option.value)))}
                      required
                    >
                      {genres.map(g => (
                        <option key={g.genre_id} value={g.genre_id}>{g.name}</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button type="submit" className="bg-pink-500 text-white px-4 py-1 rounded hover:bg-pink-600 transition">Submit</button>
              </div>
                  </form>
                  {addQuestionStatus.success && <div className="text-green-600 text-sm mt-1">{addQuestionStatus.success}</div>}
                  {addQuestionStatus.error && <div className="text-red-600 text-sm mt-1">{addQuestionStatus.error}</div>}
                  {/* Questions Table */}
                  <div className="overflow-x-auto bg-white rounded shadow mt-8">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left font-semibold">Question</th>
                  <th className="px-4 py-2 text-left font-semibold">Prompt</th>
                          <th className="px-2 py-2 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, idx) => (
                          <tr key={q.question_id || idx} className="border-b">
                            <td className="px-4 py-2 align-top">{editingQuestionId === q.question_id ? (
                              <input
                                className="border px-2 py-1 rounded w-full"
                                value={editingQuestionText}
                                onChange={e => setEditingQuestionText(e.target.value)}
                              />
                            ) : (
                              q.question
                            )}</td>
                            <td className="px-4 py-2 align-top">{q.prompt}</td>
                            <td className="px-2 py-2 align-top flex justify-end items-start gap-2 h-full">
                              {editingQuestionId === q.question_id ? (
                                <>
                                  <select
                                    className="border px-2 py-1 rounded"
                                    multiple
                                    value={editingGenreIds.map(String)}
                                    onChange={e => setEditingGenreIds(Array.from(e.target.selectedOptions, option => Number(option.value)))}
                                  >
                                    {genres.map(g => (
                                      <option key={g.genre_id} value={g.genre_id}>{g.name}</option>
                                    ))}
                                  </select>
                                  <button title="Save" className="text-green-600 font-medium" onClick={() => handleEditQuestion(q.question_id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                  </button>
                                  <button title="Cancel" className="text-gray-500" onClick={() => setEditingQuestionId(null)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="text-blue-500 hover:text-blue-700"
                                    title="Edit"
                                    onClick={() => {
                                      setEditingQuestionId(q.question_id);
                                      setEditingQuestionText(q.question);
                                      setEditingGenreIds((q.genres || []).map((g: any) => g.genre_id));
                                    }}
                                  >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.788l-4 1 1-4 14.362-14.3z" />
                        </svg>
                      </button>
                                  <button
                                    className="text-red-500 hover:text-red-700"
                                    title="Delete"
                                    onClick={() => handleDeleteQuestion(q.question_id)}
                                  >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {loadingQuestions && <div className="text-center py-4 text-gray-500">Loading questions...</div>}
                    {questionEditStatus.success && <div className="text-green-600 text-sm mt-1">{questionEditStatus.success}</div>}
                    {questionEditStatus.error && <div className="text-red-600 text-sm mt-1">{questionEditStatus.error}</div>}
                  </div>
                </div>
              )}
              {activeAdminTab === 'add-question-type' && (
                <div className="mb-4">
                  {/* Add Question Type Form */}
                  <form
                    className="flex flex-col gap-2 mb-2 bg-white p-4 rounded shadow"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setAddTypeStatus({});
                      try {
                        await createQuestionType({ type_name: questionTypeName });
                        setAddTypeStatus({ success: "Question type added!" });
                        setQuestionTypeName("");
                      } catch (err) {
                        setAddTypeStatus({ error: "Failed to add question type." });
                      }
                    }}
                  >
                    <input
                      className="border px-2 py-1 rounded"
                      placeholder="Type name (e.g. Multiple Choice)"
                      value={questionTypeName}
                      onChange={e => setQuestionTypeName(e.target.value)}
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-pink-500 text-white px-4 py-1 rounded hover:bg-pink-600 transition"
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        className="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400 transition"
                        onClick={() => setActiveAdminTab('add-question')}
                      >
                        Close
                      </button>
                    </div>
                  </form>
                  {addTypeStatus.success && <div className="text-green-600 text-sm mt-1">{addTypeStatus.success}</div>}
                  {addTypeStatus.error && <div className="text-red-600 text-sm mt-1">{addTypeStatus.error}</div>}
                </div>
              )}
              {activeAdminTab === 'view-question-types' && showQuestionTypes && (
                <div className="bg-white p-4 rounded shadow mb-4">
                  <div className="flex justify-end mb-2">
                    <button
                      className="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400 transition"
                      onClick={() => setActiveAdminTab('add-question')}
                    >
                      Close
                    </button>
                  </div>
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left font-semibold">ID</th>
                        <th className="px-4 py-2 text-left font-semibold">Type Name</th>
                        <th className="px-2 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {questionTypes.map((qt) => (
                        <tr key={qt.type_id} className="border-b">
                          <td className="px-4 py-2 align-top">{qt.type_id}</td>
                          <td className="px-4 py-2 align-top">
                            {renameTypeId === qt.type_id ? (
                              <form
                                className="flex gap-2"
                                onSubmit={e => {
                                  e.preventDefault();
                                  handleRenameType(qt.type_id);
                                }}
                              >
                                <input
                                  className="border px-2 py-1 rounded"
                                  value={renameTypeName}
                                  onChange={e => setRenameTypeName(e.target.value)}
                                  required
                                />
                                <button type="submit" className="text-green-600 font-medium">Save</button>
                                <button type="button" className="text-gray-500" onClick={() => setRenameTypeId(null)}>Cancel</button>
                              </form>
                            ) : (
                              <span>{qt.type_name}</span>
                            )}
                          </td>
                          <td className="px-2 py-2 align-top flex gap-2">
                            {renameTypeId === qt.type_id ? null : (
                              <>
                                <button
                                  className="text-blue-500 hover:text-blue-700"
                                  title="Rename"
                                  onClick={() => {
                                    setRenameTypeId(qt.type_id);
                                    setRenameTypeName(qt.type_name);
                                  }}
                                >
                                  Rename
                                </button>
                                <button
                                  className="text-red-500 hover:text-red-700"
                                  title="Delete"
                                  onClick={() => handleDeleteType(qt.type_id)}
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {renameStatus.success && <div className="text-green-600 text-sm mt-1">{renameStatus.success}</div>}
                  {renameStatus.error && <div className="text-red-600 text-sm mt-1">{renameStatus.error}</div>}
                </div>
              )}
              {activeAdminTab === 'add-genre' && (
                <div className="mb-4">
                  {/* Add Genre Form */}
                  <form className="flex flex-col gap-2 mb-2 bg-white p-4 rounded shadow" onSubmit={handleCreateGenre}>
                    <input
                      className="border px-2 py-1 rounded"
                      placeholder="Genre name (e.g. Geometry)"
                      value={genreName}
                      onChange={e => setGenreName(e.target.value)}
                      required
                    />
                    <select
                      className="border px-2 py-1 rounded"
                      value={genreTypeId}
                      onChange={e => setGenreTypeId(e.target.value)}
                      required
                    >
                      <option value="">Select Question Type</option>
                      {questionTypes.map(qt => (
                        <option key={qt.type_id} value={qt.type_id}>{qt.type_name}</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button type="submit" className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition">Submit</button>
                      <button
                        type="button"
                        className="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400 transition"
                        onClick={() => setActiveAdminTab('add-question')}
                      >
                        Close
                      </button>
                    </div>
                  </form>
                  {addGenreStatus.success && <div className="text-green-600 text-sm mt-1">{addGenreStatus.success}</div>}
                  {addGenreStatus.error && <div className="text-red-600 text-sm mt-1">{addGenreStatus.error}</div>}
                </div>
              )}
              {activeAdminTab === 'view-genres' && showGenres && (
                <div className="bg-white p-4 rounded shadow mb-4">
                  <div className="flex justify-end mb-2">
                    <button
                      className="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400 transition"
                      onClick={() => setActiveAdminTab('add-question')}
                    >
                      Close
                    </button>
                  </div>
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left font-semibold">ID</th>
                        <th className="px-4 py-2 text-left font-semibold">Genre Name</th>
                        <th className="px-4 py-2 text-left font-semibold">Question Type</th>
                        <th className="px-2 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {genres.map((g) => (
                        <tr key={g.genre_id} className="border-b">
                          <td className="px-4 py-2 align-top">{g.genre_id}</td>
                          <td className="px-4 py-2 align-top">
                            {renameGenreId === g.genre_id ? (
                              <form
                                className="flex gap-2"
                                onSubmit={e => {
                                  e.preventDefault();
                                  handleRenameGenre(g.genre_id);
                                }}
                              >
                                <input
                                  className="border px-2 py-1 rounded"
                                  value={renameGenreName}
                                  onChange={e => setRenameGenreName(e.target.value)}
                                  required
                                />
                                <button type="submit" className="text-green-600 font-medium">Save</button>
                                <button type="button" className="text-gray-500" onClick={() => setRenameGenreId(null)}>Cancel</button>
                              </form>
                            ) : (
                              <span>{g.name}</span>
                            )}
                          </td>
                          <td className="px-4 py-2 align-top">{g.type_name || (questionTypes.find(qt => qt.type_id === g.type_id)?.type_name ?? "")}</td>
                          <td className="px-2 py-2 align-top flex gap-2">
                            {renameGenreId === g.genre_id ? null : (
                              <>
                                <button
                                  className="text-blue-500 hover:text-blue-700"
                                  title="Rename"
                                  onClick={() => {
                                    setRenameGenreId(g.genre_id);
                                    setRenameGenreName(g.name);
                                  }}
                                >
                                  Rename
                                </button>
                                <button
                                  className="text-red-500 hover:text-red-700"
                                  title="Delete"
                                  onClick={() => handleDeleteGenre(g.genre_id)}
                                >
                                  Delete
                                </button>
                              </>
                            )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
                  {genreStatus.success && <div className="text-green-600 text-sm mt-1">{genreStatus.success}</div>}
                  {genreStatus.error && <div className="text-red-600 text-sm mt-1">{genreStatus.error}</div>}
          </div>
              )}
              {/* Dropdowns */}
            
              {/* Add Question Section */}
            
              {/* Add Prompt Section */}
             
              {/* Table */}
            
          {/* Pagination */}
          <div className="text-center mt-8 text-gray-600">Page 1</div>
            </>
          )}
          {selectedSection === "Analytics" && (
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
          )}
        </main>
      </div>
    </div>
  );
}
