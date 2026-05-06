import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import designReducer from './designSlice';
import appointmentReducer from './appointmentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    designs: designReducer,
    appointments: appointmentReducer
  }
});
