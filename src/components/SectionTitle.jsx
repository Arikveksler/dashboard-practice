export default function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-6 flex flex-col gap-1">
      {eyebrow && (
        <span className="brand-font text-xs font-semibold tracking-[0.3em] text-redline-bright">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl font-bold text-gray-100 md:text-3xl">{title}</h2>
      <div className="h-[3px] w-16 rounded bg-gradient-to-l from-redline-bright to-transparent" />
      {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    </div>
  );
}
