import { Github, Linkedin, Mail } from "lucide-react";
import { PROFILE } from "./constants";

export const Footer = () => (
  <footer className="relative border-t border-white/5 py-12" data-testid="footer">
    <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="font-mono text-xs tracking-widest text-white/40">
        © {new Date().getFullYear()} {PROFILE.name.toUpperCase()} · CRAFTED WITH PRECISION
      </div>
      <div className="flex items-center gap-6">
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-[#00E5FF] transition-colors"
          aria-label="GitHub"
          data-testid="footer-github"
        >
          <Github size={18} strokeWidth={1.5} />
        </a>
        <a
          href={PROFILE.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-[#00E5FF] transition-colors"
          aria-label="LinkedIn"
          data-testid="footer-linkedin"
        >
          <Linkedin size={18} strokeWidth={1.5} />
        </a>
        <a
          href={`mailto:${PROFILE.email}`}
          className="text-white/40 hover:text-[#00E5FF] transition-colors"
          aria-label="Email"
          data-testid="footer-email"
        >
          <Mail size={18} strokeWidth={1.5} />
        </a>
      </div>
    </div>
  </footer>
);
