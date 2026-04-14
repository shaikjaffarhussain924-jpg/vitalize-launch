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
      {/* Gold accent line */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Top bar */}
      <div className="hidden md:block bg-navy text-navy-foreground text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-5">
            <span className="tracking-wide text-navy-foreground/80">NABH Accredited</span>
            <span className="text-navy-foreground/20">|</span>
            <span className="tracking-wide text-navy-foreground/80">{CLINIC.address}</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="tracking-wide text-navy-foreground/80">{CLINIC.hours}</span>
            <span className="text-navy-foreground/40">|</span>
            <a href={getCallLink()} className="flex items-center gap-1.5 text-gold hover:text-gold/80 transition-colors font-medium">
              <Phone className="w-3.5 h-3.5" /> {CLINIC.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? "bg-card/98 backdrop-blur-xl shadow-[0_4px_30px_-5px_oklch(0.20_0.045_255/0.08)] py-2"
            : "bg-card/95 backdrop-blur-md py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-navy flex items-center justify-center text-navy-foreground font-heading font-bold text-xl group-hover:bg-gold transition-colors duration-300">H</div>
            <div>
              <span className="font-heading font-bold text-xl text-navy tracking-tight">{CLINIC.name}</span>
              <span className="hidden lg:block text-[11px] text-muted-foreground tracking-wider uppercase mt-0.5">{CLINIC.tagline}</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-7">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
            ].map(({ to, label }) => (
              <Link key={to} to={to} className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors duration-300 tracking-wide" activeProps={{ className: "text-gold" }}>
                {label}
              </Link>
            ))}
            <div className="relative group">
              <button className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors duration-300 flex items-center gap-1.5 tracking-wide">
                Services <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180 duration-300" />
              </button>
              <div className="absolute top-full left-0 mt-3 w-60 bg-card rounded-xl shadow-[0_20px_50px_-12px_oklch(0.20_0.045_255/0.15)] border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2 -translate-y-2 group-hover:translate-y-0">
                <Link to="/services" className="block px-5 py-2.5 text-sm hover:bg-gold-light hover:text-navy transition-colors duration-200">All Services</Link>
                {SERVICES.map((s) => (
                  <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} className="block px-5 py-2.5 text-sm hover:bg-gold-light hover:text-navy transition-colors duration-200">
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
            {[
              { to: "/doctors", label: "Doctors" },
              { to: "/gallery", label: "Gallery" },
              { to: "/blog", label: "Blog" },
              { to: "/contact", label: "Contact" },
            ].map(({ to, label }) => (
              <Link key={to} to={to as any} className="text-sm font-medium text-foreground/80 hover:text-gold transition-colors duration-300 tracking-wide" activeProps={{ className: "text-gold" }}>
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/book-appointment">
              <Button className="bg-gold hover:bg-gold/90 text-gold-foreground font-semibold px-6 rounded-full tracking-wide shadow-[0_4px_15px_-3px_oklch(0.72_0.10_75/0.4)] hover:shadow-[0_6px_20px_-3px_oklch(0.72_0.10_75/0.5)] transition-all duration-300 hover:scale-[1.02]">
                Book Appointment
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t bg-card animate-fade-in">
            <div className="px-4 py-5 space-y-1">
              <Link to="/" className="block py-2.5 px-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link to="/about" className="block py-2.5 px-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors" onClick={() => setMobileOpen(false)}>About</Link>
              <button className="flex items-center justify-between w-full py-2.5 px-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors" onClick={() => setServicesOpen(!servicesOpen)}>
                Services <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              {servicesOpen && (
                <div className="pl-6 space-y-1 py-1">
                  <Link to="/services" className="block py-2 px-3 text-sm text-muted-foreground rounded-lg hover:bg-accent transition-colors" onClick={() => setMobileOpen(false)}>All Services</Link>
                  {SERVICES.map((s) => (
                    <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} className="block py-2 px-3 text-sm text-muted-foreground rounded-lg hover:bg-accent transition-colors" onClick={() => setMobileOpen(false)}>
                      {s.name}
                    </Link>
                  ))}
                </div>
              )}
              <Link to="/doctors" className="block py-2.5 px-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors" onClick={() => setMobileOpen(false)}>Doctors</Link>
              <Link to="/gallery" className="block py-2.5 px-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors" onClick={() => setMobileOpen(false)}>Gallery</Link>
              <Link to="/blog" className="block py-2.5 px-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors" onClick={() => setMobileOpen(false)}>Blog</Link>
              <Link to="/contact" className="block py-2.5 px-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors" onClick={() => setMobileOpen(false)}>Contact</Link>
              <div className="pt-3 space-y-2">
                <Link to="/book-appointment" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-gold hover:bg-gold/90 text-gold-foreground font-semibold rounded-full tracking-wide">Book Appointment</Button>
                </Link>
                <a href={getCallLink()} className="block text-center py-2.5 text-sm font-medium text-cta hover:text-cta/80 transition-colors">
                  Call: {CLINIC.phone}
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
