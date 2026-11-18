"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, User } from "@/lib/api";

export function useAuth(adminOnly = false) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    if (!localStorage.getItem("token")) return router.replace("/login");
    api.get("/auth/me")
      .then((r) => (adminOnly && r.data.data.role !== "admin" ? router.replace("/notes") : setUser(r.data.data)))
      .catch(() => router.replace("/login"));
  }, []); // eslint-disable-line
  return user;
}
