import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import glacierImg from '../assets/editorial-glacier.jpg';
import collectionImg from '../assets/editorial-collection.jpg';
import macroImg from '../assets/editorial-macro.jpg';

gsap.registerPlugin(ScrollTrigger);

const PLATES = [
  {
    code: 'PLATE 01',
    location: 'REYKJANES BASALT RIDGE, 63.8°N',
    title: 'Sub-zero field trials on wet volcanic stone.',
    image: glacierImg,
  },
  {
    code: 'PLATE 02',
    location: 'GOTHENBURG ARCHITECTURAL STUDIO',
    title: 'Three mineral coats calibrated for daily rituals.',
    image: collectionImg,
  },
  {
    code: 'PLATE 03',
    location: 'CNC THREAD & COPPER SEAL MACRO',
    title: '0.4mm pitch threads engineered for silent closure.',
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
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 96);

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
      className="relative z-30 flex min-h-screen w-full flex-col justify-center overflow-hidden bg-[#09090b] py-20 text-[#f4f1ea]"
    >
      <div className="mx-auto mb-10 flex w-full max-w-[1600px] items-end justify-between px-6 md:px-12">
        <div>
          <span className="font-mono-tech text-[11px] tracking-[0.22em] text-[#d4724e] uppercase">
            05 / FIELD MONOGRAPH
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight uppercase md:text-5xl">
            Objects in the wild.
          </h2>
        </div>
        <span className="hidden font-mono-tech text-[11px] tracking-[0.2em] text-[#f4f1ea]/45 uppercase md:inline-block">
          HORIZONTAL GALLERY · SCROLL TO ADVANCE →
        </span>
      </div>

      {/* Horizontal Scrubbed Track */}
      <div ref={trackRef} className="flex w-max items-stretch gap-8 px-6 md:gap-12 md:px-12">
        {PLATES.map((plate) => (
          <article
            key={plate.code}
            data-cursor="PLATE"
            className="group relative flex w-[84vw] flex-col justify-between overflow-hidden rounded-3xl border border-[#f4f1ea]/12 bg-[#121216] md:w-[58vw] lg:w-[46vw]"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <img
                src={plate.image}
                alt={plate.title}
                className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent opacity-70" />
            </div>

            <div className="flex flex-col gap-2 p-7 md:p-9">
              <div className="flex items-center justify-between font-mono-tech text-[10px] tracking-[0.22em] text-[#f4f1ea]/50 uppercase">
                <span>{plate.code}</span>
                <span>{plate.location}</span>
              </div>
              <h3 className="font-serif-editorial text-2xl italic text-[#f4f1ea] md:text-3xl">
                {plate.title}
              </h3>
            </div>
          </article>
        ))}

        {/* Closing Typographic Statement Plate */}
        <article className="flex w-[80vw] flex-col justify-between rounded-3xl border border-[#d4724e]/30 bg-gradient-to-br from-[#171413] to-[#09090b] p-10 md:w-[40vw] md:p-14">
          <span className="font-mono-tech text-[11px] tracking-[0.22em] text-[#d4724e] uppercase">
            MANIFESTO · 001
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
              Disposable vessels clutter the planet. KALD 01 is guaranteed against
              vacuum loss for life—repairable gasket, replaceable cap, immortal steel.
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-[#f4f1ea]/12 pt-5 font-mono-tech text-[10px] tracking-[0.22em] text-[#f4f1ea]/50 uppercase">
            <span>REPAIRABILITY SCORE: 10/10</span>
            <span>ZERO BPA · ZERO PFAS</span>
          </div>
        </article>
      </div>
    </section>
  );
}
