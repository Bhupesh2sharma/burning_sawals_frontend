import axios from "axios";

const BASE_URL = "https://burningsawals.vercel.app/api";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || BASE_URL;

export async function apiFetch(path: string, options: RequestInit = {}) {
    const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
    const res = await fetch(url, options);
    if (!res.ok) throw new Error("API error");
    return res.json();
}

// Genre APIs
export const getGenres = () => apiFetch("/genres");
export const createGenre = (data: object) =>
    apiFetch("/genres", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
export const getGenreById = (genreId: string) => apiFetch(`/genres/${genreId}`);
export const renameGenreById = (genreId: string, data: object) =>
    apiFetch(`/genres/${genreId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
export const deleteGenreById = (genreId: string) =>
    apiFetch(`/genres/${genreId}`, { method: "DELETE" });

// Question APIs
export const createQuestion = (data: object) =>
    apiFetch("/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
export const getQuestionsByGenre = (genreId: string) =>
    apiFetch(`/questions/genre/${genreId}`);
export const updateQuestion = (questionId: string, data: object) =>
    apiFetch(`/questions/${questionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
export const getAllQuestions = () => apiFetch("/questions");

// Question Type APIs
export const getAllQuestionTypes = () => apiFetch("/question-types");
export const createQuestionType = (data: object) =>
    apiFetch("/question-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
export const getQuestionTypeById = (questionTypeId: string) =>
    apiFetch(`/question-types/${questionTypeId}`);
export const renameQuestionType = (questionTypeId: string, data: object) =>
    apiFetch(`/question-types/${questionTypeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
export const deleteQuestionType = (questionTypeId: string) =>
    apiFetch(`/question-types/${questionTypeId}`, { method: "DELETE" });
export const addGenresToQuestionType = (questionTypeId: string, data: object) =>
    apiFetch(`/question-types/${questionTypeId}/genres`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
export const removeGenresFromQuestionType = (
    questionTypeId: string,
    data: object
) =>
    apiFetch(`/question-types/${questionTypeId}/genres`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

export const TOKEN_KEY = "auth_token";
export const tokenStorage = {
    set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
    get: () => localStorage.getItem(TOKEN_KEY),
    remove: () => localStorage.removeItem(TOKEN_KEY),
    exists: () => !!localStorage.getItem(TOKEN_KEY),
};

export interface User {
    user_id: string;
    phone_number: string;
    is_new_user?: boolean;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    sendOTP: (
        email: string,
        captchaToken: string
    ) => Promise<{
        success: boolean;
        message: string;
        otp_id?: string;
        is_existing_user?: boolean;
    }>;
    verifyOTP: (
        email: string,
        otp: string,
        userName?: string
    ) => Promise<{ success: boolean; user?: User; message: string }>;
    checkUsername: (
        userName: string
    ) => Promise<{ success: boolean; available: boolean; message: string }>;
    logout: () => void;
    refreshToken: () => Promise<void>;
}

export class AuthService {
    static async sendOTP(email: string, captcha_token: string) {
        const payload = {
            email,
            captcha_token,
        };

        console.log("AuthService.sendOTP sending payload:", {
            email,
            captcha_token: captcha_token
                ? `${captcha_token.substring(0, 20)}...`
                : "null",
            captcha_token_length: captcha_token?.length,
            api_url: `${API_BASE_URL}/auth/email/send-otp`,
        });

        return axios.post(`${API_BASE_URL}/auth/email/send-otp`, payload);
    }
    static async verifyOTP(email: string, otp: string, user_name?: string) {
        return axios.post(`${API_BASE_URL}/auth/email/verify-otp`, {
            email,
            otp,
            user_name,
        });
    }
    static async checkUsername(user_name: string) {
        return axios.post(`${API_BASE_URL}/auth/check-username`, { user_name });
    }
    static async testAuth(token: string) {
        return axios.get(`${API_BASE_URL}/test`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }
}

// Analytics APIs
export class AnalyticsService {
    // Question Interactions
    static async addQuestionInteraction(
        questionId: string,
        interactionType: "like" | "dislike" | "super_like",
        token: string
    ) {
        if (!token || typeof token !== "string" || token.trim().length === 0) {
            throw new Error("Invalid or missing authentication token");
        }

        const cleanToken = token.trim();
        return axios.post(
            `${API_BASE_URL}/analytics/questions/${questionId}/interact`,
            { interaction_type: interactionType },
            {
                headers: {
                    Authorization: `Bearer ${cleanToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
    }

    static async removeQuestionInteraction(
        questionId: string,
        interactionType: "like" | "dislike" | "super_like",
        token: string
    ) {
        if (!token || typeof token !== "string" || token.trim().length === 0) {
            throw new Error("Invalid or missing authentication token");
        }

        const cleanToken = token.trim();
        return axios.delete(
            `${API_BASE_URL}/analytics/questions/${questionId}/interact`,
            {
                data: { interaction_type: interactionType },
                headers: {
                    Authorization: `Bearer ${cleanToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
    }

    static async getUserInteractionsForQuestion(
        questionId: string,
        token: string
    ) {
        return axios.get(
            `${API_BASE_URL}/analytics/questions/${questionId}/interactions`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
    }

    // Question Analytics
    static async getQuestionAnalytics(questionId: string, token: string) {
        return axios.get(`${API_BASE_URL}/analytics/questions/${questionId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    static async getAllQuestionsWithAnalytics(
        token: string,
        page = 1,
        limit = 20,
        sortBy = "total_interactions",
        sortOrder = "desc"
    ) {
        // This endpoint doesn't exist yet, return mock data
        return Promise.resolve({
            data: {
                data: {
                    items: [],
                    page: page,
                    limit: limit,
                    total: 0,
                    total_pages: 0,
                },
            },
        });
    }

    // User Analytics - Get all users analytics
    static async getAllUsersAnalytics(token: string) {
        try {
            return await axios.get(`${API_BASE_URL}/analytics/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error("Token expired. Please login again.");
            }
            throw error;
        }
    }

    // User Analytics - Get current user analytics (mock for now)
    static async getUserAnalytics(token: string) {
        try {
            // Since we don't have a /me endpoint, we'll get all users and filter
            const response = await axios.get(
                `${API_BASE_URL}/analytics/users`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // Return the first user as "current user" for now
            const users = response.data?.data || response.data || [];
            return {
                data: {
                    data: users[0] || {
                        user_id: "1",
                        total_likes_given: 0,
                        total_super_likes_given: 0,
                        total_dislikes_given: 0,
                        total_interactions_given: 0,
                        last_updated: new Date().toISOString(),
                    },
                },
            };
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error("Token expired. Please login again.");
            }
            throw error;
        }
    }

    static async getUserInteractionHistory(
        token: string,
        page = 1,
        limit = 20
    ) {
        // This endpoint doesn't exist yet, return mock data
        return Promise.resolve({
            data: {
                data: {
                    items: [],
                    page: 1,
                    limit: 20,
                    total: 0,
                },
            },
        });
    }

    // Top Questions
    static async getTopQuestions(token: string, type = "total", limit = 10) {
        // This endpoint doesn't exist yet, return mock data
        return Promise.resolve({
            data: {
                data: {
                    items: [],
                    type: type,
                    limit: limit,
                },
            },
        });
    }

    // Monitoring APIs
    static async getSystemHealth(token: string) {
        return axios.get(`${API_BASE_URL}/monitoring/health`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    static async getDailyStats(token: string) {
        return axios.get(`${API_BASE_URL}/monitoring/daily-stats`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    static async getMetrics(token: string) {
        return axios.get(`${API_BASE_URL}/monitoring/metrics`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }
}
