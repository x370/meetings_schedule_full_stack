import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const meetingService = {
  getMeetings: async () => {
    const response = await api.get('/meetings');
    return response.data;
  },
  getMeetingById: async (id: string) => {
    const response = await api.get(`/meetings/${id}`);
    return response.data;
  },
  createMeeting: async (data: { title: string; notes: string; date_time?: string }) => {
    const response = await api.post('/meetings', data);
    return response.data;
  },
};

export const actionService = {
  addActionItem: async (data: { meeting_id: number; description: string }) => {
    const response = await api.post('/actions', data);
    return response.data;
  },
  markAsDone: async (id: number) => {
    const response = await api.put(`/actions/${id}`);
    return response.data;
  },
  deleteActionItem: async (id: number) => {
    const response = await api.delete(`/actions/${id}`);
    return response.data;
  },
};

export default api;
