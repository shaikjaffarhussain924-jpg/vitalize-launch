import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Youtube, Linkedin } from "lucide-react";
import { CLINIC, SERVICES } from "@/lib/constants";
import { getCallLink, openWhatsApp } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground relative pb-16 md:pb-0">
      {/* Top gradient border */}
      <div className="h-[2px] bg-gradient-to-r from-navy via-gold to-navy" />

      {/* Awards strip */}
      <div className="border-b border-navy-foreground/8 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs text-navy-foreground/50 mb-5 uppercase tracking-[0.2em]">Accreditations & Awards</p>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {["NABH Accredited", "ISO 9001:2015", "Govt. Recognized", "Best Clinic 2024", "Times Health Award"].map((badge) => (
              <div key={badge} className="px-4 py-2.5 rounded-full border border-navy-foreground/10 bg-navy-foreground/5 text-xs text-navy-foreground/60 font-medium tracking-wide">
                {badge}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center text-gold-foreground font-heading font-bold text-lg">H</div>
              <div>
                <span className="font-heading font-bold text-lg block leading-tight">{CLINIC.name}</span>
                <span className="text-[10px] text-navy-foreground/50 uppercase tracking-[0.15em]">{CLINIC.tagline}</span>
              </div>
            </div>
            <p className="text-sm text-navy-foreground/60 leading-relaxed mb-5">Providing world-class medical care in {CLINIC.city} for over 15 years with compassion and excellence.</p>
            <div className="flex gap-2.5">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Facebook, label: "Facebook" },
                { icon: Youtube, label: "YouTube" },
                { icon: Linkedin, label: "LinkedIn" },
              ].map(({ icon: Icon, label }) => (
                <a key={label} href="#" className="w-9 h-9 rounded-full border border-navy-foreground/10 bg-navy-foreground/5 flex items-center justify-center hover:bg-gold hover:border-gold transition-all duration-300" aria-label={label}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
              <button onClick={() => openWhatsApp()} className="w-9 h-9 rounded-full bg-cta flex items-center justify-center hover:bg-cta/80 transition-all duration-300" aria-label="WhatsApp">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-5">Quick Links</h3>
            <ul className="space-y-3">
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
                  <Link to={to as any} className="text-sm text-navy-foreground/60 hover:text-gold transition-colors duration-300">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-5">Our Services</h3>
            <ul className="space-y-3">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link to="/services/$slug" params={{ slug: s.slug }} className="text-sm text-navy-foreground/60 hover:text-gold transition-colors duration-300">{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-5">Contact Info</h3>
            <ul className="space-y-3.5">
              <li className="flex gap-3 text-sm text-navy-foreground/60">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
                <span>{CLINIC.address}</span>
              </li>
              <li>
                <a href={getCallLink()} className="flex gap-3 text-sm text-navy-foreground/60 hover:text-gold transition-colors duration-300">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
                  <span>{CLINIC.phone}</span>
                </a>
              </li>
              <li className="flex gap-3 text-sm text-navy-foreground/60">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
                <span>{CLINIC.email}</span>
              </li>
              <li className="flex gap-3 text-sm text-navy-foreground/60">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
                <span>{CLINIC.hours}</span>
              </li>
            </ul>

            {/* Map placeholder */}
            <div className="mt-5 w-full h-32 rounded-xl overflow-hidden border border-navy-foreground/8">
              <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=400&q=60" alt="Clinic exterior" className="w-full h-full object-cover opacity-40" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment & bottom */}
      <div className="border-t border-navy-foreground/8">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-navy-foreground/40">© {new Date().getFullYear()} {CLINIC.name}. All rights reserved.</p>
            <div className="flex items-center gap-3">
              {["Visa", "MC", "UPI", "Paytm", "GPay"].map((p) => (
                <span key={p} className="text-[10px] px-2.5 py-1 rounded-full border border-navy-foreground/10 bg-navy-foreground/5 text-navy-foreground/40 font-medium">{p}</span>
              ))}
            </div>
            <div className="flex gap-5 text-xs text-navy-foreground/40">
              <a href="#" className="hover:text-gold transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-gold transition-colors duration-300">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
