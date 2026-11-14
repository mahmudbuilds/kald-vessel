import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ANATOMY_LAYERS } from '../data/products';
import type { FlaskChoreographyState } from './FlaskCanvas';

gsap.registerPlugin(ScrollTrigger);

interface AnatomySectionProps {
  choreographyRef: React.MutableRefObject<FlaskChoreographyState>;
}

export function AnatomySection({ choreographyRef }: AnatomySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinTriggerRef = useRef<ScrollTrigger | null>(null);
  const [explodePct, setExplodePct] = useState(0);
  const [activeLayerIdx, setActiveLayerIdx] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        end: 'top 15%',
        scrub: true,
        onUpdate: (self) => {
          choreographyRef.current.stageShift = self.progress;
        },
      });

      pinTriggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=2200',
        pin: true,
        scrub: 0.65,
        onUpdate: (self) => {
          const p = self.progress;
          choreographyRef.current.explodeProgress = p;
          choreographyRef.current.stageShift = 1;
          setExplodePct(Math.round(p * 100));

          const idx = Math.min(
            ANATOMY_LAYERS.length - 1,
            Math.floor(p * ANATOMY_LAYERS.length)
          );
          setActiveLayerIdx(idx);
        },
      });

      ScrollTrigger.create({
        trigger: section,
        start: 'bottom 70%',
        end: 'bottom 10%',
        scrub: true,
        onUpdate: (self) => {
          choreographyRef.current.visibility = 1 - self.progress;
        },
        onLeaveBack: () => {
          choreographyRef.current.visibility = 1;
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [choreographyRef]);

  const jumpToLayer = (idx: number) => {
    const st = pinTriggerRef.current;
    if (!st) return;
    const targetProgress = idx / (ANATOMY_LAYERS.length - 1);
    const targetScroll = st.start + (st.end - st.start) * Math.min(0.98, targetProgress + 0.04);
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  return (
    <section
      id="anatomy"
      ref={sectionRef}
      className="relative z-10 flex min-h-screen w-full items-center overflow-hidden bg-[#09090b] px-6 py-24 text-[#f4f1ea] md:px-12"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,114,78,0.08),transparent_55%)]" />

      <div className="relative z-30 mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="pointer-events-none flex min-h-[38vh] flex-col justify-between lg:col-span-6 lg:min-h-[76vh]">
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
              <span className="font-mono-tech text-[11px] tracking-[0.22em] text-[#d4724e] uppercase">
                02 / INTERNAL ANATOMY
              </span>
              <span className="h-[1px] w-16 bg-[#f4f1ea]/20" />
              <span className="font-mono-tech text-[11px] tracking-[0.2em] text-[#f4f1ea]/55 tabular-nums uppercase">
                DISASSEMBLY {String(explodePct).padStart(3, '0')}%
              </span>
            </div>

            <div className="hidden lg:inline-flex items-center gap-3 rounded-full border border-[#f4f1ea]/12 bg-[#09090b]/75 px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#d4724e]" />
              <span className="font-mono-tech text-[10px] tracking-[0.2em] text-[#f4f1ea]/70 uppercase">
                LIVE CAD EXPLOSION · CLICK LAYER OR SCROLL
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:col-span-6">
          <div className="mb-2">
            <h2 className="font-display text-3xl leading-[1.02] font-bold tracking-tight uppercase md:text-5xl">
              Five layers.
              <span className="block font-serif-editorial font-normal italic text-[#f4f1ea]/80 lowercase">
                Zero thermal bridge.
              </span>
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {ANATOMY_LAYERS.map((layer, index) => {
              const isActive = index === activeLayerIdx;
              return (
                <button
                  key={layer.index}
                  type="button"
                  onClick={() => jumpToLayer(index)}
                  data-cursor={`LAYER ${layer.index}`}
                  className={`relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-500 backdrop-blur-md ${
                    isActive
                      ? 'border-[#d4724e]/75 bg-[#141418]/92 shadow-[0_0_40px_rgba(212,114,78,0.14)]'
                      : 'border-[#f4f1ea]/10 bg-[#0f0f12]/60 opacity-60 hover:opacity-90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono-tech text-xs font-medium tracking-[0.2em] ${
                          isActive ? 'text-[#d4724e]' : 'text-[#f4f1ea]/40'
                        }`}
                      >
                        {layer.index}
                      </span>
                      <span className="font-mono-tech text-[10px] tracking-[0.2em] text-[#f4f1ea]/50 uppercase">
                        {layer.part}
                      </span>
                    </div>
                    <span className="font-mono-tech text-[10px] tracking-[0.15em] text-[#f4f1ea]/45">
                      {layer.spec}
                    </span>
                  </div>

                  <h3 className="mt-2 font-display text-lg font-semibold tracking-tight md:text-xl">
                    {layer.title}
                  </h3>
                  <div
                    className={`grid transition-all duration-500 ease-out ${
                      isActive
                        ? 'grid-rows-[1fr] pt-1.5 opacity-100'
                        : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <p className="overflow-hidden text-sm leading-relaxed text-[#f4f1ea]/70">
                      {layer.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
