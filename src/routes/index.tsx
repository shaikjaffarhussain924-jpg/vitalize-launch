import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Star, Shield, Stethoscope, Heart, Sparkles, Users, Award, Clock, CheckCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ShinyButton } from "@/components/ui/shiny-button";
import { BorderRotate } from "@/components/ui/animated-gradient-border";
import { Logos3 } from "@/components/blocks/logos3";
import { Gallery4 } from "@/components/blocks/gallery4";
import { CLINIC, SERVICES, DOCTORS, TESTIMONIALS, BLOG_POSTS } from "@/lib/constants";
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
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const onBookingSubmit = async (data: BookingData) => {
    await submitToWeb3Forms(data, "Homepage Booking Form");
    setBookingSubmitted(true);
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center bg-cream overflow-hidden grain">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,oklch(0.72_0.10_75/0.06),transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/95 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-navy/5 hidden lg:block" />
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gold-light text-gold px-4 py-2 rounded-full text-sm font-medium mb-8 shadow-sm">
                <Shield className="w-4 h-4" /> NABH Accredited Hospital
              </div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-navy leading-[1.1] tracking-tight">
                {CLINIC.tagline.split(",")[0]},<br />
                <span className="text-gold-gradient">{CLINIC.tagline.split(",")[1]}</span>
              </h1>
              <p className="text-lg text-muted-foreground mt-7 max-w-lg leading-relaxed">
                Trusted by {CLINIC.patientCount}+ patients in {CLINIC.city}. World-class doctors, modern technology, and compassionate care — all under one roof.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-9">
                <Link to="/book-appointment">
                  <Button className="bg-gold hover:bg-gold/90 text-gold-foreground font-semibold text-base px-8 py-6 rounded-full shadow-[0_6px_24px_-6px_oklch(0.72_0.10_75/0.4)] hover:shadow-[0_8px_30px_-6px_oklch(0.72_0.10_75/0.5)] hover:scale-[1.02]">
                    Book Free Consultation <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Button variant="outline" className="border-2 border-cta text-cta hover:bg-cta hover:text-cta-foreground font-semibold text-base px-8 py-6 rounded-full" onClick={() => openWhatsApp()}>
                  WhatsApp Us
                </Button>
              </div>
              <a href={getCallLink()} className="inline-flex items-center gap-2 mt-5 text-sm text-muted-foreground hover:text-navy transition-colors duration-300">
                <Phone className="w-4 h-4" /> Or call us: {CLINIC.phone}
              </a>
            </div>
            <div className="hidden lg:block">
              <div className="w-full aspect-[4/5] bg-gradient-to-br from-navy/10 to-navy/5 rounded-3xl flex items-center justify-center text-muted-foreground border border-navy/10">
                Doctor / Clinic Image
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
              <div key={label} className="flex items-center gap-3 bg-card rounded-xl px-4 py-3.5 shadow-sm border-l-[3px] border-l-gold premium-card">
                <Icon className="w-5 h-5 text-gold shrink-0" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* URGENCY BANNER */}
      <section className="bg-gradient-to-r from-gold via-gold to-gold py-3.5 overflow-hidden">
        <div className="animate-marquee flex gap-16 whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="text-sm font-semibold text-gold-foreground flex items-center gap-2 tracking-wide">
              🎯 Limited Slots Available This Week — Book Your Free Consultation Today &nbsp;&nbsp; | &nbsp;&nbsp;
              📞 Call Now: {CLINIC.phone} &nbsp;&nbsp; | &nbsp;&nbsp;
              ⭐ Rated {CLINIC.rating}/5 by {CLINIC.reviewCount}+ Patients &nbsp;&nbsp; | &nbsp;&nbsp;
            </span>
          ))}
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3">What We Offer</p>
              <h2 className="font-heading text-3xl md:text-[2.75rem] font-bold text-navy leading-tight">Our Specialties</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">Comprehensive medical care across 6+ specialties with experienced doctors and modern equipment.</p>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => (
              <AnimatedSection key={service.slug} delay={i * 100}>
                <Link to="/services/$slug" params={{ slug: service.slug }} className="group block bg-card rounded-2xl p-7 border premium-card">
                  <div className="w-14 h-14 rounded-xl bg-gold-light flex items-center justify-center text-gold mb-5 group-hover:bg-gold group-hover:text-gold-foreground transition-all duration-300">
                    <Stethoscope className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-navy">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{service.description}</p>
                  <span className="inline-flex items-center gap-1.5 mt-5 text-sm font-medium text-gold group-hover:gap-3 transition-all duration-300">
                    Learn More <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 md:py-24 bg-cream relative grain">
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
                <div className="text-center p-8 rounded-2xl bg-card/50 hover:bg-card transition-colors duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-gold-light flex items-center justify-center text-gold mx-auto mb-5">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-navy">{title}</h3>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{desc}</p>
                </div>
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
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
            {DOCTORS.slice(0, 3).map((doc, i) => (
              <AnimatedSection key={doc.id} delay={i * 100} className="min-w-[300px] flex-1 snap-start">
                <div className="bg-card rounded-2xl border overflow-hidden premium-card">
                  <div className="aspect-[3/4] bg-gradient-to-b from-navy/10 to-navy/5 flex items-center justify-center text-muted-foreground group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                    Doctor Photo
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-lg font-semibold text-navy">{doc.name}</h3>
                    <p className="text-sm text-gold font-medium mt-1">{doc.designation}</p>
                    <p className="text-xs text-muted-foreground mt-1.5">{doc.qualification}</p>
                    <p className="text-xs text-muted-foreground">{doc.experience} years experience</p>
                    <Link to="/book-appointment" className="mt-4 block">
                      <Button className="w-full bg-gold hover:bg-gold/90 text-gold-foreground text-sm rounded-full">
                        Book with {doc.name.split(" ")[0]} {doc.name.split(" ")[1]}
                      </Button>
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
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

      {/* STATS */}
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
      <section className="py-20 md:py-24 bg-cream relative grain">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3">Testimonials</p>
              <h2 className="font-heading text-3xl md:text-[2.75rem] font-bold text-navy leading-tight">What Our Patients Say</h2>
              <p className="text-muted-foreground mt-3">⭐ {CLINIC.rating}/5 based on {CLINIC.reviewCount}+ Google Reviews</p>
            </div>
          </AnimatedSection>
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-3xl p-10 shadow-[0_20px_60px_-15px_oklch(0.20_0.045_255/0.08)] border relative overflow-hidden quote-mark">
              <div className="text-gold flex gap-1 mb-5 relative z-10">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-lg italic text-foreground/90 leading-relaxed relative z-10">"{TESTIMONIALS[testimonialIdx].text}"</p>
              <div className="mt-7 flex items-center justify-between relative z-10">
                <div>
                  <p className="font-semibold text-navy">{TESTIMONIALS[testimonialIdx].name}</p>
                  <p className="text-sm text-muted-foreground">{TESTIMONIALS[testimonialIdx].city} • {TESTIMONIALS[testimonialIdx].treatment}</p>
                </div>
                <div className="flex gap-2">
                  {TESTIMONIALS.map((_, i) => (
                    <button key={i} onClick={() => setTestimonialIdx(i)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === testimonialIdx ? "bg-gold scale-125" : "bg-border hover:bg-muted-foreground/30"}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
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
              <p className="text-center text-xs text-navy-foreground/40 mt-4 tracking-wide">🔒 Your data is safe • Free consultation • No hidden charges</p>
            </form>
          )}
        </div>
      </section>

      {/* AWARDS */}
      <section className="py-14 border-y">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs uppercase tracking-[0.25em] text-muted-foreground mb-7">As Seen In & Accreditations</p>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {["NABH", "ISO 9001", "Govt. Recognized", "Times Health", "Best Clinic Award", "Healthcare Excellence"].map((badge) => (
              <div key={badge} className="px-5 py-3 rounded-full bg-gold-light text-sm text-navy font-medium tracking-wide">
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE/AFTER TEASER */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3">Results</p>
              <h2 className="font-heading text-3xl md:text-[2.75rem] font-bold text-navy leading-tight">Patient Results</h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">Real results from real patients</p>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div className="group relative rounded-2xl overflow-hidden cursor-pointer border premium-card">
                  <div className="aspect-square bg-accent flex items-center justify-center">
                    <div className="text-center text-sm text-muted-foreground">
                      <p className="font-medium">Before</p>
                      <p className="text-xs mt-1">Hover to see After</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-cta/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="text-center text-cta-foreground">
                      <p className="font-medium">After</p>
                      <p className="text-xs mt-1">Amazing Results ✨</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/gallery">
              <Button variant="outline" className="border-2 border-navy text-navy hover:bg-navy hover:text-navy-foreground rounded-full">
                View All Results <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
                  <div className="aspect-video bg-gradient-to-br from-navy/10 to-navy/5 flex items-center justify-center text-muted-foreground">Blog Image</div>
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

      {/* LOCATION */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3">Find Us</p>
              <h2 className="font-heading text-3xl md:text-[2.75rem] font-bold text-navy leading-tight">Visit Us</h2>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="aspect-video bg-accent rounded-2xl flex items-center justify-center text-muted-foreground border">
              Google Maps Embed
            </div>
            <div className="flex flex-col justify-center space-y-5">
              <div>
                <h3 className="font-heading text-2xl font-semibold text-navy">{CLINIC.name}</h3>
                <p className="text-muted-foreground mt-1.5 leading-relaxed">{CLINIC.address}</p>
              </div>
              <div className="space-y-3 text-sm">
                <p>📞 <a href={getCallLink()} className="text-gold hover:underline">{CLINIC.phone}</a></p>
                <p>📧 {CLINIC.email}</p>
                <p>🕐 {CLINIC.hours}</p>
                <p>💬 <button onClick={() => openWhatsApp()} className="text-cta hover:underline">WhatsApp Us</button></p>
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
              <p className="text-xs text-muted-foreground">🌐 Available in Hindi & English</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
