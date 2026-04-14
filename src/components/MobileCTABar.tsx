import { Link } from "@tanstack/react-router";
import { Phone, Calendar } from "lucide-react";
import { getCallLink } from "@/lib/whatsapp";

export function MobileCTABar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-navy py-2 px-3 flex gap-2 shadow-[0_-4px_12px_rgba(0,0,0,0.15)]">
      <a
        href={getCallLink()}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gold text-gold-foreground font-semibold text-sm"
      >
        <Phone className="w-4 h-4" /> Call Now
      </a>
      <Link
        to="/book-appointment"
        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cta text-cta-foreground font-semibold text-sm"
      >
        <Calendar className="w-4 h-4" /> Book Appointment
      </Link>
    </div>
  );
}
