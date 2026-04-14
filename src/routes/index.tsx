import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Star, Shield, Stethoscope, Heart, Sparkles, Users, Award, Clock, CheckCircle, Phone, Target, Crown } from "lucide-react";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";
import { LocationMap } from "@/components/ui/expand-map";
import { Glow } from "@/components/ui/glow";
import { ImageComparison, ImageComparisonImage, ImageComparisonSlider } from "@/components/ui/image-comparison";
import { InteractiveImageAccordion } from "@/components/ui/interactive-image-accordion";
import { DestinationCard } from "@/components/ui/card-21";
import heroClinic from "@/assets/hero-clinic.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedSection } from "@/components/AnimatedSection";
import MultistepConsultationForm from "@/components/ui/multistep-form";
import { ShinyButton } from "@/components/ui/shiny-button";
import { BorderRotate } from "@/components/ui/animated-gradient-border";
import { Logos3 } from "@/components/blocks/logos3";
import { Gallery4 } from "@/components/blocks/gallery4";
import { CLINIC, SERVICES, DOCTORS, BLOG_POSTS } from "@/lib/constants";
import { openWhatsApp, getCallLink } from "@/lib/whatsapp";
import { useCountUp } from "@/hooks/useCountUp";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitToWeb3Forms } from "@/lib/forms";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${CLINIC.name} — Best Multi-Specialty Clinic in ${CLINIC.city}` },
      { name: "description", content: `${CLINIC.name} is a NABH accredited multi-specialty clinic in ${CLINIC.city}. 25+ expert doctors, 15,000+ happy patients. Book your free consultation today.` },
      { property: "og:title", content: `${CLINIC.name} — Best Multi-Specialty Clinic in ${CLINIC.city}` },
      { property: "og:description", content: `NABH accredited clinic with 25+ expert doctors in ${CLINIC.city}. Book free consultation today.` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalOrganization",
          name: CLINIC.name,
          url: CLINIC.url,
          telephone: CLINIC.phone,
          address: { "@type": "PostalAddress", streetAddress: "123, Jubilee Hills", addressLocality: CLINIC.city, addressRegion: "Telangana", postalCode: "500033", addressCountry: "IN" },
          openingHours: CLINIC.hoursSchema,
          priceRange: "₹₹",
          aggregateRating: { "@type": "AggregateRating", ratingValue: CLINIC.rating, reviewCount: CLINIC.reviewCount },
        }),
      },
    ],
  }),
  component: HomePage,
});

// Booking form
const bookingSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
  service: z.string().min(1),
  date: z.string().min(1),
});
type BookingData = z.infer<typeof bookingSchema>;

function StatCounter({ end, suffix = "", label }: { end: number; suffix?: string; label: string }) {
  const { count, ref } = useCountUp(end);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-heading font-bold text-gold-gradient">{count.toLocaleString()}{suffix}</div>
      <div className="text-sm text-navy-foreground/60 mt-2 tracking-wide">{label}</div>
    </div>
  );
}

function HomePage() {
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BookingData>({ resolver: zodResolver(bookingSchema) });

  const onBookingSubmit = async (data: BookingData) => {
    await submitToWeb3Forms(data, "Homepage Booking Form");
    setBookingSubmitted(true);
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Hero background */}
        <div className="absolute inset-0">
          <img src={heroClinic} alt="Luxury clinic interior" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/70 to-navy/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white/90 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-white/10">
                <Shield className="w-4 h-4 text-gold" /> NABH Accredited Hospital
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.1] tracking-tight">
                {CLINIC.tagline.split(",")[0]},<br />
                <span className="text-gold">{CLINIC.tagline.split(",")[1]}</span>
              </h1>
              <p className="text-lg text-white/70 mt-7 max-w-lg leading-relaxed font-light">
                Trusted by {CLINIC.patientCount}+ patients in {CLINIC.city}. World-class doctors, modern technology, and compassionate care — all under one roof.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-9">
                <Link to="/book-appointment">
                  <ShinyButton className="bg-gold hover:bg-gold/90 text-gold-foreground font-semibold text-base px-8 py-4 rounded-full shadow-[0_6px_24px_-6px_oklch(0.62_0.10_65/0.5)]">
                    Book Free Consultation <ArrowRight className="w-4 h-4 ml-1 inline" />
                  </ShinyButton>
                </Link>
                <Button variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold text-base px-8 py-6 rounded-full backdrop-blur-sm" onClick={() => openWhatsApp()}>
                  WhatsApp Us
                </Button>
              </div>
              <a href={getCallLink()} className="inline-flex items-center gap-2 mt-5 text-sm text-white/50 hover:text-white/80 transition-colors duration-300">
                <Phone className="w-4 h-4" /> Or call us: {CLINIC.phone}
              </a>
            </div>

            {/* Right — Glassmorphism Cards */}
            <div className="hidden lg:flex flex-col gap-5">
              {/* Stats Card */}
              <div className="relative rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-7 shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden">
                <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gold/15 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/20 backdrop-blur-sm border border-gold/20">
                      <Target className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <p className="text-2xl font-heading font-bold text-white">{CLINIC.patientCount}+</p>
                      <p className="text-sm text-white/60">Patients Treated</p>
                    </div>
                  </div>
                  <div className="mb-5">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/60">Patient Satisfaction</span>
                      <span className="font-semibold text-white">98%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-gold/80 to-gold" style={{ width: "98%" }} />
                    </div>
                  </div>
                  <div className="h-px w-full bg-white/10 my-4" />
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div><p className="text-lg font-bold text-white">25+</p><p className="text-xs text-white/50">Doctors</p></div>
                    <div><p className="text-lg font-bold text-white">15+</p><p className="text-xs text-white/50">Years</p></div>
                    <div><p className="text-lg font-bold text-white">{CLINIC.rating}</p><p className="text-xs text-white/50">Rating</p></div>
                  </div>
                  <div className="mt-5 flex gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-cta/20 px-3 py-1.5 text-xs font-semibold text-cta backdrop-blur-sm border border-cta/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-cta animate-pulse" /> OPEN NOW
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1.5 text-xs font-semibold text-gold backdrop-blur-sm border border-gold/20">
                      <Crown className="h-3 w-3" /> NABH
                    </span>
                  </div>
                </div>
              </div>

              {/* Accreditations marquee */}
              <div className="rounded-2xl border border-white/15 bg-white/8 backdrop-blur-xl p-5 shadow-lg overflow-hidden">
                <p className="text-xs text-white/40 mb-3 uppercase tracking-[0.15em] font-medium">Accreditations & Affiliations</p>
                <div className="overflow-hidden">
                  <div className="animate-marquee flex gap-8">
                    {[...["NABH", "ISO 9001", "Govt. Recognized", "Times Health", "FICCI", "IMA"], ...["NABH", "ISO 9001", "Govt. Recognized", "Times Health", "FICCI", "IMA"], ...["NABH", "ISO 9001", "Govt. Recognized", "Times Health", "FICCI", "IMA"]].map((name, i) => (
                      <div key={i} className="flex shrink-0 items-center gap-2 text-white/40">
                        <Shield className="h-4 w-4" />
                        <span className="whitespace-nowrap text-sm font-medium">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust bar */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, label: "15,000+ Happy Patients" },
              { icon: Clock, label: "15+ Years Experience" },
              { icon: Shield, label: "NABH Accredited" },
              { icon: Star, label: "4.9/5 Google Rating" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 bg-white/8 backdrop-blur-md rounded-xl px-4 py-3.5 border border-white/10">
                <Icon className="w-5 h-5 text-gold shrink-0" />
                <span className="text-sm font-medium text-white/80">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUIET BANNER */}
      <section className="bg-navy py-3.5 overflow-hidden">
        <div className="animate-marquee flex gap-16 whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="text-xs font-medium text-navy-foreground/60 flex items-center gap-2 tracking-[0.15em] uppercase">
              Limited Availability This Week &nbsp;&nbsp; · &nbsp;&nbsp;
              Complimentary Consultation &nbsp;&nbsp; · &nbsp;&nbsp;
              Rated {CLINIC.rating}/5 by {CLINIC.reviewCount}+ Patients &nbsp;&nbsp; · &nbsp;&nbsp;
              {CLINIC.phone} &nbsp;&nbsp; · &nbsp;&nbsp;
            </span>
          ))}
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-20 md:py-24 relative overflow-hidden">
        <Glow variant="center" className="h-[400px] opacity-30" />
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3">What We Offer</p>
              <h2 className="font-heading text-3xl md:text-[2.75rem] font-bold text-navy leading-tight">Our Specialties</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">Comprehensive medical care across 6+ specialties with experienced doctors and modern equipment.</p>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => {
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
              return (
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
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 md:py-24 bg-cream relative grain overflow-hidden">
        <Glow variant="top" className="h-[300px] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3">Why Us</p>
              <h2 className="font-heading text-3xl md:text-[2.75rem] font-bold text-navy leading-tight">Why Choose {CLINIC.name}?</h2>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "NABH Accredited", desc: "Recognized for maintaining the highest standards of quality and patient safety." },
              { icon: Users, title: "Expert Doctors", desc: "25+ highly qualified specialists with decades of combined experience." },
              { icon: Stethoscope, title: "Modern Equipment", desc: "State-of-the-art diagnostic and treatment technology for precise care." },
              { icon: Heart, title: "Affordable Care", desc: "Transparent pricing, EMI options, and insurance support for all patients." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <AnimatedSection key={title} delay={i * 100}>
                <BorderRotate
                  animationMode="stop-rotate-on-hover"
                  animationSpeed={8}
                  gradientColors={{ primary: '#1a1a3e', secondary: '#c7a03c', accent: '#f9de90' }}
                  backgroundColor="white"
                  borderRadius={16}
                  borderWidth={2}
                >
                  <div className="text-center p-8">
                    <div className="w-16 h-16 rounded-2xl bg-gold-light flex items-center justify-center text-gold mx-auto mb-5">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-navy">{title}</h3>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{desc}</p>
                  </div>
                </BorderRotate>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTOR SPOTLIGHT */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3">Our Team</p>
              <h2 className="font-heading text-3xl md:text-[2.75rem] font-bold text-navy leading-tight">Meet Our Doctors</h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">Experienced specialists dedicated to your health</p>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DOCTORS.slice(0, 3).map((doc, i) => {
              const docImages = [
                "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
              ];
              return (
                <AnimatedSection key={doc.id} delay={i * 100}>
                  <DestinationCard
                    imageUrl={docImages[i]}
                    title={doc.name}
                    subtitle={`${doc.designation} • ${doc.specialization}`}
                    stats={`${doc.experience} years experience • ${doc.qualification}`}
                    themeColor="220 40% 20%"
                  >
                    <Link to="/book-appointment" className="mt-2 block" onClick={(e) => e.stopPropagation()}>
                      <Button className="w-full bg-gold hover:bg-gold/90 text-gold-foreground text-sm rounded-full">
                        Book with {doc.name.split(" ")[0]}
                      </Button>
                    </Link>
                  </DestinationCard>
                </AnimatedSection>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link to="/doctors">
              <Button variant="outline" className="border-2 border-navy text-navy hover:bg-navy hover:text-navy-foreground rounded-full">
                View All Doctors <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* INTERACTIVE IMAGE ACCORDION */}
      <section className="py-20 md:py-24 bg-cream relative overflow-hidden grain">
        <Glow variant="center" className="h-[400px] opacity-40" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <AnimatedSection>
            <InteractiveImageAccordion
              heading="Comprehensive Care Under One Roof"
              description="From expert consultations to advanced diagnostics and surgical excellence — experience seamless, world-class healthcare at every step of your journey."
              ctaText="Book Free Consultation"
              ctaHref="/book-appointment"
              defaultActive={2}
            />
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-navy text-navy-foreground relative overflow-hidden grain">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,oklch(0.72_0.10_75/0.08),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <StatCounter end={15000} suffix="+" label="Patients Treated" />
            <StatCounter end={98} suffix="%" label="Patient Satisfaction" />
            <StatCounter end={25} suffix="+" label="Expert Doctors" />
            <StatCounter end={15} suffix="+" label="Years of Excellence" />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 md:py-24 bg-cream relative grain overflow-hidden">
        <Glow variant="bottom" className="h-[350px] opacity-25" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3">Testimonials</p>
            <h2 className="font-heading text-3xl md:text-[2.75rem] font-bold text-navy leading-tight">What Our Patients Say</h2>
            <p className="text-muted-foreground mt-3">{CLINIC.rating}/5 based on {CLINIC.reviewCount}+ verified reviews</p>
          </div>
          <StaggerTestimonials />
        </div>
      </section>

      {/* BOOKING FORM */}
      <section className="py-20 md:py-24 bg-navy text-navy-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,oklch(0.72_0.10_75/0.06),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3">Get Started</p>
              <h2 className="font-heading text-3xl md:text-[2.75rem] font-bold leading-tight">Book Your Free Consultation</h2>
              <p className="text-navy-foreground/60 mt-4 leading-relaxed">Fill in your details and we'll get back to you within 2 hours</p>
            </div>
          </AnimatedSection>

          {bookingSubmitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-cta mx-auto mb-4" />
              <h3 className="text-2xl font-heading font-bold">Appointment Requested!</h3>
              <p className="text-navy-foreground/60 mt-2">We'll call you shortly to confirm your slot.</p>
              <Link to="/thank-you" className="mt-4 inline-block">
                <Button className="bg-cta hover:bg-cta/90 text-cta-foreground rounded-full">Continue on WhatsApp →</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onBookingSubmit)} className="max-w-4xl mx-auto">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input placeholder="Full Name *" {...register("name")} className="bg-navy-foreground/8 border-navy-foreground/15 text-navy-foreground placeholder:text-navy-foreground/35 text-base py-5 rounded-xl focus:ring-gold/50 focus:border-gold/50" />
                <Input placeholder="Phone Number *" type="tel" {...register("phone")} className="bg-navy-foreground/8 border-navy-foreground/15 text-navy-foreground placeholder:text-navy-foreground/35 text-base py-5 rounded-xl focus:ring-gold/50 focus:border-gold/50" />
                <select {...register("service")} className="flex h-11 w-full rounded-xl border bg-navy-foreground/8 border-navy-foreground/15 px-3 py-2 text-sm text-navy-foreground transition-colors focus:ring-2 focus:ring-gold/50">
                  <option value="">Select Service *</option>
                  {SERVICES.map((s) => <option key={s.slug} value={s.name}>{s.name}</option>)}
                </select>
                <Input type="date" {...register("date")} className="bg-navy-foreground/8 border-navy-foreground/15 text-navy-foreground text-base py-5 rounded-xl focus:ring-gold/50 focus:border-gold/50" />
              </div>
              <div className="mt-6 text-center">
                <Button type="submit" disabled={isSubmitting} className="bg-gold hover:bg-gold/90 text-gold-foreground font-semibold text-base px-10 py-5 rounded-full shadow-[0_6px_24px_-6px_oklch(0.72_0.10_75/0.4)] hover:shadow-[0_8px_30px_-6px_oklch(0.72_0.10_75/0.5)] hover:scale-[1.02]">
                  {isSubmitting ? "Submitting..." : "Book Free Consultation →"}
                </Button>
              </div>
              <p className="text-center text-xs text-navy-foreground/40 mt-4 tracking-[0.1em] uppercase">Your data is secure · Complimentary consultation · Transparent pricing</p>
            </form>
          )}
        </div>
      </section>

      {/* AWARDS */}
      <Logos3
        heading="As Seen In & Accreditations"
        logos={[
          { id: "nabh", description: "NABH", text: "NABH" },
          { id: "iso", description: "ISO 9001", text: "ISO 9001" },
          { id: "govt", description: "Govt. Recognized", text: "Govt. Recognized" },
          { id: "times", description: "Times Health", text: "Times Health" },
          { id: "best", description: "Best Clinic Award", text: "Best Clinic Award" },
          { id: "excellence", description: "Healthcare Excellence", text: "Healthcare Excellence" },
          { id: "nabh2", description: "NABH", text: "NABH" },
          { id: "iso2", description: "ISO 9001", text: "ISO 9001" },
        ]}
      />

      {/* BEFORE/AFTER COMPARISON */}
      <section className="py-20 md:py-24 relative overflow-hidden">
        <Glow variant="center" className="h-[400px] opacity-40" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3">Real Results</p>
            <h2 className="font-heading text-3xl md:text-[2.75rem] font-bold text-navy leading-tight">Before & After</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">Drag the slider to see real patient transformations achieved at our clinic.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="rounded-2xl overflow-hidden border shadow-lg">
                <ImageComparison className="aspect-[4/3] w-full" enableHover>
                  <ImageComparisonImage
                    src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&h=450&fit=crop"
                    alt="Before dental treatment"
                    position="left"
                  />
                  <ImageComparisonImage
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=450&fit=crop"
                    alt="After dental treatment"
                    position="right"
                  />
                  <ImageComparisonSlider className="w-1">
                    <div className="flex h-full flex-col items-center justify-center">
                      <div className="h-full w-0.5 bg-gold shadow-[0_0_8px_oklch(0.62_0.10_65/0.5)]" />
                      <div className="absolute top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-gold border-2 border-gold-foreground shadow-lg flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 text-gold-foreground -rotate-180" />
                        <ArrowRight className="w-3 h-3 text-gold-foreground" />
                      </div>
                    </div>
                  </ImageComparisonSlider>
                </ImageComparison>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-3 font-medium">Dental Restoration</p>
            </div>
            <div>
              <div className="rounded-2xl overflow-hidden border shadow-lg">
                <ImageComparison className="aspect-[4/3] w-full" enableHover>
                  <ImageComparisonImage
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=450&fit=crop"
                    alt="Before skin treatment"
                    position="left"
                  />
                  <ImageComparisonImage
                    src="https://images.unsplash.com/photo-1551884170-09fb70a3a2ed?w=600&h=450&fit=crop"
                    alt="After skin treatment"
                    position="right"
                  />
                  <ImageComparisonSlider className="w-1">
                    <div className="flex h-full flex-col items-center justify-center">
                      <div className="h-full w-0.5 bg-gold shadow-[0_0_8px_oklch(0.62_0.10_65/0.5)]" />
                      <div className="absolute top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-gold border-2 border-gold-foreground shadow-lg flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 text-gold-foreground -rotate-180" />
                        <ArrowRight className="w-3 h-3 text-gold-foreground" />
                      </div>
                    </div>
                  </ImageComparisonSlider>
                </ImageComparison>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-3 font-medium">Skin Treatment Results</p>
            </div>
          </div>
        </div>
      </section>
      <div className="text-center -mt-10 mb-16">
        <Link to="/gallery">
          <Button variant="outline" className="border-2 border-navy text-navy hover:bg-navy hover:text-navy-foreground rounded-full">
            View All Results <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* BLOG TEASER */}
      <section className="py-20 md:py-24 bg-cream relative grain">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3">Stay Informed</p>
              <h2 className="font-heading text-3xl md:text-[2.75rem] font-bold text-navy leading-tight">Health Articles</h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">Stay informed with expert medical advice</p>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {BLOG_POSTS.slice(0, 3).map((post, i) => (
              <AnimatedSection key={post.slug} delay={i * 100}>
                <Link to="/blog/$slug" params={{ slug: post.slug }} className="group block bg-card rounded-2xl overflow-hidden border premium-card">
                  <img
                    src={[
                      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80",
                      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
                      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
                    ][i]}
                    alt={post.title}
                    className="aspect-video w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium bg-gold-light text-gold px-2.5 py-1 rounded-full">{post.category}</span>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    <h3 className="font-heading font-semibold text-navy group-hover:text-gold transition-colors duration-300">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    <div className="mt-4 text-xs text-muted-foreground">{post.author} • {post.date}</div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/blog">
              <Button variant="outline" className="border-2 border-navy text-navy hover:bg-navy hover:text-navy-foreground rounded-full">
                Read All Articles <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CONSULTATION FORM */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3">Get Started</p>
              <h2 className="font-heading text-3xl md:text-[2.75rem] font-bold text-navy leading-tight">Book a Consultation</h2>
              <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Fill out this quick form and our team will reach out to schedule your appointment.</p>
            </div>
          </AnimatedSection>
          <MultistepConsultationForm />
        </div>
      </section>


      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3">Find Us</p>
              <h2 className="font-heading text-3xl md:text-[2.75rem] font-bold text-navy leading-tight">Visit Us</h2>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-10">
            <LocationMap
              location={CLINIC.address}
              coordinates="17.4326° N, 78.4071° E"
              className="w-full"
            />
            <div className="flex flex-col justify-center space-y-5">
              <div>
                <h3 className="font-heading text-2xl font-semibold text-navy">{CLINIC.name}</h3>
                <p className="text-muted-foreground mt-1.5 leading-relaxed">{CLINIC.address}</p>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p><a href={getCallLink()} className="text-gold hover:underline">{CLINIC.phone}</a></p>
                <p>{CLINIC.email}</p>
                <p>{CLINIC.hours}</p>
                <p><button onClick={() => openWhatsApp()} className="text-cta hover:underline">Message us on WhatsApp</button></p>
              </div>
              <div className="flex gap-3 pt-3">
                <a href={`https://maps.google.com/?q=${encodeURIComponent(CLINIC.address)}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-2 border-navy text-navy hover:bg-navy hover:text-navy-foreground rounded-full">
                    Get Directions
                  </Button>
                </a>
                <Link to="/book-appointment">
                  <Button className="bg-gold hover:bg-gold/90 text-gold-foreground rounded-full shadow-[0_4px_15px_-3px_oklch(0.72_0.10_75/0.4)]">
                    Book Appointment
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-muted-foreground tracking-wide">Available in Hindi & English</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
