import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const obj = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        if (!containerRef.current) {
          onComplete();
          return;
        }
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 0.72,
          ease: 'power4.inOut',
          onComplete,
        });
      },
    });

    tl.to(obj, {
      value: 100,
      duration: 0.95,
      ease: 'power3.inOut',
      onUpdate: () => {
        const current = Math.round(obj.value);
        setCount(current);
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${obj.value / 100})`;
        }
      },
    }).to({}, { duration: 0.1 });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      data-preloader
      className="fixed inset-0 z-[1000] flex flex-col justify-between bg-[#09090b] px-6 py-8 text-[#f4f1ea] md:px-12 md:py-10"
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-sm font-bold tracking-[0.25em] uppercase">
          KALD®
        </span>
        <span className="font-mono-tech text-[11px] tracking-[0.2em] text-[#f4f1ea]/50 uppercase">
          Nordic Thermal Craft
        </span>
      </div>

      <div className="flex flex-col items-start gap-6">
        <div className="flex w-full items-baseline justify-between">
          <span className="font-serif-editorial text-2xl italic text-[#f4f1ea]/65 md:text-4xl">
            Engineered for extreme stillness.
          </span>
          <span className="font-mono-tech text-5xl font-light tracking-tighter tabular-nums md:text-8xl">
            {String(count).padStart(3, '0')}
          </span>
        </div>
        <div className="h-[1px] w-full overflow-hidden bg-[#f4f1ea]/15">
          <div
            ref={progressBarRef}
            className="h-full w-full origin-left scale-x-0 bg-[#d4724e]"
          />
        </div>
      </div>

      <div className="flex items-center justify-between font-mono-tech text-[10px] tracking-[0.22em] text-[#f4f1ea]/40 uppercase">
        <span>Gothenburg, Sweden</span>
        <span>18/8 Surgical Steel</span>
      </div>
    </div>
  );
}
