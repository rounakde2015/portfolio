import axios from "axios";
import { API } from "../portfolio/api";

const TOKEN_KEY = "ac-admin-token";
const EXP_KEY = "ac-admin-exp";

export const getToken = () => {
  const t = localStorage.getItem(TOKEN_KEY);
  const exp = parseInt(localStorage.getItem(EXP_KEY) || "0", 10);
  if (!t || !exp || Date.now() > exp) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXP_KEY);
    return null;
  }
  return t;
};

export const setToken = (token, expiresAt) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXP_KEY, String(new Date(expiresAt).getTime()));
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXP_KEY);
};

const authHeaders = () => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

export const adminApi = {
  login: async (password) => {
    const { data } = await axios.post(`${API}/admin/login`, { password });
    return data; // { token, expires_at }
  },
  verify: async () => {
    const { data } = await axios.get(`${API}/admin/verify`, {
      headers: authHeaders(),
    });
    return data;
  },
  messages: async () => {
    const { data } = await axios.get(`${API}/admin/messages`, {
      headers: authHeaders(),
    });
    return data;
  },
  stats: async () => {
    const { data } = await axios.get(`${API}/admin/stats`, {
      headers: authHeaders(),
    });
    return data;
  },
  toggleRead: async (id, read) => {
    const { data } = await axios.patch(
      `${API}/admin/messages/${id}/read`,
      { read },
      { headers: authHeaders() },
    );
    return data;
  },
  remove: async (id) => {
    const { data } = await axios.delete(`${API}/admin/messages/${id}`, {
      headers: authHeaders(),
    });
    return data;
  },
};
