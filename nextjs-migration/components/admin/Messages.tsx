"use client";

import type { ContactMessage } from "@/lib/models";
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCheck,
  Copy,
  Inbox,
  Loader2,
  LogOut,
  Mail,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { adminApi, clearToken } from "./adminApi";

const timeAgo = (iso: string): string => {
  try {
    const d = new Date(iso);
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
};

const POLL_INTERVAL = 30_000;

type Filter = "all" | "unread" | "read";

export const Messages = ({ onLogout }: { onLogout: () => void }) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const lastCountRef = useRef(0);
  const initialLoadRef = useRef(true);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const data = await adminApi.messages();
        if (!initialLoadRef.current) {
          const newUnread = data.filter((m) => !m.read).length;
          if (newUnread > lastCountRef.current) {
            const diff = newUnread - lastCountRef.current;
            toast.success(`${diff} new message${diff === 1 ? "" : "s"} received.`);
            if (
              typeof window !== "undefined" &&
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              new Notification(`${diff} new portfolio inquiry`, {
                body: "Open the admin panel to review.",
                silent: true,
              });
            }
          }
        }
        lastCountRef.current = data.filter((m) => !m.read).length;
        initialLoadRef.current = false;
        setMessages(data);
      } catch (err) {
        const status = (err as { status?: number })?.status;
        if (status === 401) {
          toast.error("Session expired. Please sign in again.");
          onLogout();
        } else {
          toast.error("Failed to load messages.");
        }
      } finally {
        setLoading(false);
      }
    },
    [onLogout],
  );

  useEffect(() => {
    load();
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission().catch(() => {});
    }
    const id = setInterval(() => load(true), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages.filter((m) => {
      if (filter === "unread" && m.read) return false;
      if (filter === "read" && !m.read) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    });
  }, [messages, query, filter]);

  const selected = messages.find((m) => m.id === selectedId) || filtered[0] || null;

  useEffect(() => {
    if (selected && !selected.read) {
      adminApi
        .toggleRead(selected.id, true)
        .then(() =>
          setMessages((prev) => prev.map((m) => (m.id === selected.id ? { ...m, read: true } : m))),
        )
        .catch(() => {});
    }
  }, [selected]);

  const stats = useMemo(() => {
    const total = messages.length;
    const unread = messages.filter((m) => !m.read).length;
    return { total, unread };
  }, [messages]);

  const copyEmail = async (email: string, id: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedId(id);
      toast.success("Email copied.");
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      toast.error("Copy failed.");
    }
  };

  const toggleRead = async (m: ContactMessage) => {
    try {
      await adminApi.toggleRead(m.id, !m.read);
      setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, read: !m.read } : x)));
    } catch {
      toast.error("Failed to update.");
    }
  };

  const remove = async (m: ContactMessage) => {
    if (!window.confirm(`Delete message from ${m.name}?`)) return;
    try {
      await adminApi.remove(m.id);
      setMessages((prev) => prev.filter((x) => x.id !== m.id));
      if (selectedId === m.id) setSelectedId(null);
      toast.success("Deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const logout = () => {
    clearToken();
    toast.success("Signed out.");
    onLogout();
  };

  return (
    <div className="min-h-screen relative" data-testid="admin-messages-page">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <header className="relative z-10 border-b border-white/5 bg-[#0A0A0A]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center gap-4">
          <a
            href="/"
            className="font-mono text-xs uppercase tracking-[0.2em] text-white/60 hover:text-[#00E5FF] transition-colors inline-flex items-center gap-2"
            data-testid="admin-back-link"
          >
            <ArrowLeft size={14} strokeWidth={1.5} /> Portfolio
          </a>
          <span className="text-white/20">/</span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-white">
            Admin · Inbox
          </span>

          <div className="ml-auto flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 font-mono text-xs">
              <span className="text-white/50">Total</span>
              <span className="text-white font-semibold" data-testid="admin-stat-total">
                {stats.total}
              </span>
              <span className="w-px h-4 bg-white/10" />
              <span className="text-white/50">Unread</span>
              <span
                className="text-[#00E5FF] font-semibold inline-flex items-center gap-1"
                data-testid="admin-stat-unread"
              >
                <Bell size={12} strokeWidth={1.5} />
                {stats.unread}
              </span>
            </div>
            <button
              type="button"
              onClick={() => load()}
              className="theme-toggle"
              aria-label="Refresh"
              data-testid="admin-refresh"
            >
              <RefreshCw size={14} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-white/60 hover:text-[#00E5FF] transition-colors"
              data-testid="admin-logout"
            >
              <LogOut size={14} strokeWidth={1.5} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-8 grid md:grid-cols-[420px_1fr] gap-6 md:gap-8">
        <section className="border border-white/5 bg-white/[0.02] backdrop-blur-xl">
          <div className="border-b border-white/5 p-4 space-y-3">
            <div className="relative">
              <Search
                size={14}
                strokeWidth={1.5}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, text…"
                className="w-full bg-white/[0.03] border border-white/10 pl-9 pr-3 py-2.5 text-white font-mono text-xs focus:border-[#00E5FF] focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/30 transition-all placeholder-white/30"
                data-testid="admin-search"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "unread", "read"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-all ${
                    filter === f
                      ? "border-[#00E5FF] text-[#00E5FF] bg-[#00E5FF]/5"
                      : "border-white/10 text-white/50 hover:text-white"
                  }`}
                  data-testid={`admin-filter-${f}`}
                >
                  {f}
                  {f === "unread" && stats.unread > 0 && (
                    <span className="ml-1.5 text-[#00E5FF]">{stats.unread}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto" data-testid="admin-message-list">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-white/40 font-mono text-xs">
                <Loader2 size={16} className="animate-spin mr-2" /> Loading…
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-white/40 font-mono text-xs gap-3">
                <Inbox size={32} strokeWidth={1} />
                {messages.length === 0 ? "Inbox zero." : "No matches."}
              </div>
            ) : (
              <ul>
                {filtered.map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(m.id)}
                      className={`w-full text-left border-b border-white/5 p-4 hover:bg-white/[0.03] transition-colors ${
                        selected?.id === m.id ? "bg-white/[0.04]" : ""
                      }`}
                      data-testid={`admin-message-item-${m.id}`}
                    >
                      <div className="flex items-baseline justify-between gap-3 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          {!m.read && (
                            <span
                              className="w-2 h-2 bg-[#00E5FF] rounded-full flex-shrink-0 timeline-dot"
                              aria-label="unread"
                            />
                          )}
                          <span
                            className={`truncate font-semibold ${m.read ? "text-white/70" : "text-white"}`}
                          >
                            {m.name}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40 flex-shrink-0">
                          {timeAgo(m.timestamp)}
                        </span>
                      </div>
                      <div className="font-mono text-xs text-[#A1A1AA] truncate">{m.email}</div>
                      <div className="text-xs text-white/50 line-clamp-2 mt-1.5 leading-relaxed">
                        {m.message}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section
          className="border border-white/5 bg-white/[0.02] backdrop-blur-xl p-6 md:p-10 min-h-[60vh]"
          data-testid="admin-message-detail"
        >
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center text-white/40 font-mono text-xs gap-3">
              <Mail size={40} strokeWidth={1} />
              Select a message
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <div className="mono-label mb-2">
                    {timeAgo(selected.timestamp)} · {new Date(selected.timestamp).toLocaleString()}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    {selected.name}
                  </h2>
                  <div className="mt-2 flex items-center gap-2 font-mono text-sm text-[#A1A1AA]">
                    {selected.email}
                    <button
                      type="button"
                      onClick={() => copyEmail(selected.email, selected.id)}
                      className="ml-1 text-white/40 hover:text-[#00E5FF] transition-colors"
                      aria-label="Copy email"
                      data-testid="admin-copy-email"
                    >
                      {copiedId === selected.id ? (
                        <Check size={14} strokeWidth={2} />
                      ) : (
                        <Copy size={14} strokeWidth={1.5} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleRead(selected)}
                    className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider px-3 py-2 border border-white/10 hover:border-[#00E5FF] hover:text-[#00E5FF] transition-all"
                    data-testid="admin-toggle-read"
                  >
                    {selected.read ? (
                      <>
                        <Check size={12} strokeWidth={1.5} /> Mark unread
                      </>
                    ) : (
                      <>
                        <CheckCheck size={12} strokeWidth={1.5} /> Mark read
                      </>
                    )}
                  </button>
                  <a
                    href={`mailto:${selected.email}?subject=Re: Your inquiry`}
                    className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider px-3 py-2 border border-[#00E5FF] text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-all"
                    data-testid="admin-reply"
                  >
                    <Mail size={12} strokeWidth={1.5} /> Reply
                  </a>
                  <button
                    type="button"
                    onClick={() => remove(selected)}
                    className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider px-3 py-2 border border-red-500/40 text-red-400/80 hover:border-red-500 hover:text-red-400 transition-all"
                    data-testid="admin-delete"
                  >
                    <Trash2 size={12} strokeWidth={1.5} /> Delete
                  </button>
                </div>
              </div>

              <div className="border border-white/5 bg-white/[0.02] p-6 whitespace-pre-wrap text-[#F4F4F5] font-light leading-relaxed">
                {selected.message}
              </div>

              <div className="mt-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-white/40">
                <span
                  className={`inline-block w-2 h-2 ${selected.email_sent ? "bg-[#00E5FF]" : "bg-white/20"} rounded-full`}
                />
                Email notification {selected.email_sent ? "delivered" : "not sent"}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
