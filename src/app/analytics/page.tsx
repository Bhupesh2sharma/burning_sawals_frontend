"use client";
import React, { useEffect, useState } from "react";
import { AnalyticsService } from "../../utils/api";
import { useAuth } from "../../components/AuthProvider";
import RouteGuard from "../../components/RouteGuard";

interface QuestionAnalytics {
  question_id: number;
  question: string;
  prompt?: string;
  created_at: string;
  updated_at: string;
  analytics: {
    total_likes: number;
    total_super_likes: number;
    total_dislikes: number;
    total_interactions: number;
    last_updated: string;
  };
  genres: Array<{
    genre_id: number;
    name: string;
    type_id: number;
    type_name: string;
  }>;
}

interface UserAnalytics {
  user_id: number;
  total_likes_given: number;
  total_super_likes_given: number;
  total_dislikes_given: number;
  total_interactions_given: number;
  last_updated: string;
}

interface SystemStats {
  total_users: number;
  total_questions: number;
  total_interactions: number;
  daily_active_users: number;
  system_health: string;
  database_status: string;
}

interface TopQuestion {
  question_id: number;
  question: string;
  prompt?: string;
  analytics: {
    total_likes: number;
    total_super_likes: number;
    total_dislikes: number;
    total_interactions: number;
  };
  genres: Array<{
    genre_id: number;
    name: string;
    type_id: number;
    type_name: string;
  }>;
}

export default function AnalyticsPage() {
  const { token, isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState<QuestionAnalytics[]>([]);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [topQuestions, setTopQuestions] = useState<TopQuestion[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'users' | 'top'>('overview');
  const [sortBy, setSortBy] = useState<'total_interactions' | 'likes' | 'super_likes' | 'dislikes' | 'created_at'>('total_interactions');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchAnalyticsData();
    } else {
      setError("Please login to view analytics");
      setLoading(false);
    }
  }, [isAuthenticated, token, sortBy, sortOrder]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch all data in parallel
      const [
        questionsResponse,
        userResponse,
        allUsersResponse,
        topQuestionsResponse,
        healthResponse,
        statsResponse
      ] = await Promise.allSettled([
        AnalyticsService.getAllQuestionsWithAnalytics(token!, 1, 50, sortBy, sortOrder),
        AnalyticsService.getUserAnalytics(token!),
        AnalyticsService.getAllUsersAnalytics(token!),
        AnalyticsService.getTopQuestions(token!, 'total', 10),
        AnalyticsService.getSystemHealth(token!),
        AnalyticsService.getDailyStats(token!)
      ]);

      // Handle questions data
      if (questionsResponse.status === 'fulfilled') {
        const questionsData = questionsResponse.value.data?.data?.items || questionsResponse.value.data?.data || [];
        setQuestions(questionsData);
      } else {
        console.warn('Failed to fetch questions:', questionsResponse.reason);
      }

      // Handle user analytics
      if (userResponse.status === 'fulfilled') {
        const userData = userResponse.value.data?.data || userResponse.value.data;
        // Transform backend data to match frontend interface
        if (userData) {
          setUserAnalytics({
            user_id: userData.user_id,
            total_likes_given: userData.likes || 0,
            total_super_likes_given: userData.super_likes || 0,
            total_dislikes_given: userData.dislikes || 0,
            total_interactions_given: userData.total_interactions || 0,
            last_updated: userData.last_active || new Date().toISOString()
          });
        }
      } else {
        console.warn('Failed to fetch user analytics:', userResponse.reason);
      }

      // Handle all users data
      if (allUsersResponse.status === 'fulfilled') {
        const usersData = allUsersResponse.value.data?.data || allUsersResponse.value.data || [];
        setAllUsers(usersData);
      } else {
        console.warn('Failed to fetch all users:', allUsersResponse.reason);
      }

      // Handle top questions
      if (topQuestionsResponse.status === 'fulfilled') {
        const topData = topQuestionsResponse.value.data?.data?.items || topQuestionsResponse.value.data?.data || [];
        setTopQuestions(topData);
      } else {
        console.warn('Failed to fetch top questions:', topQuestionsResponse.reason);
      }

      // Handle system stats
      const healthData = healthResponse.status === 'fulfilled' ? healthResponse.value.data?.data || healthResponse.value.data : null;
      const statsData = statsResponse.status === 'fulfilled' ? statsResponse.value.data?.data || statsResponse.value.data : null;
        
        setSystemStats({
        total_users: statsData?.total_users || 0,
        total_questions: statsData?.total_questions || 0,
        total_interactions: statsData?.total_interactions || 0,
        daily_active_users: statsData?.daily_active_users || 0,
        system_health: healthData?.status || "Unknown",
        database_status: healthData?.database || "Unknown"
      });

    } catch (err: any) {
      console.error("Error fetching analytics:", err);
      if (err.message?.includes('Token expired')) {
        setError("Your session has expired. Please login again.");
      } else {
        setError(err.response?.data?.message || err.message || "Failed to fetch analytics data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (newSortBy: typeof sortBy) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please login to view analytics</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchAnalyticsData}
            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <RouteGuard>
      <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-gray-200 py-2 px-4 text-center font-medium text-sm border-b">Admin Analytics</div>
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-48 bg-white border-r flex flex-col pt-6">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`text-left px-6 py-2 text-gray-700 hover:bg-gray-100 ${activeTab === 'overview' ? 'font-semibold bg-gray-100 border-l-4 border-pink-400' : ''}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('questions')}
            className={`text-left px-6 py-2 text-gray-700 hover:bg-gray-100 ${activeTab === 'questions' ? 'font-semibold bg-gray-100 border-l-4 border-pink-400' : ''}`}
          >
            Questions
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`text-left px-6 py-2 text-gray-700 hover:bg-gray-100 ${activeTab === 'users' ? 'font-semibold bg-gray-100 border-l-4 border-pink-400' : ''}`}
          >
            Users
          </button>
          <button 
            onClick={() => setActiveTab('top')}
            className={`text-left px-6 py-2 text-gray-700 hover:bg-gray-100 ${activeTab === 'top' ? 'font-semibold bg-gray-100 border-l-4 border-pink-400' : ''}`}
          >
            Top Questions
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
          {/* System Stats Cards */}
          {systemStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                <p className="text-2xl font-bold text-gray-900">{systemStats.total_users}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Total Questions</h3>
                <p className="text-2xl font-bold text-gray-900">{systemStats.total_questions}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Total Interactions</h3>
                <p className="text-2xl font-bold text-gray-900">{systemStats.total_interactions}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Daily Active Users</h3>
                <p className="text-2xl font-bold text-gray-900">{systemStats.daily_active_users}</p>
              </div>
            </div>
          )}

              {/* System Health */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">System Health</h3>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${systemStats?.system_health === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-lg font-semibold capitalize">{systemStats?.system_health || 'Unknown'}</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Database Status</h3>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${systemStats?.database_status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-lg font-semibold capitalize">{systemStats?.database_status || 'Unknown'}</span>
                  </div>
                </div>
              </div>

              {/* User Analytics Summary */}
              {userAnalytics && (
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Analytics Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{userAnalytics.total_likes_given}</p>
                      <p className="text-sm text-gray-500">Likes Given</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{userAnalytics.total_super_likes_given}</p>
                      <p className="text-sm text-gray-500">Super Likes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{userAnalytics.total_dislikes_given}</p>
                      <p className="text-sm text-gray-500">Dislikes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{userAnalytics.total_interactions_given}</p>
                      <p className="text-sm text-gray-500">Total Interactions</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Questions Analytics</h2>
                <div className="flex gap-2">
                  <select 
                    value={sortBy} 
                    onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="total_interactions">Total Interactions</option>
                    <option value="likes">Likes</option>
                    <option value="super_likes">Super Likes</option>
                    <option value="dislikes">Dislikes</option>
                    <option value="created_at">Created Date</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                  >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
            </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genres</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likes</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Super Likes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dislikes</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                      {questions.length > 0 ? (
                        questions.map((question) => (
                          <tr key={question.question_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="max-w-xs">
                                <p className="text-sm font-medium text-gray-900 truncate">{question.question}</p>
                                {question.prompt && (
                                  <p className="text-xs text-gray-500 truncate">{question.prompt}</p>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {question.genres.slice(0, 2).map((genre) => (
                                  <span key={genre.genre_id} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                    {genre.name}
                                  </span>
                                ))}
                                {question.genres.length > 2 && (
                                  <span className="text-xs text-gray-500">+{question.genres.length - 2} more</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{question.analytics.total_likes}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">{question.analytics.total_super_likes}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{question.analytics.total_dislikes}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{question.analytics.total_interactions}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(question.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                            No questions data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">All Users Analytics</h2>
              {allUsers.length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions Viewed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dislikes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Super Likes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Interactions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                        {allUsers.map((user, idx) => (
                      <tr key={user.user_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.user_name || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.phone_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.questions_viewed || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{user.likes || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{user.dislikes || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">{user.super_likes || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{user.total_interactions || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.last_active ? new Date(user.last_active).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                        ))}
                </tbody>
              </table>
            </div>
          </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow text-center">
                  <p className="text-gray-500">No users data available</p>
                </div>
              )}
            </div>
          )}

          {/* Top Questions Tab */}
          {activeTab === 'top' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Questions</h2>
              <div className="space-y-4">
                {topQuestions.length > 0 ? (
                  topQuestions.map((question, index) => (
                    <div key={question.question_id} className="bg-white p-6 rounded-lg shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="bg-pink-100 text-pink-800 text-xs font-semibold px-2 py-1 rounded-full mr-3">
                              #{index + 1}
                            </span>
                            <div className="flex gap-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <span className="text-green-600 font-medium mr-1">{question.analytics.total_likes}</span>
                                likes
                              </span>
                              <span className="flex items-center">
                                <span className="text-orange-600 font-medium mr-1">{question.analytics.total_super_likes}</span>
                                super likes
                              </span>
                              <span className="flex items-center">
                                <span className="text-red-600 font-medium mr-1">{question.analytics.total_dislikes}</span>
                                dislikes
                              </span>
                              <span className="flex items-center">
                                <span className="text-gray-900 font-medium mr-1">{question.analytics.total_interactions}</span>
                                total
                              </span>
                            </div>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">{question.question}</h3>
                          {question.prompt && (
                            <p className="text-gray-600 text-sm mb-3">{question.prompt}</p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {question.genres.map((genre) => (
                              <span key={genre.genre_id} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                {genre.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-8 rounded-lg shadow text-center">
                    <p className="text-gray-500">No top questions data available</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Refresh Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={fetchAnalyticsData}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh Data
            </button>
          </div>
        </main>
      </div>
      </div>
    </RouteGuard>
  );
}