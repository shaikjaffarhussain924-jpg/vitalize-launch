import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const glowVariants = cva("absolute w-full", {
  variants: {
    variant: {
      top: "top-0",
      above: "-top-[128px]",
      bottom: "bottom-0",
      below: "-bottom-[128px]",
      center: "top-[50%]",
    },
  },
  defaultVariants: {
    variant: "top",
  },
});

const Glow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof glowVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(glowVariants({ variant }), className)}
    {...props}
  >
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
    >
      <div className="pointer-events-none absolute -inset-[10px] opacity-50 mix-blend-multiply [background-image:radial-gradient(at_51%_52%,oklch(0.30_0.06_55)_0px,transparent_50%),radial-gradient(at_80%_0%,oklch(0.25_0.05_50)_0px,transparent_50%),radial-gradient(at_0%_95%,oklch(0.28_0.07_58)_0px,transparent_50%),radial-gradient(at_0%_20%,oklch(0.22_0.04_48)_0px,transparent_50%),radial-gradient(at_30%_82%,oklch(0.32_0.06_55)_0px,transparent_50%)] blur-[80px]" />
    </div>
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
    >
      <div className="pointer-events-none absolute -inset-[10px] opacity-30 mix-blend-multiply [background-image:radial-gradient(at_51%_52%,oklch(0.30_0.06_55)_0px,transparent_50%),radial-gradient(at_80%_0%,oklch(0.25_0.05_50)_0px,transparent_50%),radial-gradient(at_0%_95%,oklch(0.28_0.07_58)_0px,transparent_50%)] blur-[120px]" />
    </div>
  </div>
));
Glow.displayName = "Glow";

export { Glow };
