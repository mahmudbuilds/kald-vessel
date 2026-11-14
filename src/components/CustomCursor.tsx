import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const visibleRef = useRef(false);
  const pressedRef = useRef(false);

  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }

      const target = e.target as HTMLElement | null;
      const cursorTarget = target?.closest('[data-cursor]') as HTMLElement | null;
      const nextLabel = cursorTarget ? cursorTarget.getAttribute('data-cursor') : null;
      setLabel((prev) => (prev === nextLabel ? prev : nextLabel));
    };

    const onMouseDown = () => {
      pressedRef.current = true;
    };
    const onMouseUp = () => {
      pressedRef.current = false;
    };
    const onMouseLeave = () => {
      visibleRef.current = false;
      setIsVisible(false);
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        const scale = pressedRef.current ? 0.86 : 1;
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[999] hidden md:block ${
        label ? '' : 'mix-blend-difference'
      }`}
    >
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 h-2 w-2 rounded-full bg-white transition-opacity duration-200 ${
          label ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 flex items-center justify-center rounded-full border transition-[width,height,background-color,border-color] duration-300 ease-out ${
          label
            ? 'h-10 w-auto min-w-[96px] border-[#f4f1ea]/30 bg-[#f4f1ea] px-4 text-[#09090b] shadow-2xl'
            : 'h-9 w-9 border-white/65 bg-transparent'
        }`}
      >
        {label && (
          <span className="font-mono-tech text-[10px] font-semibold tracking-[0.18em] whitespace-nowrap uppercase">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
