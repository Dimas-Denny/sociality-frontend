import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { MeData } from "./types";

export const meApi = {
  getMe: async () => {
    const { data } = await api.get<ApiResponse<MeData>>("/me");
    return data.data;
  },
};
