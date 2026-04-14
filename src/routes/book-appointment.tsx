import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle, Shield, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GetStartedButton } from "@/components/ui/get-started-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CLINIC, SERVICES, DOCTORS } from "@/lib/constants";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitToWeb3Forms } from "@/lib/forms";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  phone: z.string().min(10, "Valid phone required").max(15),
  email: z.string().email("Valid email required").max(255).or(z.literal("")),
  service: z.string().min(1, "Select a service"),
  doctor: z.string().optional(),
  date: z.string().min(1, "Select a date"),
  time: z.string().min(1, "Select a time slot"),
  message: z.string().max(500).optional(),
  source: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export const Route = createFileRoute("/book-appointment")({
  head: () => ({
    meta: [
      { title: `Book Appointment | ${CLINIC.name} — ${CLINIC.city}` },
      { name: "description", content: `Book your appointment at ${CLINIC.name}. Free consultation, NABH accredited, 25+ expert doctors in ${CLINIC.city}.` },
      { property: "og:title", content: `Book Appointment | ${CLINIC.name}` },
      { property: "og:description", content: `Schedule your consultation with expert doctors.` },
    ],
  }),
  component: BookingPage,
});

function BookingPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, trigger } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", message: "", source: "" },
  });

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"];

  const nextStep = async () => {
    const valid = await trigger(["name", "phone", "service", "date", "time"]);
    if (valid) setStep(2);
  };

  const onSubmit = async (data: FormData) => {
    await submitToWeb3Forms(data as any, "Booking Page - New Appointment");
    setSubmitted(true);
    setStep(3);
    setTimeout(() => navigate({ to: "/thank-you" }), 3000);
  };

  return (
    <div>
      <section className="bg-cream py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Breadcrumb items={[{ label: "Book Appointment" }]} />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-navy text-center">Book Your Appointment</h1>
          <p className="text-center text-muted-foreground mt-2">Free consultation • No hidden charges</p>

          {/* Progress */}
          <div className="flex items-center justify-center mt-8 gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= s ? "bg-gold text-gold-foreground" : "bg-accent text-muted-foreground"
                }`}>
                  {step > s ? "✓" : s}
                </div>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {s === 1 ? "Details" : s === 2 ? "Confirm" : "Done"}
                </span>
                {s < 3 && <div className={`w-12 h-0.5 ${step > s ? "bg-gold" : "bg-border"}`} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4">
          {step === 3 || submitted ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-cta/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-cta" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-navy">Appointment Requested</h2>
              <p className="text-muted-foreground mt-2">Dr. will confirm shortly. Redirecting to WhatsApp...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="bg-card rounded-2xl border p-6 md:p-8 shadow-sm">
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="font-heading text-xl font-semibold text-navy mb-4">Your Details</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Full Name *</label>
                      <Input {...register("name")} className="text-base py-5" />
                      {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Mobile Number *</label>
                      <Input type="tel" {...register("phone")} className="text-base py-5" />
                      {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email (optional)</label>
                    <Input type="email" {...register("email")} className="text-base py-5" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Service *</label>
                      <select {...register("service")} className="flex h-11 w-full rounded-md border bg-background px-3 py-2 text-sm">
                        <option value="">Select service</option>
                        {SERVICES.map((s) => <option key={s.slug} value={s.name}>{s.name}</option>)}
                      </select>
                      {errors.service && <p className="text-xs text-destructive mt-1">{errors.service.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Preferred Doctor</label>
                      <select {...register("doctor")} className="flex h-11 w-full rounded-md border bg-background px-3 py-2 text-sm">
                        <option value="">Any available</option>
                        {DOCTORS.map((d) => <option key={d.id} value={d.name}>{d.name} — {d.specialization}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Preferred Date *</label>
                      <Input type="date" {...register("date")} className="text-base py-5" />
                      {errors.date && <p className="text-xs text-destructive mt-1">{errors.date.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Time Slot *</label>
                      <select {...register("time")} className="flex h-11 w-full rounded-md border bg-background px-3 py-2 text-sm">
                        <option value="">Select time</option>
                        {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      {errors.time && <p className="text-xs text-destructive mt-1">{errors.time.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Message (optional)</label>
                    <Textarea {...register("message")} placeholder="Any specific concerns..." className="min-h-[80px]" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">How did you hear about us?</label>
                    <select {...register("source")} className="flex h-11 w-full rounded-md border bg-background px-3 py-2 text-sm">
                      <option value="">Select</option>
                      <option>Google Search</option>
                      <option>Facebook/Instagram Ad</option>
                      <option>WhatsApp</option>
                      <option>Friend/Family Referral</option>
                      <option>Doctor Referral</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <GetStartedButton type="button" onClick={nextStep} className="w-full bg-gold hover:bg-gold/90 text-gold-foreground font-semibold text-base py-5">
                    Continue
                  </GetStartedButton>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="font-heading text-xl font-semibold text-navy mb-4">Confirm Your Booking</h2>
                  <div className="bg-cream rounded-lg p-4 space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {watch("name")}</p>
                    <p><span className="font-medium">Phone:</span> {watch("phone")}</p>
                    <p><span className="font-medium">Service:</span> {watch("service")}</p>
                    <p><span className="font-medium">Date:</span> {watch("date")}</p>
                    <p><span className="font-medium">Time:</span> {watch("time")}</p>
                    {watch("doctor") && <p><span className="font-medium">Doctor:</span> {watch("doctor")}</p>}
                  </div>
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                    <Button type="submit" disabled={isSubmitting} className="flex-1 bg-cta hover:bg-cta/90 text-cta-foreground font-semibold py-5">
                      {isSubmitting ? "Booking..." : "Confirm Booking ✓"}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* Trust signals */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: Shield, text: "Your data is safe" },
              { icon: CreditCard, text: "Free consultation" },
              { icon: Clock, text: "No hidden charges" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="w-3.5 h-3.5" /> {text}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
