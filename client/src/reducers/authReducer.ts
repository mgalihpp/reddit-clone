import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "@/types/authTypes";
import type { RootState } from "@/store";
import { login, register } from "@/actions/authActions";

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        console.log("Logging in...");
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log("Login successful:", action.payload);
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        console.error("Login failed:", action.error);
        state.loading = false;
        state.error = action.error;
      })
      .addCase(register.pending, (state) => {
        console.log("Registering...");
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        console.log("Registration successful:", action.payload);
        state.loading = false;
        state.user = action.payload.newUser;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        console.error("Registration failed:", action.error);
        state.loading = false;
        state.error = action.error;
      });
  },
});

export const loadingState = (state: RootState) => state.auth.loading;
export const errorState = (state: RootState) => state.auth.error;
export const userData = (state: RootState) => state.auth.user;

export default authSlice.reducer;
