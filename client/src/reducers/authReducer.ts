import { createSlice } from '@reduxjs/toolkit';
import { AuthState } from '@/types/authTypes';
import type { RootState } from '@/store';
import { login, register } from '@/actions/authActions';
import { handleAxiosError } from '@/utils/handleError';
import session from 'redux-persist/lib/storage/session';
import storage from 'redux-persist/lib/storage';

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetState: () => {
      storage.removeItem('persits:root');
      session.removeItem('persist:user');
      return initialState;
    },
    updateUser: (state, action) => {
      // Keep a copy of the original state
      const originalUser = { ...state.user };
      // Update only the values provided in the action payload
      state.user = { ...originalUser, ...action.payload.user };
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        console.log('Logging in...');
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('Login successful:', action.payload);
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        console.error('Login failed:', handleAxiosError(action.error, 'login'));
        state.loading = false;
        state.error = handleAxiosError(action.error, 'login');
      })
      .addCase(register.pending, (state) => {
        console.log('Registering...');
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        console.log('Registration successful:', action.payload);
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        console.error(
          'Registration failed:',
          handleAxiosError(action.error, 'register'),
        );
        state.loading = false;
        state.error = handleAxiosError(action.error, 'register');
      });
  },
});

export const loadingState = (state: RootState) => state.auth.loading;
export const errorState = (state: RootState) => state.auth.error;
export const getCurrentUser = (state: RootState) => state.auth.user;
export const getToken = (state: RootState) => state.auth.token;
export const { resetState, updateUser } = authSlice.actions;

export default authSlice.reducer;
