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
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.045,
          ease: 'power3.out',
          delay: 0,
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-[100dvh] w-full flex-col justify-between overflow-hidden bg-[#09090b] px-5 pt-20 pb-6 text-[#f4f1ea] sm:px-8 sm:pt-24 sm:pb-8 md:px-12 md:pt-32 md:pb-12"
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

      {/* Mobile readability gradient over lower 3D area */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[25] h-[64%] bg-gradient-to-t from-[#09090b] via-[#09090b]/92 to-transparent lg:hidden" />

      {/* Depth Layer 1 (Behind 3D Flask): Monumental outline numeral */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-end overflow-hidden pr-4 md:pr-16">
        <span className="font-display text-[32vw] leading-none font-extrabold tracking-tighter text-stroke-light select-none opacity-45 md:text-[24vw]">
          01
        </span>
      </div>

      {/* Depth Layer 3 (Foreground UI, pointer-events-none except controls so 3D canvas stays draggable) */}
      <div className="pointer-events-none relative z-30 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-between">
        {/* Desktop Top Metadata Row */}
        <div className="hero-reveal hidden flex-wrap items-center justify-between gap-4 lg:flex">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-[#d4724e]" />
            <span className="font-mono-tech text-[11px] tracking-[0.22em] text-[#f4f1ea]/70 uppercase">
              Gothenburg Edition · 750ml Insulated Flask
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#f4f1ea]/15 bg-[#09090b]/60 px-3.5 py-1.5 backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-[#d4724e]" />
            <span className="font-mono-tech text-[10px] tracking-[0.2em] text-[#f4f1ea]/70 uppercase">
              Drag to rotate 360°
            </span>
          </div>
        </div>

        {/* Dedicated mobile/tablet top window so the 3D flask floats unobstructed */}
        <div className="h-[26dvh] min-h-[165px] max-h-[270px] sm:h-[31dvh] sm:max-h-[340px] w-full shrink-0 lg:hidden" />

        {/* Center Editorial Headline & Interactive Controls */}
        <div className="my-auto max-w-2xl py-1 lg:py-8">
          <div className="hero-reveal mb-2.5 flex items-center gap-2 lg:hidden">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#d4724e]" />
            <span className="font-mono-tech text-[10px] tracking-[0.2em] text-[#f4f1ea]/65 uppercase sm:text-[11px]">
              Gothenburg Edition · 750ml Insulated Flask
            </span>
          </div>

          <h1 className="hero-reveal font-display text-[clamp(2rem,6.6vw,6.4rem)] leading-[0.9] font-extrabold tracking-[-0.03em] uppercase">
            Stillness
            <span className="block font-serif-editorial text-[clamp(2.2rem,7vw,6.8rem)] font-normal italic tracking-normal text-[#f4f1ea]/90 lowercase">
              under pressure.
            </span>
          </h1>

          <p className="hero-reveal mt-2.5 max-w-md text-xs leading-relaxed text-[#f4f1ea]/72 sm:mt-4 sm:text-sm md:text-base">
            Triple-barrier copper-lined vacuum flask milled from 18/8 surgical steel.
            Thirty-six hours ice cold. Eighteen hours piping hot. Zero
            condensation on the hand.
          </p>

          {/* Interactive Live 3D Colorway Switcher */}
          <div className="hero-reveal pointer-events-auto mt-3.5 flex flex-col gap-2 sm:mt-6">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-[10px] tracking-[0.2em] text-[#f4f1ea]/50 uppercase">
                FINISH —
              </span>
              <span className="font-mono-tech text-[10px] tracking-[0.16em] text-[#f4f1ea] uppercase sm:text-[11px]">
                {selectedEdition.name}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
              {FLASK_EDITIONS.map((ed) => {
                const isActive = ed.id === selectedEdition.id;
                return (
                  <button
                    key={ed.id}
                    type="button"
                    onClick={() => onSelectEdition(ed)}
                    data-cursor={ed.code}
                    className={`group flex items-center justify-start gap-2 rounded-full border px-3 py-1.5 transition-all duration-300 sm:px-3.5 sm:py-2 ${
                      isActive
                        ? 'border-[#f4f1ea] bg-[#f4f1ea]/12'
                        : 'border-[#f4f1ea]/15 bg-[#09090b]/60 hover:border-[#f4f1ea]/45'
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-white/30 sm:h-3.5 sm:w-3.5"
                      style={{ backgroundColor: ed.hex }}
                    />
                    <span className="truncate font-mono-tech text-[9.5px] tracking-[0.1em] uppercase sm:text-[10px] sm:tracking-[0.14em]">
                      {ed.name.split(' ')[1] ?? ed.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary CTAs */}
          <div className="hero-reveal pointer-events-auto mt-3.5 grid grid-cols-2 gap-2 sm:mt-7 sm:flex sm:flex-wrap sm:items-center sm:gap-4">
            <MagneticButton
              onClick={onQuickAdd}
              cursorLabel={`ADD $${selectedEdition.basePrice}`}
              className="w-full justify-center px-3 py-3 text-[10px] tracking-[0.14em] sm:w-auto sm:px-7 sm:py-4 sm:text-xs sm:tracking-[0.18em]"
            >
              <span>Add — ${selectedEdition.basePrice}</span>
              <ArrowUpRight className="hidden h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:inline-block" />
            </MagneticButton>
            <a
              href="#anatomy"
              data-cursor="EXPLORE"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-[#f4f1ea]/20 bg-[#09090b]/55 px-3 py-3 font-mono-tech text-[10px] tracking-[0.14em] uppercase backdrop-blur-md transition-colors hover:border-[#f4f1ea] hover:bg-[#f4f1ea]/5 sm:w-auto sm:gap-2 sm:px-6 sm:py-4 sm:text-[11px] sm:tracking-[0.18em]"
            >
              <span>See Layers</span>
              <ArrowDownRight className="h-3.5 w-3.5 text-[#d4724e]" />
            </a>
          </div>
        </div>

        {/* Bottom Highlights Strip */}
        <div className="hero-reveal mt-3 flex flex-wrap items-end justify-between gap-4 border-t border-[#f4f1ea]/12 pt-3 sm:mt-4 sm:pt-5">
          <div className="grid w-full grid-cols-3 gap-3 sm:w-auto sm:gap-12">
            <div>
              <span className="block font-mono-tech text-[9px] tracking-[0.18em] text-[#f4f1ea]/45 uppercase sm:text-[10px]">
                ICE COLD
              </span>
              <span className="mt-0.5 block font-display text-sm font-bold sm:mt-1 sm:text-lg md:text-xl">
                36 Hours
              </span>
            </div>
            <div>
              <span className="block font-mono-tech text-[9px] tracking-[0.18em] text-[#f4f1ea]/45 uppercase sm:text-[10px]">
                PIPING HOT
              </span>
              <span className="mt-0.5 block font-display text-sm font-bold sm:mt-1 sm:text-lg md:text-xl">
                18 Hours
              </span>
            </div>
            <div>
              <span className="block font-mono-tech text-[9px] tracking-[0.18em] text-[#f4f1ea]/45 uppercase sm:text-[10px]">
                INTERIOR
              </span>
              <span className="mt-0.5 block font-display text-sm font-bold sm:mt-1 sm:text-lg md:text-xl">
                18/8 Steel
              </span>
            </div>
          </div>

          <div className="hidden items-center gap-3 font-mono-tech text-[10px] tracking-[0.22em] text-[#f4f1ea]/55 uppercase sm:flex">
            <span>Scroll to explore</span>
            <span className="inline-flex h-7 w-4 items-start justify-center rounded-full border border-[#f4f1ea]/30 p-1">
              <span className="h-1.5 w-1 animate-bounce rounded-full bg-[#d4724e]" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
