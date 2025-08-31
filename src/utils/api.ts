export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiFetch(path: string, options: RequestInit = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  const res = await fetch(url, options);
  if (!res.ok) throw new Error('API error');
  return res.json();
}

// Genre APIs
export const getGenres = () => apiFetch('/genres');
export const createGenre = (data: object) => apiFetch('/genres', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const getGenreById = (genreId: string) => apiFetch(`/genres/${genreId}`);
export const renameGenreById = (genreId: string, data: object) => apiFetch(`/genres/${genreId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const deleteGenreById = (genreId: string) => apiFetch(`/genres/${genreId}`, { method: 'DELETE' });

// Question APIs
export const createQuestion = (data: object) => apiFetch('/questions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const getQuestionsByGenre = (genreId: string) => apiFetch(`/questions/genre/${genreId}`);
export const updateQuestion = (questionId: string, data: object) => apiFetch(`/questions/${questionId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const getAllQuestions = () => apiFetch('/questions');

// Question Type APIs
export const getAllQuestionTypes = () => apiFetch('/question-types');
export const createQuestionType = (data: object) => apiFetch('/question-types', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const getQuestionTypeById = (questionTypeId: string) => apiFetch(`/question-types/${questionTypeId}`);
export const renameQuestionType = (questionTypeId: string, data: object) => apiFetch(`/question-types/${questionTypeId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const deleteQuestionType = (questionTypeId: string) => apiFetch(`/question-types/${questionTypeId}`, { method: 'DELETE' });
export const addGenresToQuestionType = (questionTypeId: string, data: object) => apiFetch(`/question-types/${questionTypeId}/genres`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
export const removeGenresFromQuestionType = (questionTypeId: string, data: object) => apiFetch(`/question-types/${questionTypeId}/genres`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
