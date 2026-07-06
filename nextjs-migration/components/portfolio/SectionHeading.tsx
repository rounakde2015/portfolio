type Props = {
  index: string;
  label: string;
  title: string;
  subtitle?: string;
};

export const SectionHeading = ({ index, label, title, subtitle }: Props) => (
  <div className="mb-16 md:mb-24 max-w-3xl reveal">
    <div className="mono-label mb-6 flex items-center gap-3">
      <span>{index}</span>
      <span className="h-px w-12 bg-[#00E5FF]/40" />
      <span>{label}</span>
    </div>
    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4">{title}</h2>
    {subtitle && <p className="text-lg text-[#A1A1AA] font-light leading-relaxed">{subtitle}</p>}
  </div>
);
