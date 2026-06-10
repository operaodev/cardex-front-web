import { apiClient } from "./client";
import type { LoginInput, RegisterInput, AuthResponse, User } from "@/types/user";
import { useUserStore } from "@/store/useUserStore";

/* ---------- Auth API calls ---------- */

export async function login(input: LoginInput): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/users/login", input);
  return data;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/users/register", input);
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<User>("/users/me");
  return data;
}

/* ---------- Axios interceptor ---------- */

let interceptorId: number | null = null;

export function setupAuthInterceptor(): () => void {
  interceptorId = apiClient.interceptors.request.use((config) => {
    const token = useUserStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return () => {
    if (interceptorId !== null) {
      apiClient.interceptors.request.eject(interceptorId);
      interceptorId = null;
    }
  };
}
