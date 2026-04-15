import { Link } from "@tanstack/react-router";
import { Phone, Calendar } from "lucide-react";
import { getCallLink } from "@/lib/whatsapp";

export function MobileCTABar() {
  return (
    <div className="fixed bottom-4 left-3 right-3 z-50 md:hidden bg-navy/90 backdrop-blur-lg py-1.5 px-2 flex gap-2 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
      <a
        href={getCallLink()}
        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gold text-gold-foreground font-semibold text-xs"
      >
        <Phone className="w-3.5 h-3.5" /> Call
      </a>
      <Link
        to="/book-appointment"
        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-cta text-cta-foreground font-semibold text-xs"
      >
        <Calendar className="w-3.5 h-3.5" /> Book Now
      </Link>
    </div>
  );
}
