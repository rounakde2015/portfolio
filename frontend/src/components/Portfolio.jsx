import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Github,
  Linkedin,
  Mail,
  ArrowUpRight,
  Download,
  ArrowRight,
  ExternalLink,
  MapPin,
  Send,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PROFILE = {
  name: "Alex Chen",
  title: "Senior Software Engineer",
  tagline: "Building scalable systems that power real products.",
  location: "San Francisco, CA",
  email: "hello@alexchen.dev",
  github: "https://github.com/alexchen",
  linkedin: "https://linkedin.com/in/alexchen",
  years: "7+",
};

const PROJECT_IMGS = [
  "https://images.unsplash.com/photo-1526289034009-0240ddb68ce3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjBtaW5pbWFsJTIwdGVjaCUyMGdlb21ldHJ5fGVufDB8fHx8MTc4MjQ2ODA5OXww&ixlib=rb-4.1.0&q=85",
  "https://images.unsplash.com/photo-1638864616275-9f0b291a2eb6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHw0fHxhYnN0cmFjdCUyMGRhcmslMjBtaW5pbWFsJTIwdGVjaCUyMGdlb21ldHJ5fGVufDB8fHx8MTc4MjQ2ODA5OXww&ixlib=rb-4.1.0&q=85",
  "https://images.unsplash.com/photo-1532190872407-280735d27e08?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdCUyMGRhcmslMjBtaW5pbWFsJTIwdGVjaCUyMGdlb21ldHJ5fGVufDB8fHx8MTc4MjQ2ODA5OXww&ixlib=rb-4.1.0&q=85",
  "https://images.unsplash.com/photo-1660914256311-918659fae88f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwzfHxhYnN0cmFjdCUyMGRhcmslMjBtaW5pbWFsJTIwdGVjaCUyMGdlb21ldHJ5fGVufDB8fHx8MTc4MjQ2ODA5OXww&ixlib=rb-4.1.0&q=85",
];

const PROJECTS = [
  {
    title: "Distributed Payments Platform",
    blurb:
      "Processed $2B+ in annual transaction volume across 40+ countries with sub-100ms p99 latency.",
    tags: ["Java", "Spring", "Kafka", "PostgreSQL", "AWS"],
    github: "https://github.com",
    demo: "https://example.com",
    img: PROJECT_IMGS[0],
  },
  {
    title: "Realtime Collaboration Engine",
    blurb:
      "CRDT-based document sync serving 1M+ concurrent users with 99.99% uptime SLA.",
    tags: ["Node.js", "WebSockets", "Redis", "MongoDB", "GCP"],
    github: "https://github.com",
    demo: "https://example.com",
    img: PROJECT_IMGS[1],
  },
  {
    title: "ML-Powered Search API",
    blurb:
      "Vector search platform indexing 200M+ documents, cut query latency by 73% over Elasticsearch.",
    tags: ["Python", "FastAPI", "pgvector", "React", "GCP"],
    github: "https://github.com",
    demo: "https://example.com",
    img: PROJECT_IMGS[2],
  },
  {
    title: "E-Commerce Storefront",
    blurb:
      "Headless commerce platform driving $45M GMV with sub-second TTI on mobile networks.",
    tags: ["React", "Next.js", "GraphQL", "PostgreSQL", "AWS"],
    github: "https://github.com",
    demo: "https://example.com",
    img: PROJECT_IMGS[3],
  },
  {
    title: "Observability Toolkit",
    blurb:
      "Open-source tracing SDK adopted by 12k+ developers; reduced MTTR by 60% across pilot teams.",
    tags: ["Go", "OpenTelemetry", "Kubernetes", "Grafana"],
    github: "https://github.com",
    demo: "https://example.com",
    img: PROJECT_IMGS[0],
  },
];

const SKILLS = [
  {
    group: "Frontend",
    items: ["React", "Angular", "Vue", "TypeScript", "Next.js", "Tailwind"],
  },
  {
    group: "Backend",
    items: ["Node.js", "Express", "Java", "Spring", "Go", "GraphQL"],
  },
  {
    group: "Databases",
    items: ["PostgreSQL", "MongoDB", "Redis", "Kafka", "Elasticsearch"],
  },
  {
    group: "Cloud & DevOps",
    items: ["AWS", "GCP", "Azure", "Kubernetes", "Terraform", "Docker"],
  },
];

const EXPERIENCE = [
  {
    role: "Staff Software Engineer",
    company: "Stripe",
    period: "2022 — Present",
    points: [
      "Led architecture of next-gen payments orchestration layer serving $2B+ ARR.",
      "Mentored 8 engineers; established cross-team SLO discipline reducing incidents by 42%.",
      "Designed multi-region failover strategy with sub-30s RTO across 4 AWS regions.",
    ],
  },
  {
    role: "Senior Software Engineer",
    company: "Datadog",
    period: "2020 — 2022",
    points: [
      "Owned distributed tracing ingestion pipeline processing 50M spans/sec.",
      "Reduced storage costs 38% via custom columnar compression in ClickHouse.",
      "Drove migration of legacy Java services to Go, cutting p99 latency by 4x.",
    ],
  },
  {
    role: "Software Engineer",
    company: "Airbnb",
    period: "2018 — 2020",
    points: [
      "Shipped guest review platform redesign — boosted completion rate by 27%.",
      "Built realtime messaging service using Node.js and Kafka, scaling to 12M DAU.",
      "Authored design doc adopted as company-wide pattern for event-driven services.",
    ],
  },
  {
    role: "Junior Software Engineer",
    company: "Square",
    period: "2017 — 2018",
    points: [
      "Built merchant analytics dashboard in React used by 500k+ small businesses.",
      "Implemented SQL query optimization pipeline reducing report time from 12s to 800ms.",
    ],
  },
];

/* ───────────────── Hooks ───────────────── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const els = ref.current?.querySelectorAll(".reveal") || [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ───────────────── Nav ───────────────── */
const Nav = () => {
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
        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#00E5FF] hover:gap-3 transition-all"
          data-testid="nav-cta"
        >
          Let&apos;s talk <ArrowUpRight size={14} strokeWidth={1.5} />
        </a>
      </div>
    </nav>
  );
};

/* ───────────────── Hero ───────────────── */
const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-24 pb-12"
      data-testid="hero-section"
    >
      <div className="absolute inset-0 bg-grid opacity-50"></div>
      <div className="absolute inset-0 hero-glow"></div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0A0A0A] to-transparent"></div>

      <div className="relative max-w-6xl mx-auto px-6 md:px-12 w-full z-10">
        <div className="mono-label mb-8 flex items-center gap-3" data-testid="hero-availability">
          <span className="inline-block w-2 h-2 bg-[#00E5FF] rounded-full timeline-dot"></span>
          Available for senior engineering roles · {PROFILE.location}
        </div>

        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-8"
          data-testid="hero-name"
        >
          {PROFILE.name}.
          <br />
          <span className="text-white/30">{PROFILE.title}.</span>
        </h1>

        <p
          className="max-w-2xl text-lg md:text-2xl text-[#A1A1AA] font-light leading-relaxed mb-12"
          data-testid="hero-tagline"
        >
          {PROFILE.tagline}{" "}
          <span className="text-white">
            {PROFILE.years} years architecting distributed systems for products
            used by millions.
          </span>
        </p>

        <div className="flex flex-wrap gap-4 items-center">
          <a
            href="#work"
            className="btn-primary inline-flex items-center gap-3 font-mono uppercase text-sm font-bold tracking-wider px-8 py-4"
            data-testid="hero-cta-work"
          >
            See My Work <ArrowRight size={16} strokeWidth={2} />
          </a>
          <a
            href="#contact"
            className="btn-secondary inline-flex items-center gap-3 font-mono uppercase text-sm tracking-wider px-8 py-4"
            data-testid="hero-cta-contact"
          >
            Let&apos;s Talk <Send size={14} strokeWidth={1.5} />
          </a>
        </div>

        <div className="absolute bottom-12 right-6 md:right-12 hidden lg:flex flex-col items-end gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
          <span>Scroll</span>
          <span className="h-12 w-px bg-gradient-to-b from-[#00E5FF] to-transparent"></span>
        </div>
      </div>
    </section>
  );
};

/* ───────────────── Section Heading ───────────────── */
const SectionHeading = ({ index, label, title, subtitle }) => (
  <div className="mb-16 md:mb-24 max-w-3xl reveal">
    <div className="mono-label mb-6 flex items-center gap-3">
      <span>{index}</span>
      <span className="h-px w-12 bg-[#00E5FF]/40"></span>
      <span>{label}</span>
    </div>
    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4">
      {title}
    </h2>
    {subtitle && (
      <p className="text-lg text-[#A1A1AA] font-light leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);

/* ───────────────── About ───────────────── */
const About = () => {
  const ref = useReveal();
  return (
    <section
      id="about"
      ref={ref}
      className="relative py-24 md:py-40 border-t border-white/5"
      data-testid="about-section"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <SectionHeading
          index="01"
          label="About"
          title="Engineer. Architect. Builder."
        />
        <div className="grid md:grid-cols-5 gap-12 md:gap-20">
          <div className="md:col-span-3 space-y-6 reveal">
            <p className="text-lg md:text-xl text-[#F4F4F5] font-light leading-relaxed">
              I&apos;m a senior engineer with{" "}
              <span className="text-[#00E5FF]">{PROFILE.years} years</span>{" "}
              shipping production software at companies that don&apos;t get to fail
              — payments, observability, marketplaces.
            </p>
            <p className="text-base md:text-lg text-[#A1A1AA] font-light leading-relaxed">
              I think in tradeoffs: throughput vs latency, consistency vs
              availability, velocity vs stability. I&apos;ve designed systems that
              scaled from prototype to billions of requests, mentored teams
              from 3 to 30, and rolled back enough deploys to know when to
              ship and when to wait.
            </p>
            <p className="text-base md:text-lg text-[#A1A1AA] font-light leading-relaxed">
              My work spans the stack — from React frontends used by millions,
              to JVM services orchestrating cross-region replication, to
              infrastructure-as-code provisioning multi-cloud topologies.
              Pragmatic, opinionated, and obsessed with the details that ship.
            </p>
            <div className="pt-4">
              <a
                href="/resume.pdf"
                download
                className="btn-secondary inline-flex items-center gap-3 font-mono uppercase text-xs tracking-wider px-6 py-3"
                data-testid="download-resume-button"
              >
                <Download size={14} strokeWidth={1.5} />
                Download Resume
              </a>
            </div>
          </div>
          <div className="md:col-span-2 reveal">
            <div className="border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8">
              <div className="mono-label mb-6">// stats.json</div>
              <dl className="space-y-6 font-mono text-sm">
                {[
                  ["years_experience", PROFILE.years],
                  ["systems_shipped", "30+"],
                  ["engineers_mentored", "20+"],
                  ["uptime_record", "99.99%"],
                  ["timezone", "PST · UTC-8"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-3">
                    <dt className="text-[#A1A1AA]">{k}</dt>
                    <dd className="text-[#00E5FF] font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ───────────────── Skills ───────────────── */
const Skills = () => {
  const ref = useReveal();
  return (
    <section
      id="skills"
      ref={ref}
      className="relative py-24 md:py-40 border-t border-white/5"
      data-testid="skills-section"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <SectionHeading
          index="02"
          label="Stack"
          title="The toolkit, honed over years."
          subtitle="Not a buzzword list. These are the tools I've shipped to production, debugged at 3am, and taught others to use well."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILLS.map((s, i) => (
            <div
              key={s.group}
              className="reveal border border-white/5 bg-white/[0.02] p-8 hover:border-[#00E5FF]/30 transition-all duration-500 group"
              style={{ animationDelay: `${i * 80}ms` }}
              data-testid={`skill-group-${s.group.toLowerCase().replace(/[\s&]+/g, "-")}`}
            >
              <div className="mono-label mb-2">0{i + 1}</div>
              <h3 className="text-xl font-semibold text-white mb-6 group-hover:text-[#00E5FF] transition-colors">
                {s.group}
              </h3>
              <ul className="space-y-3 font-mono text-sm text-[#A1A1AA]">
                {s.items.map((it) => (
                  <li
                    key={it}
                    className="flex items-center gap-3 hover:text-white transition-colors"
                  >
                    <span className="text-[#00E5FF]/60">›</span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ───────────────── Projects ───────────────── */
const ProjectCard = ({ p, idx }) => {
  const ref = useRef(null);
  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };
  return (
    <article
      ref={ref}
      onMouseMove={onMove}
      className="project-card reveal border border-white/5 bg-white/[0.02] backdrop-blur-xl p-0 flex flex-col h-full overflow-hidden"
      style={{ animationDelay: `${idx * 100}ms` }}
      data-testid={`project-card-${idx}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-white/5">
        <img
          src={p.img}
          alt={p.title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>
        <div className="absolute top-4 left-4 mono-label !text-[10px] bg-[#0A0A0A]/80 backdrop-blur px-2 py-1 border border-white/10">
          PRJ_{String(idx + 1).padStart(2, "0")}
        </div>
      </div>
      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
          {p.title}
        </h3>
        <p className="text-[#A1A1AA] font-light leading-relaxed mb-6 flex-1">
          {p.blurb}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {p.tags.map((t) => (
            <span
              key={t}
              className="font-mono text-[11px] tracking-wider text-[#A1A1AA] bg-white/5 border border-white/5 px-2.5 py-1"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
          <a
            href={p.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/60 hover:text-[#00E5FF] transition-colors"
            data-testid={`project-${idx}-github`}
          >
            <Github size={14} strokeWidth={1.5} /> Code
          </a>
          <a
            href={p.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/60 hover:text-[#00E5FF] transition-colors ml-auto"
            data-testid={`project-${idx}-demo`}
          >
            Live Demo <ExternalLink size={14} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </article>
  );
};

const Projects = () => {
  const ref = useReveal();
  return (
    <section
      id="work"
      ref={ref}
      className="relative py-24 md:py-40 border-t border-white/5"
      data-testid="projects-section"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <SectionHeading
          index="03"
          label="Selected Work"
          title="Systems that scaled. Products that shipped."
          subtitle="A snapshot of projects I've architected, built, or led. Each one taught me something I couldn't have learned in a book."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} p={p} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ───────────────── Experience ───────────────── */
const Experience = () => {
  const ref = useReveal();
  return (
    <section
      id="experience"
      ref={ref}
      className="relative py-24 md:py-40 border-t border-white/5"
      data-testid="experience-section"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <SectionHeading
          index="04"
          label="Timeline"
          title="A decade in production."
          subtitle="The shipping log — companies I've worked at, roles I've held, problems I've solved."
        />
        <div className="relative border-l border-white/10 ml-2 md:ml-8 pl-8 md:pl-16">
          {EXPERIENCE.map((e, i) => (
            <div
              key={e.company}
              className="reveal relative pb-16 last:pb-0"
              style={{ animationDelay: `${i * 120}ms` }}
              data-testid={`experience-item-${i}`}
            >
              <span className="timeline-dot absolute -left-[42px] md:-left-[74px] top-2 w-[12px] h-[12px] bg-[#0A0A0A] border-2 border-[#00E5FF]"></span>
              <div className="mono-label mb-3">{e.period}</div>
              <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-1">
                {e.role}
              </h3>
              <div className="text-[#00E5FF] font-mono text-sm tracking-wider mb-6">
                @ {e.company}
              </div>
              <ul className="space-y-3 max-w-2xl">
                {e.points.map((pt, j) => (
                  <li
                    key={j}
                    className="text-[#A1A1AA] font-light leading-relaxed flex gap-3"
                  >
                    <span className="text-[#00E5FF] mt-2 flex-shrink-0">—</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ───────────────── Contact ───────────────── */
const Contact = () => {
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

/* ───────────────── Footer ───────────────── */
const Footer = () => (
  <footer
    className="relative border-t border-white/5 py-12"
    data-testid="footer"
  >
    <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="font-mono text-xs tracking-widest text-white/40">
        © {new Date().getFullYear()} {PROFILE.name.toUpperCase()} · CRAFTED
        WITH PRECISION
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

/* ───────────────── Portfolio Page ───────────────── */
export default function Portfolio() {
  return (
    <main data-testid="portfolio-root">
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </main>
  );
}
