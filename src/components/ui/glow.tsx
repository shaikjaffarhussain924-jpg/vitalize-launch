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
      <div className="pointer-events-none absolute -inset-[10px] opacity-50 mix-blend-multiply [background-image:radial-gradient(at_51%_52%,oklch(0.62_0.10_65)_0px,transparent_50%),radial-gradient(at_80%_0%,oklch(0.48_0.08_55)_0px,transparent_50%),radial-gradient(at_0%_95%,oklch(0.55_0.12_60)_0px,transparent_50%),radial-gradient(at_0%_20%,oklch(0.50_0.09_50)_0px,transparent_50%),radial-gradient(at_30%_82%,oklch(0.58_0.10_65)_0px,transparent_50%)] blur-[80px]" />
    </div>
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
    >
      <div className="pointer-events-none absolute -inset-[10px] opacity-30 mix-blend-multiply [background-image:radial-gradient(at_51%_52%,oklch(0.62_0.10_65)_0px,transparent_50%),radial-gradient(at_80%_0%,oklch(0.48_0.08_55)_0px,transparent_50%),radial-gradient(at_0%_95%,oklch(0.55_0.12_60)_0px,transparent_50%)] blur-[120px]" />
    </div>
  </div>
));
Glow.displayName = "Glow";

export { Glow };
