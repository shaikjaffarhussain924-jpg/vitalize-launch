import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Shield, Award, Target, Eye, Heart, Clock, Users } from "lucide-react";
import { Glow } from "@/components/ui/glow";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CLINIC } from "@/lib/constants";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About Us | ${CLINIC.name} — ${CLINIC.city}` },
      { name: "description", content: `Learn about ${CLINIC.name}, a NABH accredited multi-specialty clinic in ${CLINIC.city} with 15+ years of excellence in healthcare.` },
      { property: "og:title", content: `About Us | ${CLINIC.name}` },
      { property: "og:description", content: `15+ years of healthcare excellence in ${CLINIC.city}. Meet our team and learn our story.` },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const timeline = [
    { year: "2009", title: "Founded", desc: "HealthFirst Clinic was established with a vision to provide affordable, quality healthcare in Hyderabad." },
    { year: "2012", title: "NABH Accreditation", desc: "Achieved NABH accreditation for maintaining the highest standards of patient care and safety." },
    { year: "2015", title: "Expansion", desc: "Expanded to a 50-bed facility with state-of-the-art operation theaters and diagnostic labs." },
    { year: "2018", title: "Multi-Specialty", desc: "Grew to 6+ specialties with 20+ doctors, becoming a leading multi-specialty clinic." },
    { year: "2021", title: "Digital Transformation", desc: "Launched teleconsultation services and a digital patient portal for seamless care." },
    { year: "2024", title: "15,000+ Patients", desc: "Crossed the milestone of serving over 15,000 patients with a 4.9/5 satisfaction rating." },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-cream py-16 relative overflow-hidden">
        <Glow variant="center" className="h-[300px] opacity-20" />
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: "About Us" }]} />
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy">About {CLINIC.name}</h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl">
            For over 15 years, we have been committed to providing world-class medical care with compassion, integrity, and innovation in {CLINIC.city}.
          </p>
        </div>
      </section>

      {/* Mission/Vision/Values */}
      <section className="py-16 relative overflow-hidden">
        <Glow variant="top" className="h-[350px] opacity-25" />
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: "Our Mission", desc: "To provide accessible, affordable, and advanced healthcare to every patient who walks through our doors, ensuring the best possible outcomes." },
              { icon: Eye, title: "Our Vision", desc: "To be the most trusted healthcare institution in South India, setting new standards in medical excellence and patient care." },
              { icon: Heart, title: "Our Values", desc: "Compassion, integrity, innovation, and patient-first approach guide everything we do at HealthFirst Clinic." },
            ].map(({ icon: Icon, title, desc }) => (
              <AnimatedSection key={title}>
                <div className="text-center p-8 bg-card rounded-xl border">
                  <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center text-gold mx-auto mb-4">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-navy">{title}</h3>
                  <p className="text-sm text-muted-foreground mt-3">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-4">
          <AnimatedSection>
            <h2 className="font-heading text-3xl font-bold text-navy text-center mb-12">Our Journey</h2>
          </AnimatedSection>
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-border" />
            {timeline.map((item, i) => (
              <AnimatedSection key={item.year} delay={i * 100}>
                <div className={`relative flex items-start mb-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="hidden md:block w-1/2" />
                  <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-gold -translate-x-1/2 mt-1.5 z-10" />
                  <div className="ml-12 md:ml-0 md:w-1/2 md:px-8">
                    <span className="text-sm font-bold text-gold">{item.year}</span>
                    <h3 className="font-heading text-lg font-semibold text-navy">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <h2 className="font-heading text-3xl font-bold text-navy text-center mb-12">Our Team</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-accent rounded-xl flex items-center justify-center text-muted-foreground text-sm">
                Team Photo {i + 1}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="font-heading text-3xl font-bold text-navy mb-8">Certifications & Awards</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["NABH Certificate", "ISO 9001:2015", "Best Clinic 2024", "Healthcare Excellence Award"].map((cert) => (
              <AnimatedSection key={cert}>
                <div className="aspect-[4/3] bg-card rounded-xl border flex items-center justify-center text-sm text-muted-foreground p-4 text-center">
                  {cert}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-navy text-navy-foreground text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold">Visit Us Today</h2>
          <p className="text-navy-foreground/70 mt-3">Experience the HealthFirst difference. Book your consultation now.</p>
          <Link to="/book-appointment" className="mt-6 inline-block">
            <Button className="bg-gold hover:bg-gold/90 text-gold-foreground font-semibold text-base px-8 py-5">
              Book Free Consultation <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
