import { ShoppingBag } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  activeChapter: string;
  isLightTheme: boolean;
  scrollProgress: number;
}

export function Navbar({
  cartCount,
  onOpenCart,
  activeChapter,
  isLightTheme,
  scrollProgress,
}: NavbarProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 backdrop-blur-md transition-colors duration-500 ${
        isLightTheme
          ? 'bg-[#f4f1ea]/80 text-[#111113]'
          : 'bg-[#09090b]/68 text-[#f4f1ea]'
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12">
        <button
          type="button"
          onClick={() => scrollToSection('hero')}
          data-cursor="TOP"
          className="flex items-center gap-3 text-left"
        >
          <span className="font-display text-lg font-extrabold tracking-[0.22em] uppercase">
            KALD®
          </span>
          <span
            className={`hidden h-3 w-[1px] lg:inline-block ${
              isLightTheme ? 'bg-[#111113]/25' : 'bg-[#f4f1ea]/25'
            }`}
          />
          <span
            className={`hidden whitespace-nowrap font-mono-tech text-[10px] tracking-[0.2em] uppercase lg:inline-block ${
              isLightTheme ? 'text-[#111113]/60' : 'text-[#f4f1ea]/55'
            }`}
          >
            {activeChapter}
          </span>
        </button>

        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          {[
            { id: 'anatomy', label: 'Craft' },
            { id: 'thermal', label: 'Performance' },
            { id: 'editions', label: 'Shop' },
            { id: 'lookbook', label: 'Journal' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              data-cursor="VIEW"
              className={`whitespace-nowrap font-mono-tech text-[11px] tracking-[0.2em] uppercase transition-opacity hover:opacity-100 ${
                isLightTheme ? 'text-[#111113]/70' : 'text-[#f4f1ea]/65'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={onOpenCart}
          data-cursor="BAG"
          className={`flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border px-4 py-2 backdrop-blur-md transition-all duration-300 ${
            isLightTheme
              ? 'border-[#111113]/20 bg-[#f4f1ea]/75 hover:border-[#111113]'
              : 'border-[#f4f1ea]/20 bg-[#09090b]/60 hover:border-[#d4724e]'
          }`}
        >
          <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
          <span className="whitespace-nowrap font-mono-tech text-[11px] tracking-[0.18em] uppercase">
            Bag ({cartCount})
          </span>
        </button>
      </div>

      {/* Live scroll progress hairline */}
      <div
        className={`h-[1px] w-full ${
          isLightTheme ? 'bg-[#111113]/10' : 'bg-[#f4f1ea]/10'
        }`}
      >
        <div
          className="h-full bg-[#d4724e] transition-[width] duration-75"
          style={{ width: `${Math.min(100, Math.max(0, scrollProgress * 100))}%` }}
        />
      </div>
    </header>
  );
}
