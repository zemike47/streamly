import { api } from "./api";
import type { AuthResponse } from "../types/auth";

interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface SigninData {
  email: string;
  password: string;
}

export const signup = async (data: SignupData) => {
  return api("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const signin = async (data: SigninData): Promise<AuthResponse> => {
  const response = await api("/auth/signin", {
    method: "POST",
    body: JSON.stringify(data),
  });

  localStorage.setItem("token", response.token);

  return response;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return Boolean(localStorage.getItem("token"));
};
