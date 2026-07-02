import { useEffect, useState } from "react";
import { Login } from "./Login";
import { Messages } from "./Messages";
import { adminApi, clearToken, getToken } from "./adminApi";
import { useTheme } from "../portfolio/hooks";

export default function AdminPage() {
  // Admin panel is always dark — invoke useTheme to keep theme context consistent
  // (data-theme is applied to <html>, so nothing extra to do here).
  useTheme();

  const [authed, setAuthed] = useState(() => Boolean(getToken()));
  const [checking, setChecking] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) {
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
}
