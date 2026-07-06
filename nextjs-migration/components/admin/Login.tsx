"use client";

import { ArrowRight, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { adminApi, setToken } from "./adminApi";

export const Login = ({ onSuccess }: { onSuccess: () => void }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Enter password.");
      return;
    }
    setLoading(true);
    try {
      const data = await adminApi.login(password);
      setToken(data.token, data.expires_at);
      toast.success("Signed in.");
      onSuccess();
    } catch (err) {
      const msg = (err as { message?: string })?.message || "Login failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative"
      data-testid="admin-login-page"
    >
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
      <div className="absolute inset-0 hero-glow pointer-events-none" />

      <form
        onSubmit={submit}
        className="relative w-full max-w-md border border-white/10 bg-white/[0.02] backdrop-blur-xl p-10 z-10"
        data-testid="admin-login-form"
      >
        <div className="mono-label mb-3 flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 border border-[#00E5FF]/40 text-[#00E5FF]">
            <Lock size={14} strokeWidth={1.5} />
          </span>
          Admin · Restricted
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-2">Sign in</h1>
        <p className="text-sm text-[#A1A1AA] mb-8 font-light">
          Enter the admin password to view portfolio inquiries.
        </p>

        <label className="mono-label block mb-3" htmlFor="admin-pw">
          Password
        </label>
        <input
          id="admin-pw"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoFocus
          className="w-full bg-white/[0.03] border border-white/10 p-4 text-white font-mono text-sm focus:border-[#00E5FF] focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/30 transition-all placeholder-white/30 mb-6"
          data-testid="admin-password-input"
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full inline-flex items-center justify-center gap-3 font-mono uppercase text-sm font-bold tracking-wider py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="admin-login-submit"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Signing in…
            </>
          ) : (
            <>
              Sign in <ArrowRight size={16} strokeWidth={2} />
            </>
          )}
        </button>

        <p className="mt-6 text-xs text-white/40 font-mono">
          Session: 2 hours · Max 5 attempts / 15 min per IP
        </p>
      </form>
    </div>
  );
};
