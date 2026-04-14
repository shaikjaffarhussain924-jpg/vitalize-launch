import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Stethoscope } from "lucide-react";
import { Glow } from "@/components/ui/glow";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CLINIC, SERVICES } from "@/lib/constants";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: `Our Services | ${CLINIC.name} — ${CLINIC.city}` },
      { name: "description", content: `Explore our medical services: ${SERVICES.map(s => s.name).join(", ")}. Book your consultation today.` },
      { property: "og:title", content: `Medical Services | ${CLINIC.name}` },
      { property: "og:description", content: `6+ medical specialties with expert doctors in ${CLINIC.city}.` },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div>
      <section className="bg-cream py-16 relative overflow-hidden">
        <Glow variant="center" className="h-[300px] opacity-20" />
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: "Services" }]} />
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy">Our Medical Services</h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl">
            Comprehensive medical care across 6+ specialties with experienced doctors and state-of-the-art equipment.
          </p>
        </div>
      </section>

      <section className="py-16 relative overflow-hidden">
        <Glow variant="bottom" className="h-[400px] opacity-20" />
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, i) => (
              <AnimatedSection key={service.slug} delay={i * 100}>
                <div className="bg-card rounded-xl border p-6 hover:shadow-lg hover:border-gold transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-4 group-hover:bg-gold group-hover:text-gold-foreground transition-colors">
                    <Stethoscope className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-navy">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{service.description}</p>
                  <p className="text-sm font-semibold text-gold mt-3">Starting from {service.price}</p>
                  <div className="flex gap-3 mt-4">
                    <Link to="/services/$slug" params={{ slug: service.slug }}>
                      <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-navy-foreground text-sm">
                        Learn More <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                    <Link to="/book-appointment">
                      <Button className="bg-gold hover:bg-gold/90 text-gold-foreground text-sm">Book Now</Button>
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-navy text-navy-foreground text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold">Not Sure Which Service You Need?</h2>
          <p className="text-navy-foreground/70 mt-3">Book a free consultation and our doctors will guide you.</p>
          <Link to="/book-appointment" className="mt-6 inline-block">
            <Button className="bg-gold hover:bg-gold/90 text-gold-foreground font-semibold px-8 py-5">
              Book Free Consultation
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
