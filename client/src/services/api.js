
const API_BASE_URL = "http://localhost:5000/api";

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: "include",
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Something went wrong");
  }

  return data;
};

const api = {
  get: (endpoint) => request(endpoint),

  post: (endpoint, body) =>
    request(endpoint, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: (endpoint) =>
    request(endpoint, {
      method: "DELETE",
    }),

  register: (userData) => api.post("/auth/register", userData),

  login: (credentials) => api.post("/auth/login", credentials),

  logout: () => api.post("/auth/logout", {}),

  getCurrentUser: () => api.get("/auth/me"),

  getAllPhotos: () => api.get("/photos"),

  getMyPhotos: () => api.get("/photos/my"),

  getPhoto: (photoId) => api.get(`/photos/${photoId}`),

  uploadPhoto: (formData) => api.post("/photos", formData),

  deletePhoto: (photoId) => api.delete(`/photos/${photoId}`),

  getComments: (photoId) => api.get(`/comments/${photoId}`),

  addComment: (photoId, commentData) =>
    api.post(`/comments/${photoId}`, commentData),

  deleteComment: (commentId) =>
    api.delete(`/comments/${commentId}`),
};

export const getAllPhotos = () => api.getAllPhotos();

export default api;
