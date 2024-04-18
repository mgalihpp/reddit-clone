import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "@/services/authServices";
import token from "@/utils/token";

export const login = createAsyncThunk(
  "login",
  async (credentials: { email: string; password: string }) => {
    const { data } = await AuthService.login(credentials);
    token.setAuthToken(data.token);
    return data;
  }
);

export const register = createAsyncThunk("register", async (userData: User) => {
  const { data } = await AuthService.register(userData);
  token.setAuthToken(data.token);
  return data;
});
