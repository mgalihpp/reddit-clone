import apiInstance from "@/lib/axios";
import type { LoginResponse, RegisterResponse } from "@/types/apiResponse";

export const AuthService = {
  login: async (credentials: { email: string; password: string }) => {
    return await apiInstance.post<LoginResponse>(
      "/api/users/login",
      credentials
    );
  },
  register: async (userData: User) => {
    return await apiInstance.post<RegisterResponse>(
      "/api/users/register",
      userData
    );
  },
};
