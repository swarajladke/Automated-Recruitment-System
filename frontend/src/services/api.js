import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const authService = {
  login: (data) => api.post('/login', data),
  register: (data) => api.post('/register', data),
};

export const candidateService = {
  getStatus: (id) => api.get(`/candidate-status/${id}`),
  apply: (data) => api.post('/candidate/apply', data),
  guestApply: (data) => api.post('/guest/apply', data),
  submitScore: (data) => api.post('/receive-score', data),
  getJobs: () => api.get('/jobs'),
};

export const adminService = {
  getAllCandidates: () => api.get('/admin/candidates'),
  updateCandidateStatus: (data) => api.post('/admin/update-status', data),
  getMCQs: () => api.get('/admin/mcq'),
  addMCQ: (data) => api.post('/admin/mcq', data),
  deleteMCQ: (id) => api.delete(`/admin/mcq/${id}`),
  initDefaultMCQs: () => api.post('/admin/mcq/init-defaults'),
  getAdminJobs: () => api.get('/jobs'),
  addJob: (data) => api.post('/admin/jobs', data),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
  initDefaultJobs: () => api.post('/admin/jobs/init-defaults'),
  scheduleInterview: (data) => api.post('/admin/schedule-interview', data),
};

export const messageService = {
  sendMessage: (data) => api.post('/messages/send', data),
  getMessages: (userId) => api.get(`/messages/${userId}`)
};

export default api;
