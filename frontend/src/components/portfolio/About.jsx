import { Download } from "lucide-react";
import { PROFILE } from "./constants";
import { useReveal } from "./hooks";
import { SectionHeading } from "./SectionHeading";

export const About = () => {
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
              shipping production software at companies that don&apos;t get to
              fail — payments, observability, marketplaces.
            </p>
            <p className="text-base md:text-lg text-[#A1A1AA] font-light leading-relaxed">
              I think in tradeoffs: throughput vs latency, consistency vs
              availability, velocity vs stability. I&apos;ve designed systems
              that scaled from prototype to billions of requests, mentored
              teams from 3 to 30, and rolled back enough deploys to know when
              to ship and when to wait.
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
                  <div
                    key={k}
                    className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-3"
                  >
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
