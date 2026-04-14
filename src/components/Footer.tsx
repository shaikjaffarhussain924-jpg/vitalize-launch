import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Youtube, Linkedin } from "lucide-react";
import { CLINIC, SERVICES } from "@/lib/constants";
import { getCallLink, openWhatsApp } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground">
      {/* Awards strip */}
      <div className="border-b border-navy-foreground/10 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-sm text-navy-foreground/60 mb-4">Accreditations & Awards</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {["NABH Accredited", "ISO 9001:2015", "Govt. Recognized", "Best Clinic 2024", "Times Health Award"].map((badge) => (
              <div key={badge} className="w-20 h-12 rounded bg-navy-foreground/10 flex items-center justify-center text-xs text-navy-foreground/60 text-center px-1">
                {badge}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center text-gold-foreground font-heading font-bold">H</div>
              <span className="font-heading font-bold text-lg">{CLINIC.name}</span>
            </div>
            <p className="text-sm text-navy-foreground/70 mb-4">{CLINIC.tagline}. Providing world-class medical care in {CLINIC.city} for over 15 years.</p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Facebook, label: "Facebook" },
                { icon: Youtube, label: "YouTube" },
                { icon: Linkedin, label: "LinkedIn" },
              ].map(({ icon: Icon, label }) => (
                <a key={label} href="#" className="w-9 h-9 rounded-full bg-navy-foreground/10 flex items-center justify-center hover:bg-gold transition-colors" aria-label={label}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
              <button onClick={() => openWhatsApp()} className="w-9 h-9 rounded-full bg-cta flex items-center justify-center hover:bg-cta/90 transition-colors" aria-label="WhatsApp">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { to: "/about", label: "About Us" },
                { to: "/doctors", label: "Our Doctors" },
                { to: "/gallery", label: "Gallery" },
                { to: "/blog", label: "Health Blog" },
                { to: "/faq", label: "FAQs" },
                { to: "/contact", label: "Contact Us" },
                { to: "/book-appointment", label: "Book Appointment" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to as any} className="text-sm text-navy-foreground/70 hover:text-gold transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Our Services</h3>
            <ul className="space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link to="/services/$slug" params={{ slug: s.slug }} className="text-sm text-navy-foreground/70 hover:text-gold transition-colors">{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex gap-2 text-sm text-navy-foreground/70">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
                <span>{CLINIC.address}</span>
              </li>
              <li>
                <a href={getCallLink()} className="flex gap-2 text-sm text-navy-foreground/70 hover:text-gold transition-colors">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
                  <span>{CLINIC.phone}</span>
                </a>
              </li>
              <li className="flex gap-2 text-sm text-navy-foreground/70">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
                <span>{CLINIC.email}</span>
              </li>
              <li className="flex gap-2 text-sm text-navy-foreground/70">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
                <span>{CLINIC.hours}</span>
              </li>
            </ul>

            {/* Map placeholder */}
            <div className="mt-4 w-full h-32 bg-navy-foreground/10 rounded-lg flex items-center justify-center text-xs text-navy-foreground/40">
              Google Maps Embed
            </div>
          </div>
        </div>
      </div>

      {/* Payment & bottom */}
      <div className="border-t border-navy-foreground/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-navy-foreground/50">© {new Date().getFullYear()} {CLINIC.name}. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {["Visa", "MC", "UPI", "Paytm", "GPay"].map((p) => (
                <span key={p} className="text-[10px] px-2 py-1 rounded bg-navy-foreground/10 text-navy-foreground/40">{p}</span>
              ))}
            </div>
            <div className="flex gap-4 text-xs text-navy-foreground/50">
              <a href="#" className="hover:text-navy-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-navy-foreground">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
