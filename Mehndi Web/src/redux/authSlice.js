import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';
import socketService from '../services/socketService';

// sessionStorage clears when browser tab/window closes (safer than localStorage)
const getSession = () => {
  try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const accessToken = sessionStorage.getItem('accessToken');
    return { user, accessToken };
  } catch {
    return { user: null, accessToken: null };
  }
};

const { user, accessToken } = getSession();

const initialState = {
  user: user || null,
  accessToken: accessToken || null,
  isAuthenticated: !!accessToken,
  loading: false,
  error: null
};

export const signup = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    const response = await authService.signup(userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Signup failed');
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.login(credentials);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
    socketService.disconnect();
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});

const saveSession = (user, accessToken) => {
  sessionStorage.setItem('user', JSON.stringify(user));
  sessionStorage.setItem('accessToken', accessToken);
};

const clearSession = () => {
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('accessToken');
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      if (action.payload.user) {
        state.user = action.payload.user;
        sessionStorage.setItem('user', JSON.stringify(action.payload.user));
      }
      if (action.payload.token) {
        state.accessToken = action.payload.token;
        sessionStorage.setItem('accessToken', action.payload.token);
      }
      state.isAuthenticated = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        saveSession(action.payload.user, action.payload.accessToken);
        socketService.connect(action.payload.accessToken);
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        saveSession(action.payload.user, action.payload.accessToken);
        socketService.connect(action.payload.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        clearSession();
      });
  }
});

export const { clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
