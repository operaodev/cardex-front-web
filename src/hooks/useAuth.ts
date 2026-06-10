import { useCallback, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { login as apiLogin, register as apiRegister } from "@/api/auth";
import type { LoginInput, RegisterInput } from "@/types/user";
import axios from "axios";

function extractError(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err) && err.response?.data?.message) {
    return err.response.data.message;
  }
  return err instanceof Error ? err.message : fallback;
}

export function useAuth() {
  const {
    user,
    token,
    isAuthenticated,
    setAuth,
    logout: clearSession,
  } = useUserStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (input: LoginInput) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiLogin(input);
        setAuth(response.user, response.token);
        return response;
      } catch (err: unknown) {
        setError(extractError(err, "Error al iniciar sesión"));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setAuth],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiRegister(input);
        setAuth(response.user, response.token);
        return response;
      } catch (err: unknown) {
        setError(extractError(err, "Error al registrarse"));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setAuth],
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    loading,
    error,
  };
}
