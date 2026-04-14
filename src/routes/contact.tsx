import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CLINIC } from "@/lib/constants";
import { openWhatsApp, getCallLink } from "@/lib/whatsapp";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitToWeb3Forms } from "@/lib/forms";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().min(10).max(15),
  message: z.string().min(10).max(1000),
});

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact Us | ${CLINIC.name} — ${CLINIC.city}` },
      { name: "description", content: `Get in touch with ${CLINIC.name}. Call, WhatsApp, or visit us at ${CLINIC.address}.` },
      { property: "og:title", content: `Contact Us | ${CLINIC.name}` },
      { property: "og:description", content: `Reach us at ${CLINIC.phone} or visit our clinic.` },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: any) => {
    await submitToWeb3Forms(data, "Contact Page Inquiry");
    setSubmitted(true);
  };

  return (
    <div>
      <section className="bg-cream py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: "Contact Us" }]} />
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy">Contact Us</h1>
          <p className="text-lg text-muted-foreground mt-4">We're here to help. Reach out through any channel.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-navy mb-6">Get In Touch</h2>
              <div className="space-y-6">
                {[
                  { icon: MapPin, title: "Visit Us", content: CLINIC.address, action: null },
                  { icon: Phone, title: "Call Us", content: CLINIC.phone, action: getCallLink() },
                  { icon: Mail, title: "Email Us", content: CLINIC.email, action: `mailto:${CLINIC.email}` },
                  { icon: Clock, title: "Working Hours", content: CLINIC.hours, action: null },
                ].map(({ icon: Icon, title, content, action }) => (
                  <div key={title} className="flex gap-4 items-start">
                    <div className="w-11 h-11 rounded-lg bg-gold/10 flex items-center justify-center text-gold shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy">{title}</h3>
                      {action ? (
                        <a href={action} className="text-sm text-muted-foreground hover:text-gold transition-colors">{content}</a>
                      ) : (
                        <p className="text-sm text-muted-foreground">{content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button className="mt-8 bg-cta hover:bg-cta/90 text-cta-foreground" onClick={() => openWhatsApp()}>
                <MessageCircle className="w-4 h-4 mr-2" /> Chat on WhatsApp
              </Button>

              <div className="mt-8 aspect-video bg-accent rounded-xl flex items-center justify-center text-muted-foreground border">
                Google Maps Embed
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-navy mb-6">Send Us a Message</h2>
              {submitted ? (
                <div className="bg-cream rounded-xl p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-cta/10 flex items-center justify-center mx-auto mb-3"><CheckCircle className="w-6 h-6 text-cta" /></div>
                  <h3 className="font-heading text-xl font-bold text-navy">Message Sent!</h3>
                  <p className="text-sm text-muted-foreground mt-2">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Input placeholder="Full Name *" {...register("name")} className="text-base py-5" />
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message as string}</p>}
                  </div>
                  <div>
                    <Input placeholder="Email *" type="email" {...register("email")} className="text-base py-5" />
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message as string}</p>}
                  </div>
                  <div>
                    <Input placeholder="Phone Number *" type="tel" {...register("phone")} className="text-base py-5" />
                    {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message as string}</p>}
                  </div>
                  <div>
                    <Textarea placeholder="Your Message *" {...register("message")} className="min-h-[120px] text-base" />
                    {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message as string}</p>}
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-gold hover:bg-gold/90 text-gold-foreground font-semibold text-base py-5">
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1"><Lock className="w-3 h-3" /> 100% Confidential · We respect your privacy</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
