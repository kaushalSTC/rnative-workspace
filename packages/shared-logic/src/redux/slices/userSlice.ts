import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginRequest, AuthResponse } from '../../types/user';
import { UserService } from '../../api/userService';

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  accessToken: null,
};

// Async thunks
export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: string }
>('user/login', async (credentials, { rejectWithValue }) => {
  try {
    // Note: You'd inject the UserService instance here
    // For now, this is just the structure
    throw new Error('UserService instance needed');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Login failed');
  }
});

export const getCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>('user/getCurrentUser', async (_, { rejectWithValue }) => {
  try {
    // Note: You'd inject the UserService instance here
    throw new Error('UserService instance needed');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to get user');
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
        state.isAuthenticated = false;
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get user';
      });
  },
});

export const { logout, clearError, setUser, setAccessToken } = userSlice.actions;
