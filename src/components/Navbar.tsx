import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { CLINIC, SERVICES } from "@/lib/constants";
import { getCallLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="hidden md:block bg-navy text-navy-foreground text-sm py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span>🏥 NABH Accredited</span>
            <span>📍 {CLINIC.address}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>🕐 {CLINIC.hours}</span>
            <a href={getCallLink()} className="flex items-center gap-1 text-gold hover:underline">
              <Phone className="w-3 h-3" /> {CLINIC.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 bg-card/95 backdrop-blur-md ${
          scrolled ? "shadow-lg py-2" : "py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center text-navy-foreground font-heading font-bold text-lg">H</div>
            <div>
              <span className="font-heading font-bold text-lg text-navy">{CLINIC.name}</span>
              <span className="hidden lg:block text-xs text-muted-foreground">{CLINIC.tagline}</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-gold transition-colors" activeProps={{ className: "text-gold" }}>Home</Link>
            <Link to="/about" className="text-sm font-medium text-foreground hover:text-gold transition-colors" activeProps={{ className: "text-gold" }}>About</Link>
            <div className="relative group">
              <button className="text-sm font-medium text-foreground hover:text-gold transition-colors flex items-center gap-1">
                Services <ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-card rounded-lg shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                <Link to="/services" className="block px-4 py-2 text-sm hover:bg-accent transition-colors">All Services</Link>
                {SERVICES.map((s) => (
                  <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} className="block px-4 py-2 text-sm hover:bg-accent transition-colors">
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/doctors" className="text-sm font-medium text-foreground hover:text-gold transition-colors" activeProps={{ className: "text-gold" }}>Doctors</Link>
            <Link to="/gallery" className="text-sm font-medium text-foreground hover:text-gold transition-colors" activeProps={{ className: "text-gold" }}>Gallery</Link>
            <Link to="/blog" className="text-sm font-medium text-foreground hover:text-gold transition-colors" activeProps={{ className: "text-gold" }}>Blog</Link>
            <Link to="/contact" className="text-sm font-medium text-foreground hover:text-gold transition-colors" activeProps={{ className: "text-gold" }}>Contact</Link>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a href={getCallLink()} className="md:hidden flex items-center gap-1 text-sm text-navy font-medium">
              <Phone className="w-4 h-4" />
            </a>
            <Link to="/book-appointment">
              <Button className="bg-gold hover:bg-gold/90 text-gold-foreground font-semibold px-5">
                Book Appointment
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t bg-card animate-fade-in">
            <div className="px-4 py-4 space-y-3">
              <Link to="/" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link to="/about" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>About</Link>
              <button className="flex items-center justify-between w-full py-2 text-sm font-medium" onClick={() => setServicesOpen(!servicesOpen)}>
                Services <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              {servicesOpen && (
                <div className="pl-4 space-y-2">
                  <Link to="/services" className="block py-1.5 text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>All Services</Link>
                  {SERVICES.map((s) => (
                    <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} className="block py-1.5 text-sm text-muted-foreground" onClick={() => setMobileOpen(false)}>
                      {s.name}
                    </Link>
                  ))}
                </div>
              )}
              <Link to="/doctors" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Doctors</Link>
              <Link to="/gallery" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Gallery</Link>
              <Link to="/blog" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Blog</Link>
              <Link to="/contact" className="block py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Contact</Link>
              <Link to="/book-appointment" onClick={() => setMobileOpen(false)}>
                <Button className="w-full bg-gold hover:bg-gold/90 text-gold-foreground font-semibold mt-2">Book Appointment</Button>
              </Link>
              <a href={getCallLink()} className="block text-center py-2 text-sm font-medium text-cta">
                📞 Call: {CLINIC.phone}
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
