import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { designService } from '../services/designService';

const initialState = {
  designs: [],
  currentDesign: null,
  loading: false,
  error: null
};

export const fetchDesigns = createAsyncThunk('designs/fetchAll', async (category, { rejectWithValue }) => {
  try {
    console.log('🎨 DesignSlice: Fetching designs with category:', category);
    const response = await designService.getDesigns(category);
    console.log('🎨 DesignSlice: Fetch response:', {
      status: response.status,
      dataCount: response.data?.length || 0,
      firstDesign: response.data?.[0],
      allDesigns: response.data
    });
    return response.data;
  } catch (error) {
    console.error('❌ DesignSlice: Fetch error:', error);
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch designs');
  }
});

export const fetchDesign = createAsyncThunk('designs/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const response = await designService.getDesign(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch design');
  }
});

export const createDesign = createAsyncThunk('designs/create', async (formData, { rejectWithValue }) => {
  try {
    const response = await designService.createDesign(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create design');
  }
});

export const updateDesign = createAsyncThunk('designs/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await designService.updateDesign(id, formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update design');
  }
});

export const deleteDesign = createAsyncThunk('designs/delete', async (id, { rejectWithValue }) => {
  try {
    await designService.deleteDesign(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete design');
  }
});

const designSlice = createSlice({
  name: 'designs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentDesign: (state) => {
      state.currentDesign = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesigns.pending, (state) => {
        console.log('⏳ DesignSlice: Fetch pending');
        state.loading = true;
      })
      .addCase(fetchDesigns.fulfilled, (state, action) => {
        console.log('✅ DesignSlice: Fetch fulfilled with data:', {
          count: action.payload?.length || 0,
          designs: action.payload
        });
        state.loading = false;
        state.designs = action.payload;
      })
      .addCase(fetchDesigns.rejected, (state, action) => {
        console.error('❌ DesignSlice: Fetch rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDesign.fulfilled, (state, action) => {
        state.currentDesign = action.payload;
      })
      .addCase(createDesign.fulfilled, (state, action) => {
        state.designs.unshift(action.payload);
      })
      .addCase(updateDesign.fulfilled, (state, action) => {
        const index = state.designs.findIndex(d => d._id === action.payload._id);
        if (index !== -1) state.designs[index] = action.payload;
      })
      .addCase(deleteDesign.fulfilled, (state, action) => {
        state.designs = state.designs.filter(d => d._id !== action.payload);
      });
  }
});

export const { clearError, clearCurrentDesign } = designSlice.actions;
export default designSlice.reducer;
