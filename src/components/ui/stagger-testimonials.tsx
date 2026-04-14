"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StaggerTestimonial {
  tempId: number;
  testimonial: string;
  by: string;
  imgSrc: string;
}

interface TestimonialCardProps {
  position: number;
  testimonial: StaggerTestimonial;
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  handleMove,
  cardSize,
}) => {
  const isCenter = position === 0;

  return (
    <div
      key={testimonial.tempId}
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out rounded-2xl",
        isCenter
          ? "z-10 bg-navy text-navy-foreground border-gold/30"
          : "z-0 bg-card text-card-foreground border-border hover:border-gold/40"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter
          ? "0px 8px 0px 4px oklch(0.62 0.10 65 / 0.3)"
          : "0px 0px 0px 0px transparent",
      }}
    >
      <img
        src={testimonial.imgSrc}
        alt={testimonial.by}
        className="mb-4 h-12 w-12 rounded-full object-cover border-2 border-gold/30"
      />
      <p
        className={cn(
          "text-base italic leading-relaxed",
          isCenter ? "text-navy-foreground/90" : "text-foreground/80"
        )}
      >
        &ldquo;{testimonial.testimonial}&rdquo;
      </p>
      <p
        className={cn(
          "mt-4 text-sm font-semibold",
          isCenter ? "text-gold" : "text-muted-foreground"
        )}
      >
        — {testimonial.by}
      </p>
    </div>
  );
};

export function StaggerTestimonials({
  testimonials,
}: {
  testimonials?: StaggerTestimonial[];
}) {
  const data = testimonials || defaultTestimonials;
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(data);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="relative h-[450px] sm:h-[450px] w-full overflow-hidden hidden sm:block">
      {/* Desktop: stagger layout */}
      {testimonialsList.map((testimonial, index) => {
        const position =
          testimonialsList.length % 2
            ? index - (testimonialsList.length + 1) / 2
            : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            position={position}
            testimonial={testimonial}
            handleMove={handleMove}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-4">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
            "bg-card border-2 border-border hover:bg-gold hover:text-gold-foreground hover:border-gold"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
            "bg-card border-2 border-border hover:bg-gold hover:text-gold-foreground hover:border-gold"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

const defaultTestimonials: StaggerTestimonial[] = [
  { tempId: 0, testimonial: "The doctors here truly care about your wellbeing. My knee surgery went flawlessly and recovery was quick.", by: "Suresh B., Orthopedics Patient", imgSrc: "https://i.pravatar.cc/150?img=11" },
  { tempId: 1, testimonial: "I was nervous about my heart procedure, but the cardiology team made me feel completely safe. Forever grateful!", by: "Ramesh R., Cardiology Patient", imgSrc: "https://i.pravatar.cc/150?img=12" },
  { tempId: 2, testimonial: "Best dermatology clinic in Hyderabad. My skin has never looked better after their treatment plan.", by: "Arun M., Dermatology Patient", imgSrc: "https://i.pravatar.cc/150?img=13" },
  { tempId: 3, testimonial: "From consultation to surgery, everything was seamless. The staff is incredibly professional and kind.", by: "Ravi K., General Surgery", imgSrc: "https://i.pravatar.cc/150?img=3" },
  { tempId: 4, testimonial: "My entire family trusts HealthFirst for all our medical needs. Affordable and world-class care.", by: "Vikram S., Family Care", imgSrc: "https://i.pravatar.cc/150?img=14" },
  { tempId: 5, testimonial: "The eye care department restored my vision perfectly. I can see clearly for the first time in years!", by: "Mohammed A., Ophthalmology", imgSrc: "https://i.pravatar.cc/150?img=7" },
  { tempId: 6, testimonial: "Brought my father here for a hip replacement. The care he received was exceptional — like family.", by: "Deepak V., Orthopedics", imgSrc: "https://i.pravatar.cc/150?img=4" },
  { tempId: 7, testimonial: "I've been to many clinics, but HealthFirst stands out. Clean, modern, and the doctors listen.", by: "Karthik N., General Medicine", imgSrc: "https://i.pravatar.cc/150?img=15" },
];
