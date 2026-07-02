import { useEffect, useRef, useState } from "react";
import { ArrowRight, Send } from "lucide-react";
import { PROFILE, HERO_ROLES, HERO_TICKER } from "./constants";

export const Hero = () => {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const [roleIdx, setRoleIdx] = useState(0);

  // Rotating role — state-based, predictable
  useEffect(() => {
    const id = setInterval(() => {
      setRoleIdx((i) => (i + 1) % (HERO_ROLES.length - 1));
    }, 2600);
    return () => clearInterval(id);
  }, []);

  // Parallax + cursor spotlight
  useEffect(() => {
    const onScroll = () => {
      const y = Math.min(window.scrollY * 0.25, 120);
      if (contentRef.current) {
        contentRef.current.style.setProperty("--py", `-${y}px`);
      }
    };
    const onMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      heroRef.current.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      heroRef.current.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const el = heroRef.current;
    el?.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      el?.removeEventListener("mousemove", onMove);
    };
  }, []);

  const nameLetters = PROFILE.name.split("");
  const currentRole = HERO_ROLES[roleIdx];

  return (
    <section
      id="hero"
      ref={heroRef}
      className="hero-section relative min-h-screen flex items-center pt-24 pb-40 overflow-hidden"
      data-testid="hero-section"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid opacity-60"></div>
      <div className="absolute inset-0 hero-glow"></div>
      <div className="hero-spotlight"></div>

      {/* Floating orbs */}
      <div
        className="hero-orb"
        style={{
          width: 500,
          height: 500,
          left: "-8%",
          top: "10%",
          background:
            "radial-gradient(circle, var(--primary-glow), transparent 70%)",
        }}
      ></div>
      <div
        className="hero-orb"
        style={{
          width: 380,
          height: 380,
          right: "-6%",
          bottom: "18%",
          animationDelay: "3s",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)",
        }}
      ></div>

      {/* Scanning line */}
      <div className="scan-line"></div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-16 h-24 bg-gradient-to-t from-[#0A0A0A] to-transparent z-[1]"></div>

      <div
        ref={contentRef}
        className="hero-parallax relative max-w-6xl mx-auto px-6 md:px-12 w-full z-10"
      >
        {/* Availability pill */}
        <div
          className="mono-label mb-10 inline-flex items-center gap-3 border border-white/10 bg-white/[0.02] backdrop-blur-md px-4 py-2"
          data-testid="hero-availability"
          style={{
            animation: "fade-up 0.8s ease forwards",
            opacity: 0,
            animationDelay: "0.1s",
          }}
        >
          <span className="inline-block w-2 h-2 bg-[#00E5FF] rounded-full timeline-dot"></span>
          Available for senior roles · {PROFILE.location}
        </div>

        {/* Massive kinetic name */}
        <h1
          className="text-[15vw] sm:text-[13vw] md:text-[11vw] lg:text-[10rem] xl:text-[12rem] font-black tracking-[-0.04em] leading-[0.85] mb-6"
          data-testid="hero-name"
          aria-label={PROFILE.name}
        >
          <span className="block">
            {nameLetters.map((ch, i) => (
              <span
                key={i}
                className="hero-letter"
                style={{ animationDelay: `${0.25 + i * 0.06}s` }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
            <span
              className="hero-letter text-[#00E5FF]"
              style={{
                animationDelay: `${0.25 + nameLetters.length * 0.06}s`,
              }}
            >
              .
            </span>
          </span>
        </h1>

        {/* Rotating role subtitle */}
        <div
          className="mb-10 flex flex-wrap items-center gap-x-4 gap-y-2"
          style={{
            animation: "fade-up 0.8s ease forwards",
            opacity: 0,
            animationDelay: `${0.4 + nameLetters.length * 0.06}s`,
          }}
        >
          <span className="font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-[#00E5FF]">
            &gt; whoami --
          </span>
          <span
            key={currentRole}
            className="text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white inline-block"
            style={{
              animation: "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) forwards",
              opacity: 0,
            }}
            data-testid="hero-role-rotator"
          >
            {currentRole}
          </span>
          <span className="caret"></span>
        </div>

        {/* Tagline */}
        <p
          className="max-w-2xl text-lg md:text-2xl text-[#A1A1AA] font-light leading-relaxed mb-12"
          data-testid="hero-tagline"
          style={{
            animation: "fade-up 0.8s ease forwards",
            opacity: 0,
            animationDelay: `${0.55 + nameLetters.length * 0.06}s`,
          }}
        >
          {PROFILE.tagline}{" "}
          <span className="text-white">
            {PROFILE.years} years architecting distributed systems for products
            used by millions.
          </span>
        </p>

        {/* CTAs */}
        <div
          className="flex flex-wrap gap-4 items-center"
          style={{
            animation: "fade-up 0.8s ease forwards",
            opacity: 0,
            animationDelay: `${0.7 + nameLetters.length * 0.06}s`,
          }}
        >
          <a
            href="#work"
            className="btn-primary inline-flex items-center gap-3 font-mono uppercase text-sm font-bold tracking-wider px-10 py-5 group"
            data-testid="hero-cta-work"
          >
            See My Work
            <ArrowRight
              size={16}
              strokeWidth={2}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
          <a
            href="#contact"
            className="btn-secondary inline-flex items-center gap-3 font-mono uppercase text-sm tracking-wider px-10 py-5 group"
            data-testid="hero-cta-contact"
          >
            Let&apos;s Talk
            <Send
              size={14}
              strokeWidth={1.5}
              className="group-hover:-rotate-12 group-hover:translate-x-1 transition-transform"
            />
          </a>
          <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.25em] text-white/40 hidden md:inline-flex items-center gap-2">
            <span className="w-8 h-px bg-white/20"></span>
            or press
            <kbd className="px-1.5 py-0.5 border border-white/15 text-white/60">
              ⌘
            </kbd>
            <kbd className="px-1.5 py-0.5 border border-white/15 text-white/60">
              K
            </kbd>
          </span>
        </div>

        {/* Scroll indicator */}
        <div className="absolute -bottom-24 right-6 md:right-12 hidden lg:flex flex-col items-end gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
          <span>Scroll</span>
          <span className="h-16 w-px bg-gradient-to-b from-[#00E5FF] to-transparent"></span>
        </div>
      </div>

      {/* Tech ticker at bottom of hero */}
      <div className="hero-ticker absolute bottom-0 left-0 right-0 py-4 z-10 backdrop-blur-sm bg-[#0A0A0A]/40">
        <div className="marquee-track flex whitespace-nowrap">
          {[...HERO_TICKER, ...HERO_TICKER].map((t, i) => (
            <span
              key={i}
              className={t.accent ? "accent" : ""}
              aria-hidden={i >= HERO_TICKER.length}
            >
              {t.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
