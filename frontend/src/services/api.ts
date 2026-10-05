const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api/v1';

type RequestOptions = RequestInit & { retry?: boolean };

async function request(path: string, options: RequestOptions = {}) {
  const token = localStorage.getItem('infonest_token');
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body !== undefined && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers, credentials: 'include' });
  let data: any = null;
  try { data = await response.json(); } catch { /* empty */ }
  if (!response.ok) {
    const error: any = new Error(data?.message || 'Request failed');
    error.response = { status: response.status, data };
    throw error;
  }
  return { data, status: response.status };
}

const json = (method: string, path: string, body?: unknown) => request(path, { method, body: body === undefined ? undefined : JSON.stringify(body) });

function queryString(params?: Record<string, unknown>): string {
  if (!params) return '';
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '').map(([k, v]) => [k, String(v)]);
  return entries.length ? '?' + new URLSearchParams(entries).toString() : '';
}

// =====================================================
// AUTH
// =====================================================

export const authApi = {
  requestRegisterOtp: (data: unknown) => json('POST', '/auth/register/request-otp', data),
  register: (data: unknown) => json('POST', '/auth/register', data),
  login: (data: unknown) => json('POST', '/auth/login', data),
  me: () => request('/auth/me'),
  logout: () => json('POST', '/auth/logout'),
};

// =====================================================
// USERS
// =====================================================

export const usersApi = {
  me: () => request('/users/me'),
  profile: (data: unknown) => json('PUT', '/users/profile', data),
  search: (query: string) => request(`/users/search?q=${encodeURIComponent(query)}`),
  byId: (id: string) => request(`/users/${encodeURIComponent(id)}`),
  creators: (params?: Record<string, unknown>) => request(`/users/creators${queryString(params)}`),
  globalSearch: (query: string) => request(`/users/global-search?q=${encodeURIComponent(query)}`),
};

// =====================================================
// GOALS
// =====================================================

export const goalsApi = {
  list: (params?: Record<string, unknown>) => request(`/goals${queryString(params)}`),
  create: (data: unknown) => json('POST', '/goals', data),
  update: (id: string, data: unknown) => json('PUT', `/goals/${id}`, data),
  remove: (id: string) => request(`/goals/${id}`, { method: 'DELETE' }),
};

// =====================================================
// CONTENT
// =====================================================

export const contentApi = {
  list: (params?: Record<string, unknown>) => request(`/content${queryString(params)}`),
  feed: (params?: Record<string, unknown>) => request(`/content/feed${queryString(params)}`),
  byId: (id: string) => request(`/content/${encodeURIComponent(id)}`),
  create: (data: unknown) => json('POST', '/content', data),
  update: (id: string, data: unknown) => json('PUT', `/content/${encodeURIComponent(id)}`, data),
  remove: (id: string) => request(`/content/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};

// =====================================================
// ROADMAPS
// =====================================================

export const roadmapsApi = {
  list: (params?: Record<string, unknown>) => request(`/roadmaps${queryString(params)}`),
  my: () => request('/roadmaps/my'),
  byId: (id: string) => request(`/roadmaps/${encodeURIComponent(id)}`),
  create: (data: unknown) => json('POST', '/roadmaps', data),
  update: (id: string, data: unknown) => json('PUT', `/roadmaps/${encodeURIComponent(id)}`, data),
  toggleStep: (id: string, stepOrder: number) => json('PATCH', `/roadmaps/${encodeURIComponent(id)}/step/${stepOrder}/toggle`),
};

// =====================================================
// NOTIFICATIONS
// =====================================================

export const notificationsApi = {
  list: () => request('/notifications'),
  unread: () => request('/notifications/unread'),
  markRead: (id: string) => json('PATCH', `/notifications/${encodeURIComponent(id)}/read`),
  markAllRead: () => json('PATCH', '/notifications/read-all'),
};

// =====================================================
// AI (Groq)
// =====================================================

export const aiApi = {
  recommendations: () => request('/ai/recommendations'),
  profileSuggestions: () => request('/ai/profile-suggestions'),
  saveRoadmap: (data: unknown) => json('POST', '/ai/save-roadmap', data),
  chat: async (message: string, files: File[] = []) => {
    const token = localStorage.getItem('infonest_token');
    const form = new FormData();
    form.append('message', message);
    files.forEach(file => form.append('files', file));
    const headers = new Headers();
    if (token) headers.set('Authorization', `Bearer ${token}`);
    const response = await fetch(`${API_BASE_URL}/ai/chat`, { method: 'POST', headers, body: form, credentials: 'include' });
    let data: any = null;
    try { data = await response.json(); } catch { /* empty */ }
    if (!response.ok) {
      const error: any = new Error(data?.message || 'AI request failed');
      error.response = { status: response.status, data };
      throw error;
    }
    return data;
  },
};

// =====================================================
// COMMENTS
// =====================================================

export const commentsApi = {
  list: (contentId: string) => request(`/comments/${encodeURIComponent(contentId)}`),
  create: (data: { contentId: string; commentText: string }) => json('POST', '/comments', data),
};

// =====================================================
// INTERACTIONS
// =====================================================

export const interactionsApi = {
  like: (contentId: string) => json('POST', `/interactions/content/${encodeURIComponent(contentId)}/like`),
  getLikes: (contentId: string) => request(`/interactions/content/${encodeURIComponent(contentId)}/likes`),
};

// =====================================================
// REVIEWS
// =====================================================

export const reviewsApi = {
  forRoadmap: (roadmapId: string) => request(`/reviews/roadmap/${encodeURIComponent(roadmapId)}`),
  create: (data: unknown) => json('POST', '/reviews', data),
};

// =====================================================
// USER-TO-USER MESSAGES (separate from Cosmos AI)
// =====================================================

export const chatApi = {
  inbox: () => request('/chats'),
  sendMessage: (receiverId: string, message: string) => json('POST', '/chats', { receiverId, message }),
  getConversation: (userId: string) => request(`/chats/conversation/${encodeURIComponent(userId)}`),
  markMessageRead: (id: string) => json('PATCH', `/chats/${encodeURIComponent(id)}/read`),
  deleteMessage: (id: string) => request(`/chats/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};

export default { request };
