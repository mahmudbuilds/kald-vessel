import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowDownRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { FLASK_EDITIONS, type FlaskEdition } from '../data/products';
import { MagneticButton } from './MagneticButton';

interface HeroSectionProps {
  selectedEdition: FlaskEdition;
  onSelectEdition: (edition: FlaskEdition) => void;
  onQuickAdd: () => void;
  ready: boolean;
}

export function HeroSection({
  selectedEdition,
  onSelectEdition,
  onQuickAdd,
  ready,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ready || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-reveal',
        { y: 56, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.05,
          stagger: 0.09,
          ease: 'power4.out',
          delay: 0.08,
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#09090b] px-6 pt-28 pb-10 text-[#f4f1ea] md:px-12 md:pt-32 md:pb-12"
    >
      {/* Subtle architectural hairline grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #f4f1ea 1px, transparent 1px), linear-gradient(to bottom, #f4f1ea 1px, transparent 1px)',
          backgroundSize: '120px 120px',
        }}
      />

      {/* Ambient reactive halo behind 3D Flask */}
      <div
        className="pointer-events-none absolute top-1/2 right-[8%] h-[520px] w-[520px] -translate-y-1/2 rounded-full blur-[150px] transition-colors duration-700"
        style={{ backgroundColor: selectedEdition.accentHex, opacity: 0.16 }}
      />

      {/* Mobile readability gradient over 3D showcase */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[25] h-[68%] bg-gradient-to-t from-[#09090b] via-[#09090b]/82 to-transparent lg:hidden" />

      {/* Depth Layer 1 (Behind 3D Flask): Monumental outline numeral */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-end overflow-hidden pr-4 md:pr-16">
        <span className="font-display text-[32vw] leading-none font-extrabold tracking-tighter text-stroke-light select-none opacity-45 md:text-[24vw]">
          01
        </span>
      </div>

      {/* Depth Layer 3 (Foreground UI, pointer-events-none except controls so 3D canvas stays draggable) */}
      <div className="pointer-events-none relative z-30 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-between">
        {/* Top Metadata Row */}
        <div className="hero-reveal flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-[#d4724e]" />
            <span className="font-mono-tech text-[11px] tracking-[0.22em] text-[#f4f1ea]/70 uppercase">
              RELEASE 04 · VACUUM THERMAL ARCHITECTURE
            </span>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-[#f4f1ea]/15 bg-[#09090b]/60 px-3.5 py-1.5 backdrop-blur-md md:flex">
            <Sparkles className="h-3 w-3 text-[#d4724e]" />
            <span className="font-mono-tech text-[10px] tracking-[0.2em] text-[#f4f1ea]/70 uppercase">
              DRAG VESSEL TO INSPECT 360°
            </span>
          </div>
        </div>

        {/* Center Editorial Headline & Interactive Controls */}
        <div className="my-auto max-w-2xl pt-44 pb-6 lg:py-8">
          <h1 className="hero-reveal font-display text-[clamp(2.2rem,6.8vw,6.4rem)] leading-[0.9] font-extrabold tracking-[-0.03em] uppercase">
            Stillness
            <span className="block font-serif-editorial text-[clamp(2.5rem,7.2vw,6.8rem)] font-normal italic tracking-normal text-[#f4f1ea]/90 lowercase">
              under pressure.
            </span>
          </h1>

          <p className="hero-reveal mt-6 max-w-md text-sm leading-relaxed text-[#f4f1ea]/70 md:text-base">
            Triple-barrier copper-lined vacuum flask milled from 18/8 surgical steel.
            Thirty-six hours glacial cold. Eighteen hours volcanic boil. Zero
            condensation on the hand.
          </p>

          {/* Interactive Live 3D Colorway Switcher */}
          <div className="hero-reveal pointer-events-auto mt-8 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="font-mono-tech text-[10px] tracking-[0.22em] text-[#f4f1ea]/50 uppercase">
                FINISH —
              </span>
              <span className="font-mono-tech text-[11px] tracking-[0.18em] text-[#f4f1ea] uppercase">
                {selectedEdition.name} ({selectedEdition.code})
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {FLASK_EDITIONS.map((ed) => {
                const isActive = ed.id === selectedEdition.id;
                return (
                  <button
                    key={ed.id}
                    type="button"
                    onClick={() => onSelectEdition(ed)}
                    data-cursor={ed.code}
                    className={`group flex items-center gap-2.5 rounded-full border px-3.5 py-2 transition-all duration-300 ${
                      isActive
                        ? 'border-[#f4f1ea] bg-[#f4f1ea]/10'
                        : 'border-[#f4f1ea]/15 bg-[#09090b]/50 hover:border-[#f4f1ea]/45'
                    }`}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full ring-1 ring-white/30"
                      style={{ backgroundColor: ed.hex }}
                    />
                    <span className="font-mono-tech text-[10px] tracking-[0.16em] uppercase">
                      {ed.name.split(' ')[1] ?? ed.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary CTAs */}
          <div className="hero-reveal pointer-events-auto mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton onClick={onQuickAdd} cursorLabel="ADD $68">
              Reserve KALD 01 — ${selectedEdition.basePrice}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>
            <a
              href="#anatomy"
              data-cursor="EXPLORE"
              className="inline-flex items-center gap-2 rounded-full border border-[#f4f1ea]/20 bg-[#09090b]/45 px-6 py-4 font-mono-tech text-[11px] tracking-[0.18em] uppercase backdrop-blur-md transition-colors hover:border-[#f4f1ea] hover:bg-[#f4f1ea]/5"
            >
              Inspect Anatomy
              <ArrowDownRight className="h-3.5 w-3.5 text-[#d4724e]" />
            </a>
          </div>
        </div>

        {/* Bottom Telemetry Strip */}
        <div className="hero-reveal flex flex-wrap items-end justify-between gap-6 border-t border-[#f4f1ea]/12 pt-5">
          <div className="grid grid-cols-3 gap-6 sm:gap-12">
            <div>
              <span className="block font-mono-tech text-[10px] tracking-[0.2em] text-[#f4f1ea]/45 uppercase">
                COLD HOLD
              </span>
              <span className="mt-1 block font-display text-lg font-bold md:text-xl">
                36 HRS
              </span>
            </div>
            <div>
              <span className="block font-mono-tech text-[10px] tracking-[0.2em] text-[#f4f1ea]/45 uppercase">
                HEAT HOLD
              </span>
              <span className="mt-1 block font-display text-lg font-bold md:text-xl">
                18 HRS
              </span>
            </div>
            <div>
              <span className="block font-mono-tech text-[10px] tracking-[0.2em] text-[#f4f1ea]/45 uppercase">
                VACUUM
              </span>
              <span className="mt-1 block font-display text-lg font-bold md:text-xl">
                -0.004 Pa
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono-tech text-[10px] tracking-[0.22em] text-[#f4f1ea]/55 uppercase">
            <span>SCROLL TO DISASSEMBLE</span>
            <span className="inline-flex h-7 w-4 items-start justify-center rounded-full border border-[#f4f1ea]/30 p-1">
              <span className="h-1.5 w-1 animate-bounce rounded-full bg-[#d4724e]" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
