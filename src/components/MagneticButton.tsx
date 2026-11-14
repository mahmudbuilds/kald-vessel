import { useRef, type ReactNode } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  cursorLabel?: string;
  variant?: 'primary' | 'outline' | 'dark';
}

export function MagneticButton({
  children,
  onClick,
  className = '',
  cursorLabel = 'SELECT',
  variant = 'primary',
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.28;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.28;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const handleMouseLeave = () => {
    const el = btnRef.current;
    if (!el) return;
    el.style.transform = 'translate3d(0px, 0px, 0)';
  };

  const variantClasses =
    variant === 'primary'
      ? 'bg-[#f4f1ea] text-[#09090b] hover:bg-[#d4724e] hover:text-[#09090b]'
      : variant === 'dark'
        ? 'bg-[#09090b] text-[#f4f1ea] hover:bg-[#d4724e] hover:text-[#09090b]'
        : 'border border-current bg-transparent hover:bg-[#f4f1ea] hover:text-[#09090b] hover:border-[#f4f1ea]';

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor={cursorLabel}
      className={`group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-4 text-xs font-semibold tracking-[0.18em] uppercase transition-[transform,background-color,color,border-color] duration-300 ease-out will-change-transform ${variantClasses} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2.5">{children}</span>
    </button>
  );
}
