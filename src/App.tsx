import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FLASK_EDITIONS,
  FLASK_SIZES,
  type FlaskEdition,
  type FlaskSize,
} from './data/products';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import {
  FlaskCanvas,
  type FlaskChoreographyState,
} from './components/FlaskCanvas';
import { HeroSection } from './components/HeroSection';
import { MarqueeStrip } from './components/MarqueeStrip';
import { AnatomySection } from './components/AnatomySection';
import { ThermalSection } from './components/ThermalSection';
import { CollectionSection } from './components/CollectionSection';
import { LookbookSection } from './components/LookbookSection';
import { SpecsAndFooter } from './components/SpecsAndFooter';
import { CartDrawer, type CartItem } from './components/CartDrawer';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState<FlaskEdition>(
    FLASK_EDITIONS[0]
  );
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState('KALD 01');

  const choreographyRef = useRef<FlaskChoreographyState>({
    explodeProgress: 0,
    stageShift: 0,
    visibility: 1,
  });

  // Sync Lenis smooth scroll with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', (e: { progress: number }) => {
      ScrollTrigger.update();
      setScrollProgress(e.progress ?? 0);
    });

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Chapter tracker triggers
    const chapters = [
      { id: 'hero', label: 'KALD 01' },
      { id: 'anatomy', label: 'The Craft' },
      { id: 'thermal', label: 'Performance' },
      { id: 'editions', label: 'Finishes' },
      { id: 'lookbook', label: 'Journal' },
    ];

    const triggers = chapters.map((ch) =>
      ScrollTrigger.create({
        trigger: `#${ch.id}`,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActiveChapter(ch.label),
        onEnterBack: () => setActiveChapter(ch.label),
      })
    );

    return () => {
      triggers.forEach((t) => t.kill());
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  const addToCart = (
    edition: FlaskEdition,
    size: FlaskSize,
    engraving: string
  ) => {
    const unitPrice = edition.basePrice + size.priceDelta;
    const key = `${edition.id}-${size.id}-${engraving || 'NONE'}`;

    setCartItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        { key, edition, size, engraving, unitPrice, quantity: 1 },
      ];
    });
    setCartOpen(true);
  };

  const updateCartQty = (key: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeCartItem = (key: string) => {
    setCartItems((prev) => prev.filter((i) => i.key !== key));
  };

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative min-h-screen bg-[#09090b] text-[#f4f1ea]">
      {/* Film grain atmosphere */}
      <div className="grain-overlay" />

      {!preloaderDone && (
        <Preloader onComplete={() => setPreloaderDone(true)} />
      )}

      <CustomCursor />

      <Navbar
        cartCount={totalCount}
        onOpenCart={() => setCartOpen(true)}
        activeChapter={activeChapter}
        isLightTheme={isLightTheme}
        scrollProgress={scrollProgress}
      />

      {/* Persistent WebGL 3D Flask choreographed across Hero & Exploded Anatomy */}
      <FlaskCanvas edition={selectedEdition} choreographyRef={choreographyRef} />

      <main>
        <HeroSection
          selectedEdition={selectedEdition}
          onSelectEdition={setSelectedEdition}
          onQuickAdd={() => addToCart(selectedEdition, FLASK_SIZES[1], 'K.01')}
          ready={preloaderDone}
        />

        <MarqueeStrip />

        <AnatomySection choreographyRef={choreographyRef} />

        <ThermalSection />

        <CollectionSection
          selectedEdition={selectedEdition}
          onSelectEdition={setSelectedEdition}
          onAddToCart={addToCart}
          onThemeTrigger={setIsLightTheme}
        />

        <LookbookSection />
      </main>

      <SpecsAndFooter
        onReserveClick={() => {
          document.getElementById('editions')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQty={updateCartQty}
        onRemove={removeCartItem}
        onClear={() => setCartItems([])}
      />
    </div>
  );
}

export default App;
