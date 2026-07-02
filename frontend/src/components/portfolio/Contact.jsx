import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Github, Linkedin, Mail, ArrowRight, MapPin } from "lucide-react";
import { PROFILE } from "./constants";
import { API } from "./api";
import { useReveal } from "./hooks";
import { SectionHeading } from "./SectionHeading";

export const Contact = () => {
  const ref = useReveal();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(`${API}/contact`, form);
      if (res.data?.status === "success") {
        toast.success("Message sent. I'll reply within 24h.");
        setForm({ name: "", email: "", message: "" });
      } else {
        toast.error("Something went wrong.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.detail?.[0]?.msg ||
        err?.response?.data?.detail ||
        "Failed to send. Try again later.";
      toast.error(typeof msg === "string" ? msg : "Failed to send.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-24 md:py-40 border-t border-white/5"
      data-testid="contact-section"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <SectionHeading
          index="05"
          label="Get In Touch"
          title="Let's build something that matters."
          subtitle="Hiring? Got a hard problem? Want to talk system design? Drop a line — I read everything."
        />
        <div className="grid md:grid-cols-5 gap-12 md:gap-16">
          <form
            onSubmit={submit}
            className="md:col-span-3 space-y-6 reveal"
            data-testid="contact-form"
          >
            <div>
              <label className="mono-label block mb-3" htmlFor="cf-name">
                01 — Name
              </label>
              <input
                id="cf-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="w-full bg-white/[0.03] border border-white/10 p-4 text-white font-mono text-sm focus:border-[#00E5FF] focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/30 transition-all placeholder-white/30"
                data-testid="contact-input-name"
              />
            </div>
            <div>
              <label className="mono-label block mb-3" htmlFor="cf-email">
                02 — Email
              </label>
              <input
                id="cf-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com"
                className="w-full bg-white/[0.03] border border-white/10 p-4 text-white font-mono text-sm focus:border-[#00E5FF] focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/30 transition-all placeholder-white/30"
                data-testid="contact-input-email"
              />
            </div>
            <div>
              <label className="mono-label block mb-3" htmlFor="cf-message">
                03 — Message
              </label>
              <textarea
                id="cf-message"
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me about your project, role, or problem..."
                className="w-full bg-white/[0.03] border border-white/10 p-4 text-white font-mono text-sm focus:border-[#00E5FF] focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/30 transition-all placeholder-white/30 resize-none"
                data-testid="contact-input-message"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary inline-flex items-center gap-3 font-mono uppercase text-sm font-bold tracking-wider px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="contact-submit-button"
            >
              {submitting ? "Sending..." : "Send Message"}
              {!submitting && <ArrowRight size={16} strokeWidth={2} />}
            </button>
          </form>

          <aside className="md:col-span-2 space-y-8 reveal">
            <div className="border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl">
              <div className="mono-label mb-4">// direct.lines</div>
              <div className="space-y-5">
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="flex items-center gap-4 group"
                  data-testid="contact-link-email"
                >
                  <span className="w-10 h-10 flex items-center justify-center border border-white/10 group-hover:border-[#00E5FF] group-hover:text-[#00E5FF] transition-all">
                    <Mail size={16} strokeWidth={1.5} />
                  </span>
                  <span className="font-mono text-sm text-white group-hover:text-[#00E5FF] transition-colors">
                    {PROFILE.email}
                  </span>
                </a>
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                  data-testid="contact-link-github"
                >
                  <span className="w-10 h-10 flex items-center justify-center border border-white/10 group-hover:border-[#00E5FF] group-hover:text-[#00E5FF] transition-all">
                    <Github size={16} strokeWidth={1.5} />
                  </span>
                  <span className="font-mono text-sm text-white group-hover:text-[#00E5FF] transition-colors">
                    github.com/alexchen
                  </span>
                </a>
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group"
                  data-testid="contact-link-linkedin"
                >
                  <span className="w-10 h-10 flex items-center justify-center border border-white/10 group-hover:border-[#00E5FF] group-hover:text-[#00E5FF] transition-all">
                    <Linkedin size={16} strokeWidth={1.5} />
                  </span>
                  <span className="font-mono text-sm text-white group-hover:text-[#00E5FF] transition-colors">
                    linkedin.com/in/alexchen
                  </span>
                </a>
              </div>
            </div>
            <div className="border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl">
              <div className="mono-label mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00E5FF] rounded-full timeline-dot"></span>
                Status
              </div>
              <p className="text-white font-light leading-relaxed">
                Open to staff/principal roles, advisory, and high-leverage
                contract work.
              </p>
              <div className="flex items-center gap-2 mt-4 text-[#A1A1AA] font-mono text-xs">
                <MapPin size={12} strokeWidth={1.5} /> {PROFILE.location}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
