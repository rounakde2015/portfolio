import { useRef } from "react";
import { Github, ExternalLink } from "lucide-react";
import { PROJECTS } from "./constants";
import { useReveal } from "./hooks";
import { SectionHeading } from "./SectionHeading";

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

export const Projects = () => {
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
