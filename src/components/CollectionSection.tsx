import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Plus, Sparkles } from 'lucide-react';
import {
  FLASK_EDITIONS,
  FLASK_SIZES,
  type FlaskEdition,
  type FlaskSize,
} from '../data/products';
import { MagneticButton } from './MagneticButton';

gsap.registerPlugin(ScrollTrigger);

interface CollectionSectionProps {
  selectedEdition: FlaskEdition;
  onSelectEdition: (edition: FlaskEdition) => void;
  onAddToCart: (edition: FlaskEdition, size: FlaskSize, engraving: string) => void;
  onThemeTrigger: (isLight: boolean) => void;
}

export function CollectionSection({
  selectedEdition,
  onSelectEdition,
  onAddToCart,
  onThemeTrigger,
}: CollectionSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedSize, setSelectedSize] = useState<FlaskSize>(FLASK_SIZES[1]); // 750ml default
  const [engraving, setEngraving] = useState('K.01');
  const [justAdded, setJustAdded] = useState(false);

  const finalPrice = selectedEdition.basePrice + selectedSize.priceDelta;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 35%',
        end: 'bottom 35%',
        onEnter: () => onThemeTrigger(true),
        onEnterBack: () => onThemeTrigger(true),
        onLeave: () => onThemeTrigger(false),
        onLeaveBack: () => onThemeTrigger(false),
      });

      gsap.fromTo(
        '.editions-stagger',
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [onThemeTrigger]);

  const handleAdd = () => {
    onAddToCart(selectedEdition, selectedSize, engraving.trim().toUpperCase());
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <section
      id="editions"
      ref={sectionRef}
      className="relative z-30 w-full bg-[#f4f1ea] px-6 py-28 text-[#111113] md:px-12 md:py-36"
    >
      <div className="mx-auto max-w-[1600px]">
        {/* Section Header */}
        <div className="editions-stagger mb-14 flex flex-wrap items-end justify-between gap-6 border-b border-[#111113]/12 pb-8">
          <div>
            <span className="font-mono-tech text-[11px] tracking-[0.22em] text-[#d4724e] uppercase">
              04 / ARCHITECTURAL EDITIONS
            </span>
            <h2 className="mt-3 font-display text-4xl leading-[0.95] font-extrabold tracking-tight uppercase md:text-6xl">
              Configure your
              <span className="ml-3 font-serif-editorial font-normal italic lowercase">
                vessel.
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-[#111113]/65">
            Four mineral-inspired finishes milled in small batches. Complimentary
            micro-laser monogramming included on every direct studio order.
          </p>
        </div>

        {/* Configurator Grid */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Left: Live Studio Blueprint & Laser Monogram Preview */}
          <div className="editions-stagger lg:col-span-6">
            <div className="relative flex min-h-[540px] flex-col items-center justify-between overflow-hidden rounded-3xl border border-[#111113]/10 bg-[#eae5db] p-8 md:p-12">
              <div className="flex w-full items-center justify-between">
                <span className="rounded-full bg-[#111113] px-3.5 py-1 font-mono-tech text-[10px] tracking-[0.2em] text-[#f4f1ea] uppercase">
                  {selectedEdition.tag}
                </span>
                <span className="font-mono-tech text-[11px] tracking-[0.18em] text-[#111113]/55 uppercase">
                  {selectedSize.dimensions} · {selectedSize.weight}
                </span>
              </div>

              {/* Architectural Studio Flask Silhouette Preview with Live Engraving */}
              <div className="relative my-8 flex items-center justify-center">
                {/* Soft studio drop shadow */}
                <div className="absolute -bottom-6 h-8 w-44 rounded-full bg-[#111113]/18 blur-xl" />

                <svg
                  viewBox="0 0 220 460"
                  className="h-[340px] w-auto transition-transform duration-500 hover:scale-[1.02] md:h-[390px]"
                >
                  <defs>
                    <linearGradient id="flaskBodyGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={selectedEdition.hex} stopOpacity="0.95" />
                      <stop offset="28%" stopColor="#ffffff" stopOpacity="0.18" />
                      <stop offset="55%" stopColor={selectedEdition.hex} stopOpacity="1" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
                    </linearGradient>
                    <linearGradient id="steelCollar" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#9fa3ab" />
                      <stop offset="35%" stopColor="#f4f5f8" />
                      <stop offset="70%" stopColor="#b5b9c0" />
                      <stop offset="100%" stopColor="#5e6168" />
                    </linearGradient>
                  </defs>

                  {/* Carry loop */}
                  <path
                    d="M 85 38 C 85 12, 135 12, 135 38"
                    fill="none"
                    stroke="url(#steelCollar)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />

                  {/* Knurled Titanium Cap */}
                  <rect x="68" y="34" width="84" height="44" rx="6" fill="#23252a" />
                  <g opacity="0.32" stroke="#f4f1ea" strokeWidth="1.2">
                    {Array.from({ length: 13 }).map((_, i) => (
                      <line key={i} x1={74 + i * 6} y1="40" x2={74 + i * 6} y2="72" />
                    ))}
                  </g>

                  {/* Accent Seal Ring */}
                  <rect
                    x="70"
                    y="78"
                    width="80"
                    height="7"
                    rx="2"
                    fill={selectedEdition.ringHex}
                  />

                  {/* Neck & Shoulder */}
                  <path
                    d="M 72 85 L 148 85 L 166 135 L 54 135 Z"
                    fill={selectedEdition.hex}
                  />
                  <path
                    d="M 72 85 L 148 85 L 166 135 L 54 135 Z"
                    fill="url(#flaskBodyGrad)"
                    opacity="0.55"
                  />

                  {/* Main Body */}
                  <rect
                    x="54"
                    y="133"
                    width="112"
                    height="275"
                    rx="14"
                    fill={selectedEdition.hex}
                  />
                  <rect
                    x="54"
                    y="133"
                    width="112"
                    height="275"
                    rx="14"
                    fill="url(#flaskBodyGrad)"
                    opacity="0.6"
                  />

                  {/* Laser Monogram Engraving Preview */}
                  <text
                    x="110"
                    y="235"
                    textAnchor="middle"
                    fill={
                      selectedEdition.id === 'limestone'
                        ? 'rgba(17,17,19,0.58)'
                        : 'rgba(244,241,234,0.72)'
                    }
                    fontSize="16"
                    fontFamily="JetBrains Mono, monospace"
                    letterSpacing="5"
                    fontWeight="500"
                  >
                    {engraving.trim().toUpperCase() || 'KALD'}
                  </text>

                  {/* Vertical brand stamp near base */}
                  <text
                    x="110"
                    y="376"
                    textAnchor="middle"
                    fill={
                      selectedEdition.id === 'limestone'
                        ? 'rgba(17,17,19,0.58)'
                        : 'rgba(244,241,234,0.68)'
                    }
                    fontSize="7"
                    fontFamily="JetBrains Mono, monospace"
                    letterSpacing="2"
                    fontWeight="500"
                  >
                    KALD® · {selectedSize.id.toUpperCase()}
                  </text>

                  {/* Vulcanized Silicone Base */}
                  <rect x="55" y="400" width="110" height="16" rx="6" fill="#18181b" />
                </svg>
              </div>

              <div className="flex w-full items-center justify-between border-t border-[#111113]/10 pt-4 font-mono-tech text-[10px] tracking-[0.2em] text-[#111113]/60 uppercase">
                <span>FINISH: {selectedEdition.subtitle}</span>
                <span>LASER ETCH: {engraving.trim().toUpperCase() || 'NONE'}</span>
              </div>
            </div>
          </div>

          {/* Right: Interactive Edition, Size & Monogram Controls */}
          <div className="editions-stagger flex flex-col gap-8 lg:col-span-6">
            {/* 1. Finish Selector */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono-tech text-[11px] tracking-[0.2em] text-[#111113]/60 uppercase">
                  01 · SELECT FINISH
                </span>
                <span className="font-mono-tech text-[11px] font-medium text-[#111113] uppercase">
                  {selectedEdition.name}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {FLASK_EDITIONS.map((ed) => {
                  const active = ed.id === selectedEdition.id;
                  return (
                    <button
                      key={ed.id}
                      type="button"
                      onClick={() => onSelectEdition(ed)}
                      data-cursor={ed.code}
                      className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all duration-300 ${
                        active
                          ? 'border-[#111113] bg-[#111113] text-[#f4f1ea] shadow-xl'
                          : 'border-[#111113]/15 bg-white/60 text-[#111113] hover:border-[#111113]/45'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className="h-7 w-7 rounded-full border border-black/15 shadow-inner"
                          style={{ backgroundColor: ed.hex }}
                        />
                        <div>
                          <span className="block font-display text-sm font-bold uppercase">
                            {ed.name}
                          </span>
                          <span
                            className={`block font-mono-tech text-[10px] tracking-[0.14em] uppercase ${
                              active ? 'text-[#f4f1ea]/60' : 'text-[#111113]/50'
                            }`}
                          >
                            {ed.subtitle}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono-tech text-xs font-medium">
                        ${ed.basePrice}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-sm text-[#111113]/65">
                {selectedEdition.description}
              </p>
            </div>

            {/* 2. Capacity Selector */}
            <div>
              <span className="mb-3 block font-mono-tech text-[11px] tracking-[0.2em] text-[#111113]/60 uppercase">
                02 · SELECT CAPACITY
              </span>
              <div className="grid grid-cols-3 gap-3">
                {FLASK_SIZES.map((sz) => {
                  const active = sz.id === selectedSize.id;
                  return (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      data-cursor={sz.id.toUpperCase()}
                      className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                        active
                          ? 'border-[#111113] bg-[#111113] text-[#f4f1ea]'
                          : 'border-[#111113]/15 bg-white/60 text-[#111113] hover:border-[#111113]/45'
                      }`}
                    >
                      <span className="block font-display text-base font-bold">
                        {sz.label}
                      </span>
                      <span
                        className={`mt-1 block font-mono-tech text-[10px] ${
                          active ? 'text-[#f4f1ea]/65' : 'text-[#111113]/55'
                        }`}
                      >
                        {sz.volume.split(' · ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Custom Laser Engraving */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2 font-mono-tech text-[11px] tracking-[0.2em] text-[#111113]/60 uppercase">
                  <Sparkles className="h-3.5 w-3.5 text-[#d4724e]" />
                  03 · LASER MONOGRAM (COMPLIMENTARY)
                </span>
                <span className="font-mono-tech text-[10px] text-[#111113]/50">
                  MAX 4 CHARS
                </span>
              </div>
              <input
                type="text"
                maxLength={4}
                value={engraving}
                onChange={(e) => setEngraving(e.target.value.toUpperCase())}
                placeholder="E.G. K.01"
                className="w-full rounded-2xl border border-[#111113]/20 bg-white/75 px-5 py-4 font-mono-tech text-sm tracking-[0.28em] text-[#111113] uppercase outline-none transition-colors focus:border-[#d4724e]"
              />
            </div>

            {/* Add to Bag Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#111113]/12 pt-6">
              <div>
                <span className="block font-mono-tech text-[10px] tracking-[0.2em] text-[#111113]/50 uppercase">
                  CONFIGURED TOTAL
                </span>
                <span className="text-4xl font-semibold tracking-tight tabular-nums">
                  ${finalPrice}
                </span>
              </div>

              <MagneticButton
                onClick={handleAdd}
                variant="dark"
                cursorLabel={justAdded ? 'ADDED' : 'ADD TO BAG'}
                className="min-w-[230px]"
              >
                {justAdded ? (
                  <>
                    <Check className="h-4 w-4 text-[#d4724e]" />
                    Added to Bag
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add to Bag — ${finalPrice}
                  </>
                )}
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
