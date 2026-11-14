import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ThermalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const kaldPathRef = useRef<SVGPathElement>(null);
  const standardPathRef = useRef<SVGPathElement>(null);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  // Ambient thermal particle simulation (ice crystals -> calm stillness -> rising embers)
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * Math.min(window.devicePixelRatio, 2);
      canvas.height = canvas.offsetHeight * Math.min(window.devicePixelRatio, 2);
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 56 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: 1.2 + Math.random() * 2.4,
      speed: 0.0006 + Math.random() * 0.0014,
      drift: (Math.random() - 0.5) * 0.0006,
      alpha: 0.15 + Math.random() * 0.45,
    }));

    let rafId = 0;
    const render = () => {
      const p = progressRef.current;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // -1 at cold, 0 at neutral, +1 at hot
      const thermalDir = p * 2 - 1;
      const color =
        p < 0.35
          ? '158, 197, 223'
          : p < 0.6
            ? '244, 241, 234'
            : '212, 114, 78';

      for (const pt of particles) {
        // Cold drifts gently down, hot rises cleanly up
        pt.y -= thermalDir * pt.speed * 1.4;
        pt.x += pt.drift + Math.sin(pt.y * 10) * 0.0002;

        if (pt.y < -0.05) pt.y = 1.05;
        if (pt.y > 1.05) pt.y = -0.05;
        if (pt.x < -0.05) pt.x = 1.05;
        if (pt.x > 1.05) pt.x = -0.05;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${color}, ${pt.alpha})`;
        ctx.arc(pt.x * w, pt.y * h, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const kaldLen = kaldPathRef.current?.getTotalLength() ?? 600;
    const stdLen = standardPathRef.current?.getTotalLength() ?? 600;

    if (kaldPathRef.current) {
      kaldPathRef.current.style.strokeDasharray = `${kaldLen}`;
      kaldPathRef.current.style.strokeDashoffset = `${kaldLen}`;
    }
    if (standardPathRef.current) {
      standardPathRef.current.style.strokeDasharray = `${stdLen}`;
      standardPathRef.current.style.strokeDashoffset = `${stdLen}`;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=1900',
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;
          setProgress(p);

          if (kaldPathRef.current) {
            kaldPathRef.current.style.strokeDashoffset = `${kaldLen * (1 - p)}`;
          }
          if (standardPathRef.current) {
            standardPathRef.current.style.strokeDashoffset = `${stdLen * (1 - p)}`;
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const currentTemp = (-18.4 + progress * 114.6).toFixed(1);
  const isHot = Number(currentTemp) >= 20;
  const isNeutral = Number(currentTemp) > -2 && Number(currentTemp) < 20;

  const phaseLabel = isHot
    ? 'Piping Hot'
    : isNeutral
      ? 'Ambient Hold'
      : 'Glacial Cold';

  const glowColor = isHot
    ? 'rgba(212, 114, 78, 0.25)'
    : isNeutral
      ? 'rgba(228, 223, 213, 0.14)'
      : 'rgba(127, 168, 196, 0.25)';

  return (
    <section
      id="thermal"
      ref={sectionRef}
      className="relative z-30 flex min-h-[100dvh] w-full items-center overflow-hidden bg-[#09090b] px-5 pt-20 pb-8 text-[#f4f1ea] sm:px-8 md:px-12 lg:py-24"
    >
      {/* Live thermal particle canvas */}
      <canvas
        ref={particleCanvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* Dynamic scrubbed temperature glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px] transition-colors duration-500 lg:h-[680px] lg:w-[680px] lg:blur-[160px]"
        style={{ backgroundColor: glowColor }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-12">
        {/* Left: Giant Tabular Temperature Readout */}
        <div className="flex flex-col gap-3 sm:gap-5 lg:col-span-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono-tech text-[10px] tracking-[0.2em] text-[#d4724e] uppercase sm:text-[11px]">
              Temperature Retention
            </span>
            <span className="h-[1px] w-8 bg-[#f4f1ea]/20 sm:w-12" />
            <span className="font-mono-tech text-[10px] tracking-[0.16em] text-[#f4f1ea]/60 uppercase sm:text-[11px]">
              {phaseLabel}
            </span>
          </div>

          <div className="relative">
            <span
              className="text-[clamp(3.1rem,9vw,8.4rem)] leading-[0.88] font-semibold tracking-[-0.04em] tabular-nums transition-colors duration-300"
              style={{
                color: isHot ? '#e88b68' : isNeutral ? '#f4f1ea' : '#9ec5df',
              }}
            >
              {Number(currentTemp) > 0 ? `+${currentTemp}` : currentTemp}°C
            </span>
          </div>

          <h2 className="font-serif-editorial text-xl leading-snug italic text-[#f4f1ea]/85 sm:text-3xl md:text-4xl">
            Exterior ambient shifts wildly.
            <span className="block not-italic font-display text-lg font-bold tracking-tight text-[#f4f1ea] uppercase sm:text-2xl md:text-3xl">
              The core refuses to flinch.
            </span>
          </h2>

          <p className="max-w-lg text-xs leading-relaxed text-[#f4f1ea]/65 sm:text-sm md:text-base">
            Tested in chamber conditions from -20°C Svalbard winds to +45°C desert noon.
            The copper radiation barrier eliminates heat exchange while the vacuum wall
            locks in temperature.
          </p>

          <div className="mt-1 max-w-md">
            <div className="mb-1.5 flex justify-between font-mono-tech text-[9px] tracking-[0.18em] text-[#f4f1ea]/50 uppercase sm:text-[10px]">
              <span>-18.4°C ICE (36H)</span>
              <span>+96.2°C BOIL (18H)</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f4f1ea]/12">
              <div
                className="h-full rounded-full transition-colors duration-300"
                style={{
                  width: `${Math.max(4, progress * 100)}%`,
                  background: 'linear-gradient(90deg, #8ab7d6 0%, #f4f1ea 50%, #d4724e 100%)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Right: Live Scroll-Drawn Thermal Retention Curve */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl border border-[#f4f1ea]/12 bg-[#111115]/85 p-4 backdrop-blur-xl sm:rounded-3xl sm:p-6 md:p-10">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 sm:mb-6">
              <div>
                <span className="block font-mono-tech text-[9px] tracking-[0.2em] text-[#f4f1ea]/50 uppercase sm:text-[10px]">
                  36-Hour Temperature Test
                </span>
                <h3 className="mt-0.5 font-display text-base font-bold uppercase sm:mt-1 sm:text-xl">
                  Inside vs. Outside
                </h3>
              </div>
              <div className="flex items-center gap-4 font-mono-tech text-[9px] tracking-[0.16em] uppercase sm:text-[10px]">
                <span className="flex items-center gap-1.5 text-[#f4f1ea]">
                  <span className="h-2 w-2 rounded-full bg-[#d4724e]" />
                  KALD 01
                </span>
                <span className="flex items-center gap-1.5 text-[#f4f1ea]/45">
                  <span className="h-2 w-2 rounded-full bg-[#f4f1ea]/35" />
                  SINGLE-WALL
                </span>
              </div>
            </div>

            <svg viewBox="0 0 560 270" className="max-h-[145px] w-full overflow-visible sm:max-h-[210px] lg:max-h-none">
              {[40, 100, 160, 220].map((y) => (
                <line
                  key={y}
                  x1="36"
                  y1={y}
                  x2="540"
                  y2={y}
                  stroke="rgba(244,241,234,0.08)"
                  strokeDasharray="4 4"
                />
              ))}

              <text x="0" y="44" fill="rgba(244,241,234,0.45)" fontSize="10" fontFamily="JetBrains Mono">
                95°
              </text>
              <text x="0" y="104" fill="rgba(244,241,234,0.45)" fontSize="10" fontFamily="JetBrains Mono">
                65°
              </text>
              <text x="0" y="164" fill="rgba(244,241,234,0.45)" fontSize="10" fontFamily="JetBrains Mono">
                35°
              </text>
              <text x="0" y="224" fill="rgba(244,241,234,0.45)" fontSize="10" fontFamily="JetBrains Mono">
                20°
              </text>

              <path
                ref={standardPathRef}
                d="M 40 42 C 110 140, 190 205, 535 222"
                fill="none"
                stroke="rgba(244,241,234,0.28)"
                strokeWidth="2"
                strokeDasharray="6 6"
              />

              <path
                ref={kaldPathRef}
                d="M 40 42 C 170 46, 360 58, 535 84"
                fill="none"
                stroke="#d4724e"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              <text x="40" y="256" fill="rgba(244,241,234,0.45)" fontSize="10" fontFamily="JetBrains Mono">
                00H
              </text>
              <text x="200" y="256" fill="rgba(244,241,234,0.45)" fontSize="10" fontFamily="JetBrains Mono">
                12H
              </text>
              <text x="360" y="256" fill="rgba(244,241,234,0.45)" fontSize="10" fontFamily="JetBrains Mono">
                24H
              </text>
              <text x="515" y="256" fill="rgba(244,241,234,0.45)" fontSize="10" fontFamily="JetBrains Mono">
                36H
              </text>
            </svg>

            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-[#f4f1ea]/10 pt-5">
              <div>
                <span className="block font-mono-tech text-[10px] tracking-[0.18em] text-[#f4f1ea]/45 uppercase">
                  AVG. HEAT LOSS
                </span>
                <span className="mt-1 block font-display text-lg font-bold text-[#d4724e]">
                  0.8°C / hr
                </span>
              </div>
              <div>
                <span className="block font-mono-tech text-[10px] tracking-[0.18em] text-[#f4f1ea]/45 uppercase">
                  DOUBLE WALL
                </span>
                <span className="mt-1 block font-display text-lg font-bold">
                  0.5 mm
                </span>
              </div>
              <div>
                <span className="block font-mono-tech text-[10px] tracking-[0.18em] text-[#f4f1ea]/45 uppercase">
                  CONDENSATION
                </span>
                <span className="mt-1 block font-display text-lg font-bold">
                  None
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
