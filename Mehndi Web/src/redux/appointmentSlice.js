import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentService } from '../services/appointmentService';

const initialState = {
  appointments: [],
  myAppointments: [],
  loading: false,
  error: null
};

export const createAppointment = createAsyncThunk('appointments/create', async (appointmentData, { rejectWithValue }) => {
  try {
    const response = await appointmentService.createAppointment(appointmentData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create appointment');
  }
});

export const fetchMyAppointments = createAsyncThunk('appointments/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const response = await appointmentService.getMyAppointments();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
  }
});

export const fetchAllAppointments = createAsyncThunk('appointments/fetchAll', async (status, { rejectWithValue }) => {
  try {
    const response = await appointmentService.getAllAppointments(status);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
  }
});

export const updateAppointmentStatus = createAsyncThunk('appointments/updateStatus', async ({ id, statusData }, { rejectWithValue }) => {
  try {
    const response = await appointmentService.updateAppointmentStatus(id, statusData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update appointment');
  }
});

export const cancelAppointment = createAsyncThunk('appointments/cancel', async (id, { rejectWithValue }) => {
  try {
    await appointmentService.cancelAppointment(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to cancel appointment');
  }
});

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addAppointmentNotification: (state, action) => {
      const index = state.myAppointments.findIndex(a => a._id === action.payload._id);
      if (index !== -1) {
        state.myAppointments[index] = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.myAppointments.unshift(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyAppointments.fulfilled, (state, action) => {
        state.myAppointments = action.payload;
      })
      .addCase(fetchAllAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload;
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(a => a._id === action.payload._id);
        if (index !== -1) state.appointments[index] = action.payload;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.myAppointments = state.myAppointments.map(a =>
          a._id === action.payload ? { ...a, status: 'cancelled' } : a
        );
      });
  }
});

export const { clearError, addAppointmentNotification } = appointmentSlice.actions;
export default appointmentSlice.reducer;
