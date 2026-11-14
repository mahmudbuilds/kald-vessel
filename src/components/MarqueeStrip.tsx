export function MarqueeStrip() {
  const items = [
    '0.004 PA VACUUM CHAMBER',
    '99.9% COPPER RADIATION SHIELD',
    '18/8 SURGICAL STEEL',
    'ZERO CONDENSATION SHELL',
    'CNC KNURLED TITANIUM CAP',
    'LIFETIME SEAL GUARANTEE',
  ];

  return (
    <div className="relative z-30 overflow-hidden border-y border-[#f4f1ea]/12 bg-[#0d0d10] py-5 text-[#f4f1ea]">
      <div className="animate-marquee flex items-center gap-12">
        {[...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center gap-12">
            <span className="font-mono-tech text-xs tracking-[0.26em] whitespace-nowrap text-[#f4f1ea]/75 uppercase">
              {text}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4724e]" />
          </div>
        ))}
      </div>
    </div>
  );
}
