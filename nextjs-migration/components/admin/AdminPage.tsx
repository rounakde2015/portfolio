"use client";

import { useEffect, useState } from "react";
import { Login } from "./Login";
import { Messages } from "./Messages";
import { adminApi, clearToken, getToken } from "./adminApi";

export const AdminPage = () => {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setChecking(false);
      return;
    }
    adminApi
      .verify()
      .then(() => {
        setAuthed(true);
        setChecking(false);
      })
      .catch(() => {
        clearToken();
        setAuthed(false);
        setChecking(false);
      });
  }, []);

  if (checking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-white/50 font-mono text-xs"
        data-testid="admin-checking"
      >
        Verifying session…
      </div>
    );
  }

  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />;
  }

  return <Messages onLogout={() => setAuthed(false)} />;
};
