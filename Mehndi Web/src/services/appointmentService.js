import api from './api';

export const appointmentService = {
  createAppointment: async (appointmentData) => {
    const { data } = await api.post('/appointments', appointmentData);
    return data;
  },

  getMyAppointments: async () => {
    const { data } = await api.get('/appointments/my');
    return data;
  },

  getAllAppointments: async (status = '') => {
    const { data } = await api.get(`/appointments${status ? `?status=${status}` : ''}`);
    return data;
  },

  updateAppointmentStatus: async (id, statusData) => {
    const { data } = await api.put(`/appointments/${id}`, statusData);
    return data;
  },

  cancelAppointment: async (id) => {
    const { data } = await api.delete(`/appointments/${id}`);
    return data;
  }
};
