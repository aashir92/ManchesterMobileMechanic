/**
 * Generic infinite horizontal image strip. Lives under `components/ui/` for shadcn-style colocation.
 * Optional: run `npx shadcn@latest init` if you want the full shadcn CLI + `components.json` toolchain;
 * this component does not depend on Radix or shadcn primitives.
 */
import { HERO_SLIDER_IMAGES } from "@/lib/data/defaults";

export type HeroImageAutoSliderProps = {
  /** Image URLs (e.g. workshop / service photography). Defaults to `HERO_SLIDER_IMAGES`. */
  images?: string[];
  className?: string;
};

export function HeroImageAutoSlider({
  images = HERO_SLIDER_IMAGES,
  className = "",
}: HeroImageAutoSliderProps) {
  const list = images.length > 0 ? images : HERO_SLIDER_IMAGES;
  const duplicated = [...list, ...list];

  return (
    <div
      className={`hero-image-slider-root relative h-full min-h-[240px] w-full overflow-hidden ${className}`.trim()}
      aria-hidden
    >
      <div className="hero-slider-mask flex h-full w-full items-center justify-center py-6 md:py-10">
        <div className="hero-slider-track flex w-max gap-4 md:gap-6">
          {duplicated.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="hero-slider-item h-44 w-44 shrink-0 overflow-hidden rounded-xl shadow-2xl md:h-56 md:w-56 lg:h-72 lg:w-72"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
