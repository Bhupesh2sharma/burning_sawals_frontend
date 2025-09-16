import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

const BASE_URL = "http://localhost:8080/api";

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
        phoneNumber: string
    ) => Promise<{ success: boolean; message: string }>;
    verifyOTP: (
        phoneNumber: string,
        otp: string,
        userName?: string
    ) => Promise<{ success: boolean; user?: User; message: string }>;
    login: (
        phoneNumber: string,
        otp: string
    ) => Promise<{ success: boolean; user?: User; message: string }>;
    logout: () => void;
    refreshToken: () => Promise<void>;
}

export class AuthService {
    static async sendOTP(phone_number: string) {
        return axios.post(`${BASE_URL}/auth/phone/send-otp`, { phone_number });
    }
    static async verifyOTP(
        phone_number: string,
        otp: string,
        user_name?: string
    ) {
        return axios.post(`${BASE_URL}/auth/phone/verify-otp`, {
            phone_number,
            otp,
            user_name,
        });
    }
    static async checkUsername(user_name: string) {
        return axios.post(`${BASE_URL}/auth/check-username`, { user_name });
    }
    static async testAuth(token: string) {
        return axios.get(`${BASE_URL}/test`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    }
}
