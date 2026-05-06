import api from './api';

export const designService = {
  getDesigns: async (category = '') => {
    const url = `/designs${category ? `?category=${category}` : ''}`;
    console.log('🌐 DesignService: Making API call to:', url);
    try {
      const { data } = await api.get(url);
      console.log('🌐 DesignService: API response:', {
        success: data.success,
        count: data.data?.length || 0,
        message: data.message,
        firstDesign: data.data?.[0],
        allData: data
      });
      return data;
    } catch (error) {
      console.error('❌ DesignService: API error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: url
      });
      throw error;
    }
  },

  getDesign: async (id) => {
    const { data } = await api.get(`/designs/${id}`);
    return data;
  },

  createDesign: async (formData) => {
    console.log('📝 DesignService: Creating design with formData:', {
      hasFile: formData.has('image'),
      entries: Array.from(formData.entries())
    });
    try {
      const { data } = await api.post('/designs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('✅ DesignService: Design created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ DesignService: Create design error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  updateDesign: async (id, formData) => {
    const { data } = await api.put(`/designs/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  deleteDesign: async (id) => {
    const { data } = await api.delete(`/designs/${id}`);
    return data;
  }
};
