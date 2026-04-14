import { Link, ChevronRight } from "lucide-react";
import { Link as RouterLink } from "@tanstack/react-router";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-navy-foreground/60 mb-4">
      <RouterLink to="/" className="hover:text-gold transition-colors">Home</RouterLink>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3" />
          {item.to ? (
            <RouterLink to={item.to as any} className="hover:text-gold transition-colors">{item.label}</RouterLink>
          ) : (
            <span className="text-navy-foreground/80">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
