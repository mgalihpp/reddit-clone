import { apiInstance } from "@/lib/axios";
import type { LoginResponse, RegisterResponse } from "@/types/apiResponse";

export const AuthService = {
  login: async (credentials: { email: string; password: string }) => {
    return await apiInstance.post<LoginResponse>(
      "/api/auth/login",
      credentials
    );
  },
  register: async (getCurrentUser: newUser) => {
    return await apiInstance.post<RegisterResponse>(
      "/api/auth/register",
      getCurrentUser
    );
  },
};
