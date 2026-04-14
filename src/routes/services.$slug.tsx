import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle, Clock, Shield, Star, Users, Phone, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/interfaces-accordion";
import { Input } from "@/components/ui/input";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CLINIC, SERVICES, DOCTORS, TESTIMONIALS } from "@/lib/constants";
import { openWhatsAppService, getCallLink } from "@/lib/whatsapp";
import { trackViewContent } from "@/lib/analytics";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitToWeb3Forms } from "@/lib/forms";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const service = SERVICES.find((s) => s.slug === params.slug);
    const name = service?.name || "Service";
    return {
      meta: [
        { title: `${name} in ${CLINIC.city} | ${CLINIC.name}` },
        { name: "description", content: `Expert ${name} treatment at ${CLINIC.name}, ${CLINIC.city}. NABH accredited, experienced doctors. Book your consultation today.` },
        { property: "og:title", content: `${name} | ${CLINIC.name}` },
        { property: "og:description", content: `Best ${name} treatment in ${CLINIC.city}. Book free consultation.` },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalCondition",
            name,
            associatedAnatomy: { "@type": "AnatomicalStructure", name: "Various" },
          }),
        },
      ],
    };
  },
  component: ServicePage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">Service Not Found</h1>
        <Link to="/services" className="mt-4 inline-block text-gold hover:underline">View All Services</Link>
      </div>
    </div>
  ),
});

const sidebarSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
  date: z.string().min(1),
});

function ServicePage() {
  const { slug } = Route.useParams();
  const service = SERVICES.find((s) => s.slug === slug);

  useEffect(() => {
    if (service) trackViewContent(service.name);
  }, [service]);

  const [sidebarSubmitted, setSidebarSubmitted] = useState(false);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ resolver: zodResolver(sidebarSchema) });

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-navy">Service Not Found</h1>
          <Link to="/services" className="mt-4 inline-block text-gold hover:underline">View All Services</Link>
        </div>
      </div>
    );
  }

  const relatedDoctors = DOCTORS.filter((d) => d.specialization === service.name);
  const relatedTestimonials = TESTIMONIALS.filter((t) => t.treatment === service.name);
  const otherServices = SERVICES.filter((s) => s.slug !== slug);

  const onSidebarSubmit = async (data: any) => {
    await submitToWeb3Forms({ ...data, service: service.name }, `${service.name} Page Booking`);
    setSidebarSubmitted(true);
  };

  const conditions = [
    "Chronic pain management", "Preventive screening", "Diagnostic evaluation",
    "Treatment planning", "Follow-up care", "Emergency consultation",
  ];

  const steps = [
    { title: "Consultation", desc: "Meet our specialist for a thorough evaluation and discussion of your concerns." },
    { title: "Diagnosis", desc: "Advanced diagnostic tests and imaging to identify the root cause accurately." },
    { title: "Treatment Plan", desc: "Customized treatment plan tailored to your specific condition and needs." },
    { title: "Recovery", desc: "Ongoing support and follow-up care to ensure complete recovery and wellness." },
  ];

  const faqs = [
    { q: `What conditions does ${service.name} treat?`, a: `Our ${service.name} department treats a wide range of conditions. Book a consultation for a personalized assessment.` },
    { q: `How much does ${service.name} consultation cost?`, a: `Consultation starts from ${service.price}. We also offer free initial consultations for select cases.` },
    { q: "Do I need a referral?", a: "No referral is needed. You can book directly with our specialists." },
    { q: "Is insurance accepted?", a: "Yes, we accept all major insurance providers and offer cashless treatment." },
    { q: "What should I bring to my appointment?", a: "Please bring your ID, previous medical reports, current medications list, and insurance card if applicable." },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: "Services", to: "/services" }, { label: service.name }]} />
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy-foreground">{service.name}</h1>
              <p className="text-lg text-navy-foreground/70 mt-3">{service.description}. Expert care at {CLINIC.name}, {CLINIC.city}.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/book-appointment">
                <Button className="bg-gold hover:bg-gold/90 text-gold-foreground font-semibold">
                  Book for {service.name} <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Button variant="outline" className="border-cta text-cta hover:bg-cta hover:text-cta-foreground" onClick={() => openWhatsAppService(service.name)}>
                WhatsApp Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-16">
              {/* Overview */}
              <AnimatedSection>
                <h2 className="font-heading text-2xl font-bold text-navy mb-4">What is {service.name}?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {service.name} at {CLINIC.name} provides comprehensive diagnosis, treatment, and ongoing management of conditions related to this specialty. Our team of experienced specialists uses the latest medical technology and evidence-based approaches to deliver the best possible outcomes for our patients.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  With over 15 years of expertise and thousands of successful treatments, our {service.name} department is one of the most trusted in {CLINIC.city}.
                </p>
              </AnimatedSection>

              {/* Conditions */}
              <AnimatedSection>
                <h2 className="font-heading text-2xl font-bold text-navy mb-4">Conditions We Treat</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {conditions.map((c) => (
                    <div key={c} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-cta shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              {/* Process */}
              <AnimatedSection>
                <h2 className="font-heading text-2xl font-bold text-navy mb-6">Our Treatment Process</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {steps.map((step, i) => (
                    <div key={i} className="relative">
                      <div className="w-10 h-10 rounded-full bg-gold text-gold-foreground flex items-center justify-center font-bold text-sm mb-3">{i + 1}</div>
                      <h3 className="font-semibold text-navy">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              {/* USPs */}
              <AnimatedSection>
                <h2 className="font-heading text-2xl font-bold text-navy mb-4">Why Choose Us for {service.name}?</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: Shield, text: "NABH accredited quality standards" },
                    { icon: Users, text: "Experienced specialist doctors" },
                    { icon: Clock, text: "Minimal wait times" },
                    { icon: Star, text: "4.9/5 patient satisfaction" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3 p-3 bg-cream rounded-lg">
                      <Icon className="w-5 h-5 text-gold shrink-0" />
                      <span className="text-sm font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              {/* Doctors */}
              {relatedDoctors.length > 0 && (
                <AnimatedSection>
                  <h2 className="font-heading text-2xl font-bold text-navy mb-6">Our {service.name} Specialists</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {relatedDoctors.map((doc) => (
                      <div key={doc.id} className="bg-card rounded-xl border p-5 flex gap-4">
                        <div className="w-16 h-16 rounded-full shrink-0 overflow-hidden">
                          <img
                            src={[
                              "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&q=80",
                              "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80",
                              "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80",
                            ][relatedDoctors.indexOf(doc) % 3]}
                            alt={doc.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-navy">{doc.name}</h3>
                          <p className="text-xs text-gold">{doc.designation}</p>
                          <p className="text-xs text-muted-foreground">{doc.qualification}</p>
                          <p className="text-xs text-muted-foreground">{doc.experience} yrs exp • Reg: {doc.regNo}</p>
                          <Link to="/book-appointment" className="inline-block mt-2">
                            <Button size="sm" className="bg-gold hover:bg-gold/90 text-gold-foreground text-xs h-7">Book with {doc.name.split(" ")[0]}</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </AnimatedSection>
              )}

              {/* Before/After */}
              <AnimatedSection>
                <h2 className="font-heading text-2xl font-bold text-navy mb-6">Patient Results</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="aspect-[4/3] bg-accent rounded-xl flex items-center justify-center text-sm text-muted-foreground border">
                      Before/After {i}
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              {/* Testimonials */}
              {relatedTestimonials.length > 0 && (
                <AnimatedSection>
                  <h2 className="font-heading text-2xl font-bold text-navy mb-6">Patient Reviews</h2>
                  {relatedTestimonials.map((t, i) => (
                    <div key={i} className="bg-cream rounded-xl p-6 mb-4">
                      <div className="flex gap-1 text-gold mb-2">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}</div>
                      <p className="text-sm italic">"{t.text}"</p>
                      <p className="text-sm font-semibold mt-2">{t.name}, {t.city}</p>
                    </div>
                  ))}
                </AnimatedSection>
              )}

              {/* FAQ */}
              <AnimatedSection>
                <h2 className="font-heading text-2xl font-bold text-navy mb-6">Frequently Asked Questions</h2>
                <div className="bg-card rounded-2xl border p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, i) => (
                      <AccordionItem key={i} value={`faq-${i}`}>
                        <AccordionTrigger className="text-navy font-medium">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </AnimatedSection>

              {/* Pricing */}
              <AnimatedSection>
                <div className="bg-cream rounded-xl p-8 text-center">
                  <h2 className="font-heading text-2xl font-bold text-navy">Affordable {service.name} Treatment</h2>
                  <p className="text-3xl font-bold text-gold mt-3">Starting from {service.price}</p>
                  <div className="flex flex-wrap justify-center gap-3 mt-4">
                    <span className="text-xs bg-card px-3 py-1.5 rounded-full border flex items-center gap-1.5"><CreditCard className="w-3 h-3 text-gold" /> EMI Available</span>
                    <span className="text-xs bg-card px-3 py-1.5 rounded-full border flex items-center gap-1.5"><Shield className="w-3 h-3 text-gold" /> Insurance Accepted</span>
                    <span className="text-xs bg-card px-3 py-1.5 rounded-full border flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-gold" /> No Hidden Charges</span>
                  </div>
                  <Link to="/book-appointment" className="inline-block mt-6">
                    <Button className="bg-gold hover:bg-gold/90 text-gold-foreground font-semibold px-8 py-5">
                      Book Free Consultation
                    </Button>
                  </Link>
                </div>
              </AnimatedSection>

              {/* Related Services */}
              <AnimatedSection>
                <h2 className="font-heading text-2xl font-bold text-navy mb-6">Other Services</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {otherServices.map((s) => (
                    <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} className="bg-card rounded-lg border p-4 hover:border-gold transition-colors text-center">
                      <p className="font-medium text-navy text-sm">{s.name}</p>
                      <p className="text-xs text-gold mt-1">From {s.price}</p>
                    </Link>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-card rounded-xl border p-6">
                  <h3 className="font-heading text-lg font-semibold text-navy mb-4">Book Appointment</h3>
                  {sidebarSubmitted ? (
                    <div className="text-center py-4">
                      <CheckCircle className="w-10 h-10 text-cta mx-auto mb-2" />
                      <p className="text-sm font-medium">Request sent! We'll call you soon.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSidebarSubmit)} className="space-y-3">
                      <Input placeholder="Full Name *" {...register("name")} className="text-base" />
                      <Input placeholder="Phone Number *" type="tel" {...register("phone")} className="text-base" />
                      <Input type="date" {...register("date")} className="text-base" />
                      <Button type="submit" disabled={isSubmitting} className="w-full bg-gold hover:bg-gold/90 text-gold-foreground font-semibold">
                        {isSubmitting ? "Sending..." : "Book Now →"}
                      </Button>
                      <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1"><Lock className="w-3 h-3" /> 100% Confidential</p>
                    </form>
                  )}
                </div>

                <div className="bg-cream rounded-xl p-5 text-center">
                  <p className="text-sm font-medium text-navy mb-2">Need help choosing?</p>
                  <a href={getCallLink()} className="flex items-center justify-center gap-2 text-sm text-gold font-semibold">
                    <Phone className="w-4 h-4" /> {CLINIC.phone}
                  </a>
                </div>

                <div className="bg-navy rounded-xl p-5 text-navy-foreground text-center">
                  <p className="text-sm font-medium mb-2">Chat on WhatsApp</p>
                  <Button className="bg-cta hover:bg-cta/90 text-cta-foreground w-full" onClick={() => openWhatsAppService(service.name)}>
                    WhatsApp Us →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
