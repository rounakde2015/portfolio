"use client";

import { SectionHeading } from "./SectionHeading";
import { SKILLS } from "./constants";
import { useReveal } from "./hooks";

export const Skills = () => {
  const ref = useReveal<HTMLElement>();
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
