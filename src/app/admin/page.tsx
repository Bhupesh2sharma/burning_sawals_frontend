"use client";
import React, { useState, useEffect } from "react";
import { createQuestionType, getAllQuestionTypes, renameQuestionType, deleteQuestionType, createGenre, getGenres, renameGenreById, deleteGenreById, createQuestion, getQuestionsByGenre, updateQuestion, getAllQuestions, AnalyticsService } from "../../utils/api";
import { useAuth } from "../../components/AuthProvider";
import AIQuestionGenerator from "../../components/AIQuestionGenerator";

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
  const [selectedSection, setSelectedSection] = useState("Add Questions");
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

  // Analytics state
  const { token, isAuthenticated } = useAuth();
  const [analyticsData, setAnalyticsData] = useState({
    questions: [] as any[],
    userAnalytics: null as any,
    allUsers: [] as any[],
    topQuestions: [] as any[],
    systemStats: null as any
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState("");
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState<'overview' | 'questions' | 'users' | 'top'>('overview');
  const [analyticsSortBy, setAnalyticsSortBy] = useState<'total_interactions' | 'likes' | 'super_likes' | 'dislikes' | 'created_at'>('total_interactions');
  const [analyticsSortOrder, setAnalyticsSortOrder] = useState<'asc' | 'desc'>('desc');

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

  // Fetch analytics data when Analytics section is selected
  React.useEffect(() => {
    if (selectedSection === "Analytics" && isAuthenticated && token) {
      fetchAnalyticsData();
    }
  }, [selectedSection, isAuthenticated, token, analyticsSortBy, analyticsSortOrder]);

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

  // Handle AI-generated questions
  const handleAddAIGeneratedQuestion = async (question: string, prompt: string, genreIds: number[]) => {
    setAddQuestionStatus({});
    const payload = {
      question: question,
      prompt: prompt,
      genre_ids: genreIds,
    };
    console.log('Adding AI-generated question:', payload);
    try {
      await createQuestion(payload);
      setAddQuestionStatus({ success: "AI-generated question added!" });
      fetchAllQuestions(); // Refresh the questions list
    } catch (err) {
      setAddQuestionStatus({ error: "Failed to add AI-generated question." });
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

  const handleRenameType = async (id: string) => {
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

  const handleDeleteType = async (type_id: string) => {
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

  const handleCreateGenre = async (e: React.FormEvent) => {
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

  const handleRenameGenre = async (id: string) => {
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

  const handleDeleteGenre = async (id: string) => {
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

  // Analytics functions
  const fetchAnalyticsData = async () => {
    if (!isAuthenticated || !token) {
      setAnalyticsError("Please login to view analytics");
      return;
    }

    try {
      setAnalyticsLoading(true);
      setAnalyticsError("");

      // Fetch all data in parallel
      const [
        questionsResponse,
        userResponse,
        allUsersResponse,
        topQuestionsResponse,
        healthResponse,
        statsResponse
      ] = await Promise.allSettled([
        AnalyticsService.getAllQuestionsWithAnalytics(token, 1, 50, analyticsSortBy, analyticsSortOrder),
        AnalyticsService.getUserAnalytics(token),
        AnalyticsService.getAllUsersAnalytics(token),
        AnalyticsService.getTopQuestions(token, 'total', 10),
        AnalyticsService.getSystemHealth(token),
        AnalyticsService.getDailyStats(token)
      ]);

      // Handle questions data
      let questionsData: any[] = [];
      if (questionsResponse.status === 'fulfilled') {
        questionsData = questionsResponse.value.data?.data?.items || questionsResponse.value.data?.data || [];
      }

      // Handle user analytics
      let userAnalyticsData: any = null;
      if (userResponse.status === 'fulfilled') {
        const userData = userResponse.value.data?.data || userResponse.value.data;
        if (userData) {
          userAnalyticsData = {
            user_id: userData.user_id,
            total_likes_given: userData.likes || 0,
            total_super_likes_given: userData.super_likes || 0,
            total_dislikes_given: userData.dislikes || 0,
            total_interactions_given: userData.total_interactions || 0,
            last_updated: userData.last_active || new Date().toISOString()
          };
        }
      }

      // Handle all users data
      let allUsersData: any[] = [];
      if (allUsersResponse.status === 'fulfilled') {
        allUsersData = allUsersResponse.value.data?.data || allUsersResponse.value.data || [];
      }

      // Handle top questions
      let topQuestionsData: any[] = [];
      if (topQuestionsResponse.status === 'fulfilled') {
        const responseData = topQuestionsResponse.value.data?.data || topQuestionsResponse.value.data;
        topQuestionsData = Array.isArray(responseData) ? responseData : (responseData?.items || []);
      }

      // Handle system stats
      let systemStatsData: any = null;
      if (statsResponse.status === 'fulfilled') {
        systemStatsData = {
          total_users: statsResponse.value.data?.total_users || 0,
          total_questions: statsResponse.value.data?.total_questions || 0,
          total_interactions: statsResponse.value.data?.total_interactions || 0,
          daily_active_users: statsResponse.value.data?.daily_active_users || 0,
          system_health: healthResponse.status === 'fulfilled' ? healthResponse.value.data?.status || 'unknown' : 'unknown',
          database_status: healthResponse.status === 'fulfilled' ? healthResponse.value.data?.database || 'unknown' : 'unknown'
        };
      }

      setAnalyticsData({
        questions: questionsData,
        userAnalytics: userAnalyticsData,
        allUsers: allUsersData,
        topQuestions: topQuestionsData,
        systemStats: systemStatsData
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalyticsError("Failed to load analytics data");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-pink-200 py-2 px-4 text-center font-medium text-sm border">Hey, Admin How you doing today ?</div>
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-48 bg-white border-r flex flex-col pt-6">
          {/* <button
            className={`text-left px-6 py-2 text-gray-700 hover:bg-gray-100 ${selectedSection === "Users" ? "font-semibold bg-gray-100 border-l-4 border-pink-400" : ""}`}
            onClick={() => setSelectedSection("Users")}
          >
            Users
          </button> */}
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
          {/* {selectedSection === "Users" && (
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
          )} */}
          {selectedSection === "Add Questions" && (
            <>
              {/* Admin Action Nav Bar */}
              <div className="flex gap-2 mb-6 border-b pb-2">
              <button
                  className={`px-4 py-2 rounded-t font-medium ${activeAdminTab === 'add-question-type' ? 'bg-pink-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => setActiveAdminTab('add-question-type')}
                >
                  Add Question Type
                </button>
                <button
                  className={`px-4 py-2 rounded-t font-medium ${activeAdminTab === 'view-question-types' ? 'bg-pink-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
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
                  className={`px-4 py-2 rounded-t font-medium ${activeAdminTab === 'add-genre' ? 'bg-pink-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
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
                  className={`px-4 py-2 rounded-t font-medium ${activeAdminTab === 'view-genres' ? 'bg-pink-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
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
                <button
                  className={`px-4 py-2 rounded-t font-medium ${activeAdminTab === 'add-question' ? 'bg-pink-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={async () => {
                    setActiveAdminTab('add-question');
                    await fetchGenresForQuestions();
                  }}
                >
                  Add Question
                </button>
                <button
                  className={`px-4 py-2 rounded-t font-medium ${activeAdminTab === 'ai-generator' ? 'bg-pink-400 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  onClick={() => setActiveAdminTab('ai-generator')}
                >
                  🤖 AI Generator
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
                      placeholder="Question"
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                      required
                    />
                <input
                      className="border px-2 py-1 rounded"
                      placeholder="Prompt "
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
                      <button type="submit" className="bg-pink-400 text-white px-4 py-1 rounded hover:bg-pink-600 transition">Submit</button>
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
                      placeholder="Type name "
                      value={questionTypeName}
                      onChange={e => setQuestionTypeName(e.target.value)}
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-pink-400 text-white px-4 py-1 rounded hover:bg-pink-600 transition"
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
                                <button type="submit" className="text-pink-300 font-medium">Save</button>
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
                      placeholder="Genre name "
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
                      <button type="submit" className="bg-pink-400 text-white px-4 py-1 rounded hover:bg-green-600 transition">Submit</button>
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
              {activeAdminTab === 'ai-generator' && (
                <div className="mb-4">
                  <AIQuestionGenerator 
                    onQuestionGenerated={(question, prompt, genreIds) => {
                      // Handle adding AI-generated question to the system
                      handleAddAIGeneratedQuestion(question, prompt, genreIds);
                    }}
                  />
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
            <div className="bg-white rounded shadow">
              {/* Analytics Header */}
              <div className="bg-gray-200 py-2 px-4 text-center font-medium text-sm border-b">
                Admin Analytics
              </div>
              
              {/* Analytics Tabs */}
              <div className="border-b">
                <nav className="flex">
                  <button
                    onClick={() => setActiveAnalyticsTab('overview')}
                    className={`px-6 py-3 text-sm font-medium ${
                      activeAnalyticsTab === 'overview'
                        ? 'border-b-2 border-pink-500 text-pink-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveAnalyticsTab('questions')}
                    className={`px-6 py-3 text-sm font-medium ${
                      activeAnalyticsTab === 'questions'
                        ? 'border-b-2 border-pink-500 text-pink-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Questions
                  </button>
                  <button
                    onClick={() => setActiveAnalyticsTab('users')}
                    className={`px-6 py-3 text-sm font-medium ${
                      activeAnalyticsTab === 'users'
                        ? 'border-b-2 border-pink-500 text-pink-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Users
                  </button>
                  <button
                    onClick={() => setActiveAnalyticsTab('top')}
                    className={`px-6 py-3 text-sm font-medium ${
                      activeAnalyticsTab === 'top'
                        ? 'border-b-2 border-pink-500 text-pink-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Top Questions
                  </button>
                </nav>
              </div>

              {/* Analytics Content */}
              <div className="p-6">
                {analyticsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading analytics...</p>
                  </div>
                ) : analyticsError ? (
                  <div className="text-center py-8">
                    <p className="text-red-600 mb-4">{analyticsError}</p>
                    <button 
                      onClick={fetchAnalyticsData}
                      className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Overview Tab */}
                    {activeAnalyticsTab === 'overview' && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">System Overview</h3>
                        {analyticsData.systemStats && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded">
                              <div className="text-2xl font-bold text-pink-600">{analyticsData.systemStats.total_users}</div>
                              <div className="text-sm text-gray-600">Total Users</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded">
                              <div className="text-2xl font-bold text-pink-600">{analyticsData.systemStats.total_questions}</div>
                              <div className="text-sm text-gray-600">Total Questions</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded">
                              <div className="text-2xl font-bold text-pink-600">{analyticsData.systemStats.total_interactions}</div>
                              <div className="text-sm text-gray-600">Total Interactions</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded">
                              <div className="text-2xl font-bold text-pink-600">{analyticsData.systemStats.daily_active_users}</div>
                              <div className="text-sm text-gray-600">Daily Active Users</div>
                            </div>
                          </div>
                        )}
                        
                        {analyticsData.userAnalytics && (
                          <div>
                            <h4 className="text-md font-semibold mb-3">Your Analytics</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div className="bg-green-50 p-4 rounded">
                                <div className="text-xl font-bold text-green-600">{analyticsData.userAnalytics.total_likes_given}</div>
                                <div className="text-sm text-gray-600">Likes Given</div>
                              </div>
                              <div className="bg-orange-50 p-4 rounded">
                                <div className="text-xl font-bold text-orange-600">{analyticsData.userAnalytics.total_super_likes_given}</div>
                                <div className="text-sm text-gray-600">Super Likes Given</div>
                              </div>
                              <div className="bg-red-50 p-4 rounded">
                                <div className="text-xl font-bold text-red-600">{analyticsData.userAnalytics.total_dislikes_given}</div>
                                <div className="text-sm text-gray-600">Dislikes Given</div>
                              </div>
                              <div className="bg-blue-50 p-4 rounded">
                                <div className="text-xl font-bold text-blue-600">{analyticsData.userAnalytics.total_interactions_given}</div>
                                <div className="text-sm text-gray-600">Total Interactions</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Questions Tab */}
                    {activeAnalyticsTab === 'questions' && (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold">Question Analytics</h3>
                          <div className="flex gap-2">
                            <select
                              value={analyticsSortBy}
                              onChange={(e) => setAnalyticsSortBy(e.target.value as any)}
                              className="px-3 py-1 border rounded text-sm"
                            >
                              <option value="total_interactions">Total Interactions</option>
                              <option value="likes">Likes</option>
                              <option value="super_likes">Super Likes</option>
                              <option value="dislikes">Dislikes</option>
                              <option value="created_at">Created Date</option>
                            </select>
                            <select
                              value={analyticsSortOrder}
                              onChange={(e) => setAnalyticsSortOrder(e.target.value as any)}
                              className="px-3 py-1 border rounded text-sm"
                            >
                              <option value="desc">Descending</option>
                              <option value="asc">Ascending</option>
                            </select>
                          </div>
                        </div>
                        <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                                <th className="px-4 py-2 text-left font-semibold">Question</th>
                                <th className="px-4 py-2 text-left font-semibold">Genres</th>
                                <th className="px-4 py-2 text-left font-semibold">Likes</th>
                                <th className="px-4 py-2 text-left font-semibold">Super Likes</th>
                                <th className="px-4 py-2 text-left font-semibold">Dislikes</th>
                                <th className="px-4 py-2 text-left font-semibold">Total</th>
                                <th className="px-4 py-2 text-left font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody>
                              {analyticsData.questions.map((question: any) => (
                                <tr key={question.question_id} className="border-b">
                                  <td className="px-4 py-2 max-w-xs truncate">{question.question}</td>
                                  <td className="px-4 py-2">
                                    <div className="flex flex-wrap gap-1">
                                      {question.genres?.slice(0, 2).map((genre: any) => (
                                        <span key={genre.genre_id} className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs">
                                          {genre.name}
                                        </span>
                                      ))}
                                      {question.genres?.length > 2 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                          +{question.genres.length - 2}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 py-2 text-green-600 font-medium">{question.analytics?.total_likes || 0}</td>
                                  <td className="px-4 py-2 text-orange-600 font-medium">{question.analytics?.total_super_likes || 0}</td>
                                  <td className="px-4 py-2 text-red-600 font-medium">{question.analytics?.total_dislikes || 0}</td>
                                  <td className="px-4 py-2 font-medium">{question.analytics?.total_interactions || 0}</td>
                                  <td className="px-4 py-2 text-gray-600">{new Date(question.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
                        </div>
                      </div>
                    )}

                    {/* Users Tab */}
                    {activeAnalyticsTab === 'users' && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">User Analytics</h3>
                        {analyticsData.allUsers.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="px-4 py-2 text-left font-semibold">User ID</th>
                                  <th className="px-4 py-2 text-left font-semibold">Likes</th>
                                  <th className="px-4 py-2 text-left font-semibold">Super Likes</th>
                                  <th className="px-4 py-2 text-left font-semibold">Dislikes</th>
                                  <th className="px-4 py-2 text-left font-semibold">Total Interactions</th>
                                  <th className="px-4 py-2 text-left font-semibold">Last Active</th>
                                </tr>
                              </thead>
                              <tbody>
                                {analyticsData.allUsers.map((user: any, idx: number) => (
                                  <tr key={user.user_id || idx} className="border-b">
                                    <td className="px-4 py-2">{user.user_id || 'N/A'}</td>
                                    <td className="px-4 py-2 text-green-600">{user.likes || 0}</td>
                                    <td className="px-4 py-2 text-orange-600">{user.super_likes || 0}</td>
                                    <td className="px-4 py-2 text-red-600">{user.dislikes || 0}</td>
                                    <td className="px-4 py-2 font-medium">{user.total_interactions || 0}</td>
                                    <td className="px-4 py-2 text-gray-600">
                                      {user.last_active ? new Date(user.last_active).toLocaleDateString() : 'N/A'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-gray-600">No user data available</p>
                        )}
                      </div>
                    )}

                    {/* Top Questions Tab */}
                    {activeAnalyticsTab === 'top' && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Top Questions</h3>
                        {analyticsData.topQuestions.length > 0 ? (
                          <div className="space-y-4">
                            {analyticsData.topQuestions.map((question: any, idx: number) => (
                              <div key={question.question_id} className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="bg-pink-500 text-white px-2 py-1 rounded text-sm font-bold">
                                        #{idx + 1}
                                      </span>
                                      <span className="text-sm text-gray-600">Rank</span>
                                    </div>
                                    <h4 className="font-medium mb-2">{question.question}</h4>
                                    {question.genres && question.genres.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mb-2">
                                        {question.genres.map((genre: any) => (
                                          <span key={genre.genre_id} className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs">
                                            {genre.name}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                      <div className="text-center">
                                        <div className="font-bold text-green-600">{question.total_likes || 0}</div>
                                        <div className="text-xs text-gray-600">Likes</div>
                                      </div>
                                      <div className="text-center">
                                        <div className="font-bold text-orange-600">{question.total_super_likes || 0}</div>
                                        <div className="text-xs text-gray-600">Super</div>
                                      </div>
                                      <div className="text-center">
                                        <div className="font-bold text-red-600">{question.total_dislikes || 0}</div>
                                        <div className="text-xs text-gray-600">Dislikes</div>
                                      </div>
                                    </div>
                                    <div className="mt-2 text-center">
                                      <div className="font-bold text-lg">{question.total_interactions || 0}</div>
                                      <div className="text-xs text-gray-600">Total</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-600">No top questions data available</p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
