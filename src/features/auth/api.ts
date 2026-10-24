import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { AuthData, LoginPayload, RegisterPayload } from "./types";

export const authApi = {
  login: async (payload: LoginPayload) => {
    const { data } = await api.post<ApiResponse<AuthData>>(
      "/auth/login",
      payload,
    );
    return data.data;
  },

  register: async (payload: RegisterPayload) => {
    const { data } = await api.post<ApiResponse<AuthData>>(
      "/auth/register",
      payload,
    );
    return data.data;
  },
};
