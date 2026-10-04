import api from './api';

export const fetchNotices = (params) => api.get('/notices', { params }).then((r) => r.data);
export const fetchNotice = (id) => api.get(`/notices/${id}`).then((r) => r.data.notice);

// Notices are sent as multipart/form-data so an optional file can be attached.
export const createNotice = (formData) => api.post('/notices', formData).then((r) => r.data.notice);
export const updateNotice = (id, formData) => api.put(`/notices/${id}`, formData).then((r) => r.data.notice);
export const deleteNotice = (id) => api.delete(`/notices/${id}`).then((r) => r.data);

export const fetchComments = (noticeId) => api.get(`/notices/${noticeId}/comments`).then((r) => r.data.comments);
export const addComment = (noticeId, text) =>
  api.post(`/notices/${noticeId}/comments`, { text }).then((r) => r.data.comment);
export const deleteComment = (commentId) => api.delete(`/comments/${commentId}`).then((r) => r.data);
