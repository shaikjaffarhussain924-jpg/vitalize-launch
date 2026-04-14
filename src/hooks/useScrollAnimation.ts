import { useEffect, useRef, useState } from "react";

export function useScrollAnimation(threshold: number = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true); // Default visible for SSR
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // On client mount, hide element to prepare for animation
    // but only if it hasn't been observed yet
    setIsVisible(false);
    
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasAnimated(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
