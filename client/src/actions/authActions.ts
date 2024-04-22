import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "@/services/authServices";

export const login = createAsyncThunk(
  "login",
  async (credentials: { email: string; password: string }) => {
    const { data } = await AuthService.login(credentials);
    return data;
  }
);

export const register = createAsyncThunk(
  "register",
  async (getCurrentUser: newUser) => {
    const { data } = await AuthService.register(getCurrentUser);
    return data;
  }
);
