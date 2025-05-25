import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Auth APIs
export const signup = (username: string, password: string, bio: string) =>
  api.post('/auth/signup', { username, password, bio });

export const login = (username: string, password: string) =>
  api.post('/auth/login', { username, password });

// Post APIs
export const createPost = (token: string, text: string, type: string, location: string) =>
  api.post(
    '/posts/create',
    { text, type, location },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const getPosts = (location?: string, type?: string) =>
  api.get('/posts', { params: { location, type } });

export const reactToPost = (token: string, postId: number, type: 'like' | 'dislike') =>
  api.post(
    `/posts/${postId}/react`,
    { type },
    { headers: { Authorization: `Bearer ${token}` } }
  );

// ✅ Reply APIs
export const createReply = (token: string, postId: number, text: string) =>
  api.post(
    `/reply/create`,
    { postId, text },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const getReplies = (postId: number) =>
  api.get(`/reply/${postId}`);

// User APIs
export const getUserProfile = (userId: number) =>
  api.get(`/users/${userId}`);

export const updateUserProfile = (token: string, userId: number, username?: string, bio?: string) =>
  api.put(
    `/users/${userId}`,
    { username, bio },
    { headers: { Authorization: `Bearer ${token}` } }
  );
