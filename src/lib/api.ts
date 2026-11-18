import axios from "axios";

export type Role = "user" | "admin";
export interface User { _id: string; name: string; email: string; role: Role; interests: string[] }
export interface Pagination { currentPage: number; limit: number; totalItems: number; totalPages: number }

export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api" });

api.interceptors.request.use((c) => {
  const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});
api.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e.response?.status === 401 && typeof window !== "undefined" && !/login|register/.test(location.pathname)) {
      localStorage.removeItem("token");
      location.href = "/login";
    }
    return Promise.reject(e);
  }
);

export const errMsg = (e: any): string =>
  e?.response?.data?.errors?.map((x: any) => `${x.path}: ${x.message}`).join(", ") ||
  e?.response?.data?.message ||
  "Something went wrong";
