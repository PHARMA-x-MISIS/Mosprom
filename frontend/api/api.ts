import axios from 'axios';
// Эти импорты могут быть не нужны, если типы T.* лежат в другом файле
// import { LoginFormData } from 'src/lib/validation/authSchemas';
// import { RegistrationData } from 'src/lib/contexts/RegistrationContext'; 
import * as T from './types';


// --- 1. КЛИЕНТ ДЛЯ ОСНОВНОГО API ---
export const apiClient = axios.create({
  baseURL: 'https://mosprom.misis-team.ru', // Старый адрес для всего, кроме чата
  headers: { 'Content-Type': 'application/json' },
});

// --- 2. НОВЫЙ КЛИЕНТ СПЕЦИАЛЬНО ДЛЯ ЧАТА ---
export const chatApiClient = axios.create({
  baseURL: 'http://mosprom.misis-team.ru:8200', // Новый адрес для чата
  headers: { 'Content-Type': 'application/json' },
});


// Обработчик ошибок остается общим для всех
const handleApiError = (error: any, customMessages: { [key: number]: string } = {}): string => {
  if (axios.isAxiosError(error) && error.response) {
    const status = error.response.status;
    const serverMessage = error.response.data?.message;
    if (customMessages[status]) return customMessages[status];
    if (serverMessage) return `Ошибка ${status}: ${serverMessage}`;
    return `Произошла ошибка сервера (код: ${status})`;
  } else if (axios.isAxiosError(error)) {
    return 'Ошибка сети. Не удалось подключиться к серверу.';
  }
  return 'Произошла непредвиденная ошибка.';
};


// Тип для ответа чата
export interface ChatResponse {
  reply: string; 
}

// -----------------------
// --- Секция: AI Chat ---
// -----------------------

// --- 3. ФУНКЦИЯ ЧАТА ТЕПЕРЬ ИСПОЛЬЗУЕТ chatApiClient ---
export const postChatMessage = async (message: string): Promise<ChatResponse> => {
  try {
    const requestBody = {
      message: message,
      history: [],
      temperature: 0.3,
      max_tokens: 512,
      top_p: 1
    };
    
    // Используем новый клиент для запроса к чату
    const response = await chatApiClient.post<ChatResponse>('/chat', requestBody);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};


// --------------------
// --- Секция: users ---
// --------------------

// POST /users/register
export const registerUser = async (userData: T.UserCreate): Promise<T.UserRead> => {
  try {
    const response = await apiClient.post<T.UserRead>('/users/register', userData);
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// POST /users/login
export const loginUser = async (credentials: T.UserLogin): Promise<T.Token> => {
  try {
    const response = await apiClient.post<T.Token>('/users/login', credentials);
    return response.data;
  } catch (error) { throw new Error(handleApiError(error, { 401: 'Неверный email или пароль.' })); }
};

// GET /users/me
export const getCurrentUser = async (): Promise<T.UserRead> => {
  try {
    const response = await apiClient.get<T.UserRead>('/users/me');
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// PUT /users/me
export const updateCurrentUser = async (userData: T.UserUpdate): Promise<T.UserRead> => {
  try {
    const response = await apiClient.put<T.UserRead>('/users/me', userData);
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// DELETE /users/me
export const deleteCurrentUser = async (): Promise<void> => {
  try {
    await apiClient.delete('/users/me');
  } catch (error) { throw new Error(handleApiError(error)); }
};

// POST /users/me/change-password
export const changePassword = async (passData: T.UserChangePassword): Promise<any> => {
  try {
    const response = await apiClient.post('/users/me/change-password', passData);
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// GET /users/me/skills
export const getCurrentUserSkills = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get<string[]>('/users/me/skills');
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// POST /users/me/skills
export const addSkillToCurrentUser = async (skillName: string): Promise<any> => {
  try {
    const response = await apiClient.post('/users/me/skills', null, { params: { skill_name: skillName } });
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// DELETE /users/me/skills/{skill_name}
export const removeSkillFromCurrentUser = async (skillName: string): Promise<any> => {
  try {
    const response = await apiClient.delete(`/users/me/skills/${skillName}`);
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// GET /users/skills/all
export const getAllSkills = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get<string[]>('/users/skills/all');
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// GET /users/
export const getUsers = async (skip: number = 0, limit: number = 100): Promise<T.UserRead[]> => {
  try {
    const response = await apiClient.get<T.UserRead[]>('/users/', { params: { skip, limit } });
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// GET /users/{user_id}
export const getUserById = async (userId: number): Promise<T.UserRead> => {
  try {
    const response = await apiClient.get<T.UserRead>(`/users/${userId}`);
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};


// --- Остальные секции (communities, posts, comments) остаются без изменений ---
// Они все продолжают использовать `apiClient`


// ---------------------------
// --- Секция: communities ---
// ---------------------------

// POST /communities/
export const createCommunity = async (communityData: T.CommunityCreate): Promise<T.CommunityRead> => {
  try {
    const response = await apiClient.post<T.CommunityRead>('/communities/', communityData);
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// GET /communities/
export const getCommunities = async (skip: number = 0, limit: number = 100): Promise<T.CommunityRead[]> => {
  try {
    const response = await apiClient.get<T.CommunityRead[]>('/communities/', { params: { skip, limit } });
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// GET /communities/my
export const getMyCommunities = async (): Promise<T.CommunityRead[]> => {
  try {
    const response = await apiClient.get<T.CommunityRead[]>('/communities/my');
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// GET /communities/{community_id}
export const getCommunityById = async (communityId: number): Promise<T.CommunityRead> => {
  try {
    const response = await apiClient.get<T.CommunityRead>(`/communities/${communityId}`);
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// PUT /communities/{community_id}
export const updateCommunity = async (communityId: number, communityData: T.CommunityUpdate): Promise<T.CommunityRead> => {
  try {
    const response = await apiClient.put<T.CommunityRead>(`/communities/${communityId}`, communityData);
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// DELETE /communities/{community_id}
export const deleteCommunity = async (communityId: number): Promise<void> => {
  try {
    await apiClient.delete(`/communities/${communityId}`);
  } catch (error) { throw new Error(handleApiError(error)); }
};

// POST /communities/{community_id}/join
export const joinCommunity = async (communityId: number): Promise<any> => {
  try {
    const response = await apiClient.post(`/communities/${communityId}/join`);
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// POST /communities/{community_id}/leave
export const leaveCommunity = async (communityId: number): Promise<any> => {
  try {
    const response = await apiClient.post(`/communities/${communityId}/leave`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// ---------------------
// --- Секция: posts ---
// ---------------------

// POST /posts/
export const createPost = async (postData: T.PostCreate): Promise<T.PostRead> => {
  try {
    const response = await apiClient.post<T.PostRead>('/posts/', postData);
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// GET /posts/
export const getPosts = async (params: { skip?: number, limit?: number, community_id?: number } = {}): Promise<T.PostRead[]> => {
  try {
    const response = await apiClient.get<T.PostRead[]>('/posts/', { params });
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// GET /posts/my
export const getMyPosts = async (): Promise<T.PostRead[]> => {
  try {
    const response = await apiClient.get<T.PostRead[]>('/posts/my');
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// GET /posts/{post_id}
export const getPostById = async (postId: number): Promise<T.PostRead> => {
  try {
    const response = await apiClient.get<T.PostRead>(`/posts/${postId}`);
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// PUT /posts/{post_id}
export const updatePost = async (postId: number, postData: T.PostUpdate): Promise<T.PostRead> => {
  try {
    const response = await apiClient.put<T.PostRead>(`/posts/${postId}`, postData);
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// DELETE /posts/{post_id}
export const deletePost = async (postId: number): Promise<void> => {
  try {
    await apiClient.delete(`/posts/${postId}`);
  } catch (error) { throw new Error(handleApiError(error)); }
};

// POST /posts/{post_id}/like
export const likePost = async (postId: number): Promise<T.LikeResponse> => {
  try {
    const response = await apiClient.post<T.LikeResponse>(`/posts/${postId}/like`);
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// POST /posts/{post_id}/unlike
export const unlikePost = async (postId: number): Promise<T.LikeResponse> => {
  try {
    const response = await apiClient.post<T.LikeResponse>(`/posts/${postId}/unlike`);
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};


// -----------------------
// --- Секция: comments ---
// -----------------------

// POST /comments/
export const createComment = async (commentData: T.CommentCreate): Promise<T.CommentRead> => {
  try {
    const response = await apiClient.post<T.CommentRead>('/comments/', commentData);
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// GET /comments/post/{post_id}
export const getPostComments = async (postId: number): Promise<T.CommentRead[]> => {
  try {
    const response = await apiClient.get<T.CommentRead[]>(`/comments/post/${postId}`);
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// GET /comments/{comment_id}
export const getCommentById = async (commentId: number): Promise<T.CommentRead> => {
  try {
    const response = await apiClient.get<T.CommentRead>(`/comments/${commentId}`);
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// PUT /comments/{comment_id}
export const updateComment = async (commentId: number, commentData: T.CommentUpdate): Promise<T.CommentRead> => {
  try {
    const response = await apiClient.put<T.CommentRead>(`/comments/${commentId}`, commentData);
    return response.data;
  } catch (error) { throw new Error(handleApiError(error)); }
};

// DELETE /comments/{comment_id}
export const deleteComment = async (commentId: number): Promise<void> => {
  try {
    await apiClient.delete(`/comments/${commentId}`);
  } catch (error) { throw new Error(handleApiError(error)); }
};