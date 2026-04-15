import React, { useState } from 'react';
import { cn } from '@/lib/utils';

type AccordionItemData = {
  id: number;
  title: string;
  imageUrl: string;
};

const AccordionItemPanel = ({
  item,
  isActive,
  onMouseEnter,
}: {
  item: AccordionItemData;
  isActive: boolean;
  onMouseEnter: () => void;
}) => {
  return (
    <div
      onMouseEnter={onMouseEnter}
      className={cn(
        'relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 ease-in-out',
        'h-[120px] sm:h-[350px] md:h-[450px]',
        isActive ? 'flex-[4] h-[250px] sm:h-[350px]' : 'flex-[0.8]'
      )}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).onerror = null;
          (e.target as HTMLImageElement).src =
            'https://placehold.co/400x450/2d3748/ffffff?text=Image+Error';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 p-4 md:p-6 transition-all duration-500',
          isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}
      >
        <span className="text-white font-heading text-lg md:text-xl font-semibold drop-shadow-lg">
          {item.title}
        </span>
      </div>
    </div>
  );
};

export function InteractiveImageAccordion({
  items,
  heading,
  description,
  ctaText,
  ctaHref,
  defaultActive = 0,
}: {
  items?: AccordionItemData[];
  heading?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  defaultActive?: number;
}) {
  const data = items || defaultItems;
  const [activeIndex, setActiveIndex] = useState(defaultActive);

  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3">
          {heading ? '' : 'Experience'}
        </p>
        <h2 className="font-heading text-3xl md:text-[2.75rem] font-bold text-navy leading-tight">
          {heading || 'World-Class Care, One Clinic'}
        </h2>
        <p className="text-muted-foreground mt-5 leading-relaxed text-lg">
          {description ||
            'From consultation to recovery, experience seamless healthcare with our expert team and modern facilities.'}
        </p>
        {ctaText && ctaHref && (
          <div className="mt-8">
            <a
              href={ctaHref}
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-gold-foreground font-semibold px-8 py-4 rounded-full shadow-[0_6px_24px_-6px_oklch(0.62_0.10_65/0.5)] transition-all duration-300 hover:scale-[1.02]"
            >
              {ctaText}
            </a>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
        {data.map((item, index) => (
          <AccordionItemPanel
            key={item.id}
            item={item}
            isActive={activeIndex === index}
            onMouseEnter={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

const defaultItems: AccordionItemData[] = [
  {
    id: 1,
    title: 'Expert Consultation',
    imageUrl:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=450&fit=crop&q=75&fm=webp',
  },
  {
    id: 2,
    title: 'Advanced Diagnostics',
    imageUrl:
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&h=450&fit=crop&q=75&fm=webp',
  },
  {
    id: 3,
    title: 'Surgical Excellence',
    imageUrl:
      'https://images.unsplash.com/photo-1551190822-a9ce113ac100?w=600&h=450&fit=crop&q=75&fm=webp',
  },
  {
    id: 4,
    title: 'Patient Recovery',
    imageUrl:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&h=450&fit=crop&q=75&fm=webp',
  },
  {
    id: 5,
    title: 'Modern Facilities',
    imageUrl:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=450&fit=crop&q=75&fm=webp',
  },
];
