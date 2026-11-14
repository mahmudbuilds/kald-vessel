import { useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

const SPECS_ACCORDION = [
  {
    code: '01',
    question: 'How does KALD achieve 36 hours cold without exterior condensation?',
    answer:
      'A high-vacuum 0.004 Pa gap eliminates air molecules between the 0.5mm inner and outer 304 steel shells, halting conductive and convective heat transfer. Our 99.9% copper foil lining reflects ambient infrared radiation outward, keeping the exterior strictly at room temperature.',
  },
  {
    code: '02',
    question: 'Is the interior coated with plastic or ceramic paint?',
    answer:
      'Never. The liquid only touches electropolished 18/8 surgical-grade stainless steel. Electropolishing dissolves microscopic surface peaks to create a mirror-smooth passive barrier that never retains coffee oils, citrus acidity, or metallic taste.',
  },
  {
    code: '03',
    question: 'What does the Lifetime Seal Guarantee cover?',
    answer:
      'If your KALD 01 ever loses vacuum insulation, develops a leak at the weld seam, or experiences cap thread failure, we replace the vessel or dispatch precision CNC spare gaskets free of charge anywhere in the world.',
  },
  {
    code: '04',
    question: 'Are replacement silicone gaskets and titanium caps available?',
    answer:
      'Yes. Every KALD vessel is designed with zero adhesives and modular O-rings so you can sanitize, service, and pass the flask down across decades.',
  },
];

interface SpecsAndFooterProps {
  onReserveClick: () => void;
}

export function SpecsAndFooter({ onReserveClick }: SpecsAndFooterProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <footer className="relative z-30 w-full bg-[#09090b] px-6 pt-28 pb-12 text-[#f4f1ea] md:px-12">
      <div className="mx-auto max-w-[1600px]">
        {/* Technical Dossier Accordion */}
        <div className="grid grid-cols-1 gap-12 border-t border-[#f4f1ea]/12 pt-20 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="font-mono-tech text-[11px] tracking-[0.22em] text-[#d4724e] uppercase">
              06 / TECHNICAL DOSSIER
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight uppercase md:text-5xl">
              Precision
              <span className="block font-serif-editorial font-normal italic text-[#f4f1ea]/80 lowercase">
                verified.
              </span>
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#f4f1ea]/60">
              Every batch undergoes helium mass-spectrometer leak testing and 24-hour
              thermal chamber calibration before leaving Gothenburg.
            </p>
          </div>

          <div className="divide-y divide-[#f4f1ea]/12 lg:col-span-7">
            {SPECS_ACCORDION.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={item.code} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    data-cursor={isOpen ? 'CLOSE' : 'READ'}
                    className="flex w-full items-center justify-between gap-6 text-left"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono-tech text-xs text-[#d4724e]">
                        {item.code}
                      </span>
                      <span className="font-display text-lg font-semibold tracking-tight md:text-xl">
                        {item.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#f4f1ea]/60 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#d4724e]' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr] pt-4 opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <p className="overflow-hidden pl-8 text-sm leading-relaxed text-[#f4f1ea]/65">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Closing Editorial Banner */}
        <div className="mt-28 flex flex-col items-start justify-between gap-10 rounded-3xl border border-[#f4f1ea]/12 bg-[#111114] p-8 md:flex-row md:items-end md:p-16">
          <div>
            <span className="font-mono-tech text-[11px] tracking-[0.22em] text-[#d4724e] uppercase">
              BATCH 04 NOW SHIPPING
            </span>
            <h3 className="mt-4 font-display text-4xl leading-[0.95] font-extrabold tracking-tight uppercase md:text-6xl">
              Own the
              <span className="ml-3 font-serif-editorial font-normal italic text-[#f4f1ea]/85 lowercase">
                stillness.
              </span>
            </h3>
          </div>

          <MagneticButton onClick={onReserveClick} cursorLabel="CONFIGURE">
            Configure Your Vessel
            <ArrowUpRight className="h-4 w-4" />
          </MagneticButton>
        </div>

        {/* Monumental Footer Wordmark */}
        <div className="mt-24 border-t border-[#f4f1ea]/10 pt-10">
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono-tech text-[10px] tracking-[0.22em] text-[#f4f1ea]/45 uppercase">
            <span>© 2026 KALD THERMAL STUDIO AB · GOTHENBURG</span>
            <span>SHIPS CARBON-NEUTRAL WORLDWIDE</span>
            <span>INSTAGRAM · ARCHIVE · WARRANTY</span>
          </div>
          <div className="mt-6 overflow-hidden select-none">
            <span className="block font-display text-[15.5vw] leading-[0.82] font-extrabold tracking-[-0.05em] text-[#f4f1ea]/[0.07] uppercase">
              KALD®
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
