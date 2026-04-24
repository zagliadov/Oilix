import Image from "next/image";
import { getTranslations } from "next-intl/server";

/**
 * Hero column: expert photo + caption. To hide, comment out
 * `<LandingHeroExpertPhoto />` in `landing-hero.tsx`.
 */
export const LandingHeroExpertPhoto = async () => {
  const landingTranslations = await getTranslations("Landing");

  return (
    <div className="min-w-0 lg:col-span-5">
      <figure className="mx-auto w-full max-w-md lg:ml-auto lg:max-w-lg xl:max-w-xl">
        <div className="relative overflow-hidden rounded-2xl bg-card/20">
          <div className="relative isolate aspect-[3/4] w-full sm:mx-auto sm:max-w-md lg:max-w-none">
            <Image
              src="/landing/maslo%202.png"
              alt={landingTranslations("hero.expertImageAlt")}
              fill
              priority
              className="z-0 object-contain object-top"
              sizes="(max-width: 1023px) min(100vw, 28rem), (max-width: 1280px) 36vw, 28rem"
              quality={100}
            />
            <div
              className="hero-expert-photo-vignette pointer-events-none absolute inset-0 z-10 rounded-2xl"
              aria-hidden
            />
          </div>
        </div>
        <figcaption className="mt-5 w-full text-center text-lg font-medium leading-snug text-foreground/90 sm:text-xl sm:leading-snug">
          {landingTranslations("hero.expertCaption")}
        </figcaption>
      </figure>
    </div>
  );
};
