import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Stethoscope } from "lucide-react";
import { Glow } from "@/components/ui/glow";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Breadcrumb } from "@/components/Breadcrumb";
import { DestinationCard } from "@/components/ui/card-21";
import { CLINIC, SERVICES } from "@/lib/constants";

const serviceImages = [
  "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1588776813677-77aaf5595b83?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1607990281513-2c110a25e779?auto=format&fit=crop&w=600&q=80",
];

const themeColors = [
  "30 50% 25%", "0 40% 30%", "200 40% 25%",
  "150 40% 20%", "280 30% 30%", "45 50% 30%",
];

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
                <Link to="/services/$slug" params={{ slug: service.slug }}>
                  <DestinationCard
                    imageUrl={serviceImages[i % serviceImages.length]}
                    title={service.name}
                    subtitle={service.description}
                    stats={`Starting from ${service.price}`}
                    themeColor={themeColors[i % themeColors.length]}
                    icon={<Stethoscope className="w-5 h-5" />}
                  />
                </Link>
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
