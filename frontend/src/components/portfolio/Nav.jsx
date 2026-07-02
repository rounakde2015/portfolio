import { useEffect, useState } from "react";
import { ArrowUpRight, Sun, Moon } from "lucide-react";

const ThemeToggle = ({ theme, toggle }) => (
  <button
    type="button"
    onClick={toggle}
    className="theme-toggle group"
    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    data-testid="theme-toggle"
    data-current-theme={theme}
  >
    <span
      className="absolute inset-0 flex items-center justify-center transition-all duration-500"
      style={{
        opacity: theme === "dark" ? 1 : 0,
        transform:
          theme === "dark" ? "rotate(0)" : "rotate(180deg) scale(0.5)",
      }}
    >
      <Moon size={14} strokeWidth={1.5} />
    </span>
    <span
      className="absolute inset-0 flex items-center justify-center transition-all duration-500"
      style={{
        opacity: theme === "light" ? 1 : 0,
        transform:
          theme === "light" ? "rotate(0)" : "rotate(-180deg) scale(0.5)",
      }}
    >
      <Sun size={14} strokeWidth={1.5} />
    </span>
  </button>
);

export const Nav = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5"
          : ""
      }`}
      data-testid="main-nav"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <a
          href="#hero"
          className="font-mono text-sm tracking-widest text-white hover:text-[#00E5FF] transition-colors"
          data-testid="nav-logo"
        >
          <span className="text-[#00E5FF]">/</span>AC
          <span className="blink text-[#00E5FF]">_</span>
        </a>
        <div className="hidden md:flex items-center gap-10 font-mono text-xs uppercase tracking-[0.2em] text-white/60">
          {["about", "skills", "work", "experience", "contact"].map((s) => (
            <a
              key={s}
              href={`#${s}`}
              className="hover:text-[#00E5FF] transition-colors"
              data-testid={`nav-link-${s}`}
            >
              {s}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle theme={theme} toggle={toggleTheme} />
          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#00E5FF] hover:gap-3 transition-all"
            data-testid="nav-cta"
          >
            Let&apos;s talk <ArrowUpRight size={14} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </nav>
  );
};
