import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import glacierImg from '../assets/editorial-glacier.jpg';
import collectionImg from '../assets/editorial-collection.jpg';
import macroImg from '../assets/editorial-macro.jpg';

gsap.registerPlugin(ScrollTrigger);

const PLATES = [
  {
    code: '01',
    location: 'REYKJANES, ICELAND',
    title: 'Tested in freezing coastal wind on wet basalt stone.',
    image: glacierImg,
  },
  {
    code: '02',
    location: 'GOTHENBURG STUDIO',
    title: 'Three mineral finishes made for everyday rituals.',
    image: collectionImg,
  },
  {
    code: '03',
    location: 'GOTHENBURG WORKSHOP · DETAIL',
    title: '0.4mm precision threads crafted for a silent seal.',
    image: macroImg,
  },
];

export function LookbookSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getScrollAmount = () =>
        -Math.max(0, track.scrollWidth - window.innerWidth + (window.innerWidth < 768 ? 24 : 96));

      gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.abs(getScrollAmount()) + 400}`,
          pin: true,
          scrub: 0.85,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="lookbook"
      ref={sectionRef}
      className="relative z-30 flex min-h-[100dvh] w-full flex-col justify-center overflow-hidden bg-[#09090b] pt-20 pb-10 text-[#f4f1ea] md:py-20"
    >
      <div className="mx-auto mb-6 flex w-full max-w-[1600px] items-end justify-between px-5 sm:px-8 md:mb-10 md:px-12">
        <div>
          <span className="font-mono-tech text-[11px] tracking-[0.22em] text-[#d4724e] uppercase">
            Field Journal
          </span>
          <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight uppercase sm:text-3xl md:mt-2 md:text-5xl">
            Made to travel.
          </h2>
        </div>
        <span className="hidden font-mono-tech text-[11px] tracking-[0.2em] text-[#f4f1ea]/45 uppercase md:inline-block">
          Scroll to browse stories →
        </span>
      </div>

      {/* Horizontal Scrubbed Track */}
      <div ref={trackRef} className="flex w-max items-stretch gap-5 px-5 sm:gap-8 sm:px-8 md:gap-12 md:px-12">
        {PLATES.map((plate) => (
          <article
            key={plate.code}
            data-cursor="PLATE"
            className="group relative flex w-[85vw] flex-col justify-between overflow-hidden rounded-2xl border border-[#f4f1ea]/12 bg-[#121216] sm:rounded-3xl md:w-[58vw] lg:w-[46vw]"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <img
                src={plate.image}
                alt={plate.title}
                className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent opacity-70" />
            </div>

            <div className="flex flex-col gap-1.5 p-5 sm:gap-2 sm:p-7 md:p-9">
              <div className="flex items-center justify-between gap-2 font-mono-tech text-[9px] tracking-[0.18em] text-[#f4f1ea]/50 uppercase sm:text-[10px]">
                <span>{plate.code}</span>
                <span className="truncate">{plate.location}</span>
              </div>
              <h3 className="font-serif-editorial text-xl italic text-[#f4f1ea] sm:text-2xl md:text-3xl">
                {plate.title}
              </h3>
            </div>
          </article>
        ))}

        {/* Closing Typographic Statement Plate */}
        <article className="flex w-[85vw] flex-col justify-between rounded-2xl border border-[#d4724e]/30 bg-gradient-to-br from-[#171413] to-[#09090b] p-7 sm:rounded-3xl sm:p-10 md:w-[40vw] md:p-14">
          <span className="font-mono-tech text-[11px] tracking-[0.22em] text-[#d4724e] uppercase">
            Our Promise
          </span>

          <div>
            <h3 className="font-display text-4xl leading-[0.95] font-extrabold tracking-tight uppercase md:text-6xl">
              Built for
              <span className="block font-serif-editorial font-normal italic text-[#d4724e] lowercase">
                ten thousand
              </span>
              mornings.
            </h3>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#f4f1ea]/65">
              Single-use bottles shouldn&apos;t exist. KALD 01 is guaranteed for
              life—with replaceable seals, modular caps, and timeless stainless steel.
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-[#f4f1ea]/12 pt-5 font-mono-tech text-[10px] tracking-[0.22em] text-[#f4f1ea]/50 uppercase">
            <span>Every Part Replaceable</span>
            <span>BPA &amp; PFAS Free</span>
          </div>
        </article>
      </div>
    </section>
  );
}
