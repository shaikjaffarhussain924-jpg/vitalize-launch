import AutoScroll from "embla-carousel-auto-scroll";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Logo {
  id: string;
  description: string;
  image?: string;
  text?: string;
  className?: string;
}

interface Logos3Props {
  heading?: string;
  logos?: Logo[];
  className?: string;
}

const Logos3 = ({
  heading = "Trusted by these companies",
  logos = [],
}: Logos3Props) => {
  return (
    <section className="py-14 border-y">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-xs uppercase tracking-[0.25em] text-muted-foreground mb-7">
          {heading}
        </p>
      </div>
      <div className="relative mx-auto flex items-center justify-center">
        <Carousel
          opts={{ loop: true }}
          plugins={[AutoScroll({ playOnInit: true, speed: 0.7 })]}
        >
          <CarouselContent className="ml-0">
            {logos.map((logo) => (
              <CarouselItem
                key={logo.id}
                className="basis-1/3 pl-0 md:basis-1/4 lg:basis-1/6"
              >
                <div className="flex items-center justify-center h-16 px-4">
                  {logo.image ? (
                    <img
                      src={logo.image}
                      alt={logo.description}
                      className={logo.className || "h-7 w-auto"}
                    />
                  ) : (
                    <span className="px-5 py-3 rounded-full bg-gold-light text-sm text-navy font-medium tracking-wide whitespace-nowrap">
                      {logo.text || logo.description}
                    </span>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
};

export { Logos3 };
