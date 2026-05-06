import api from './api';

export const contentService = {
  getAllContent: async () => {
    const { data } = await api.get('/content');
    return data;
  },

  getContent: async (section) => {
    const { data } = await api.get(`/content/${section}`);
    return data;
  },

  updateContent: async (section, data) => {
    const { data: res } = await api.put(`/content/${section}`, data);
    return res;
  }
};
