import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface DestinationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  title: string;
  subtitle?: string;
  stats?: string;
  href?: string;
  themeColor?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const DestinationCard = React.forwardRef<HTMLDivElement, DestinationCardProps>(
  ({ className, imageUrl, title, subtitle, stats, href, themeColor = "30 50% 25%", icon, children, ...props }, ref) => {
    const Wrapper = href ? "a" : "div";
    return (
      <div
        ref={ref}
        style={{ "--theme-color": themeColor } as React.CSSProperties}
        className={cn("group w-full h-full", className)}
        {...props}
      >
        <Wrapper
          {...(href ? { href } : {})}
          className="relative flex flex-col justify-end overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer shadow-lg"
        >
          {/* Background Image with Parallax Zoom */}
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out will-change-transform group-hover:scale-110"
          />

          {/* Themed Gradient Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--theme-color)/0.95)] via-[hsl(var(--theme-color)/0.4)] to-transparent"
          />

          {/* Content */}
          <div className="relative z-10 p-6 flex flex-col gap-2">
            {icon && (
              <div className="w-10 h-10 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center text-white mb-1">
                {icon}
              </div>
            )}

            <h3 className="text-xl font-heading font-bold text-white leading-tight">
              {title}
            </h3>

            {subtitle && (
              <p className="text-sm text-white/80">{subtitle}</p>
            )}

            {stats && (
              <p className="text-xs text-white/60 font-medium tracking-wide">{stats}</p>
            )}

            {children}

            {/* Explore Button */}
            <div className="flex items-center gap-2 mt-2 text-sm font-medium text-white/90 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              Explore Now
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </Wrapper>
      </div>
    );
  }
);
DestinationCard.displayName = "DestinationCard";

export { DestinationCard };
export type { DestinationCardProps };
