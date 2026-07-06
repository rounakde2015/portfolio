import type { AdminLoginResponse, AdminStats, ContactMessage } from "@/lib/models";
import { API } from "../portfolio/api";

const TOKEN_KEY = "ac-admin-token";
const EXP_KEY = "ac-admin-exp";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const t = localStorage.getItem(TOKEN_KEY);
  const exp = Number.parseInt(localStorage.getItem(EXP_KEY) || "0", 10);
  if (!t || !exp || Date.now() > exp) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXP_KEY);
    return null;
  }
  return t;
};

export const setToken = (token: string, expiresAt: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXP_KEY, String(new Date(expiresAt).getTime()));
};

export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXP_KEY);
};

const authHeaders = (): HeadersInit => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(init.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.detail || `HTTP ${res.status}`) as Error & {
      status?: number;
      data?: unknown;
    };
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data as T;
}

export const adminApi = {
  login: (password: string) =>
    req<AdminLoginResponse>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    }),
  verify: () => req<{ valid: boolean }>("/admin/verify"),
  messages: () => req<ContactMessage[]>("/admin/messages"),
  stats: () => req<AdminStats>("/admin/stats"),
  toggleRead: (id: string, read: boolean) =>
    req<ContactMessage>(`/admin/messages/${id}/read`, {
      method: "PATCH",
      body: JSON.stringify({ read }),
    }),
  remove: (id: string) =>
    req<{ status: string; id: string }>(`/admin/messages/${id}`, { method: "DELETE" }),
};
