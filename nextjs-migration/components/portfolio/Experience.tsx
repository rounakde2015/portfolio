"use client";

import { SectionHeading } from "./SectionHeading";
import { EXPERIENCE } from "./constants";
import { useReveal } from "./hooks";

export const Experience = () => {
  const ref = useReveal<HTMLElement>();
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
              <span className="timeline-dot absolute -left-[42px] md:-left-[74px] top-2 w-[12px] h-[12px] bg-[#0A0A0A] border-2 border-[#00E5FF]" />
              <div className="mono-label mb-3">{e.period}</div>
              <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-1">
                {e.role}
              </h3>
              <div className="text-[#00E5FF] font-mono text-sm tracking-wider mb-6">
                @ {e.company}
              </div>
              <ul className="space-y-3 max-w-2xl">
                {e.points.map((pt) => (
                  <li key={pt} className="text-[#A1A1AA] font-light leading-relaxed flex gap-3">
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
