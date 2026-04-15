import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle, Shield, Clock, CreditCard, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { CalendarScheduler } from "@/components/ui/calendar-scheduler";
import { Button } from "@/components/ui/button";
import { GetStartedButton } from "@/components/ui/get-started-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CLINIC, SERVICES, DOCTORS } from "@/lib/constants";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitAppointment } from "@/lib/appointments.functions";
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

interface DropdownSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { label: string; value: string }[];
}

function DropdownSelect({ value, onChange, placeholder, options }: DropdownSelectProps) {
  const selectedLabel = options.find(o => o.value === value)?.label;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between h-11 text-sm font-normal"
        >
          <span className={selectedLabel ? "text-foreground" : "text-muted-foreground"}>
            {selectedLabel || placeholder}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[var(--radix-dropdown-menu-trigger-width)]"
        align="start"
      >
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="cursor-pointer"
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function BookingPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, trigger, control } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", message: "", source: "", service: "", doctor: "", time: "" },
  });

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"];

  const serviceOptions = SERVICES.map(s => ({ label: s.name, value: s.name }));
  const doctorOptions = [
    { label: "Any available", value: "" },
    ...DOCTORS.map(d => ({ label: `${d.name} — ${d.specialization}`, value: d.name })),
  ];
  const timeOptions = timeSlots.map(t => ({ label: t, value: t }));
  const sourceOptions = [
    { label: "Google Search", value: "Google Search" },
    { label: "Facebook/Instagram Ad", value: "Facebook/Instagram Ad" },
    { label: "WhatsApp", value: "WhatsApp" },
    { label: "Friend/Family Referral", value: "Friend/Family Referral" },
    { label: "Doctor Referral", value: "Doctor Referral" },
    { label: "Other", value: "Other" },
  ];

  const nextStep = async () => {
    const valid = await trigger(["name", "phone", "service", "date", "time"]);
    if (valid) setStep(2);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const result = await submitAppointment({
        data: {
          name: data.name,
          phone: data.phone,
          email: data.email || "",
          service: data.service,
          doctor: data.doctor,
          preferred_date: data.date,
          preferred_time: data.time,
          message: data.message,
          source: data.source,
        },
      });
      if (result.success) {
        setSubmitted(true);
        setStep(3);
        setTimeout(() => navigate({ to: "/thank-you" }), 3000);
      }
    } catch (err) {
      console.error("Booking error:", err);
    }
  };

  return (
    <div>
      <section className="bg-navy py-12">
        <div className="max-w-3xl mx-auto px-4">
          <Breadcrumb items={[{ label: "Book Appointment" }]} />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-navy-foreground text-center">Book Your Appointment</h1>
          <p className="text-center text-navy-foreground/70 mt-2">Free consultation • No hidden charges</p>

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
                      <Controller
                        name="service"
                        control={control}
                        render={({ field }) => (
                          <DropdownSelect
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select service"
                            options={serviceOptions}
                          />
                        )}
                      />
                      {errors.service && <p className="text-xs text-destructive mt-1">{errors.service.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Preferred Doctor</label>
                      <Controller
                        name="doctor"
                        control={control}
                        render={({ field }) => (
                          <DropdownSelect
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Any available"
                            options={doctorOptions}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Preferred Date & Time *</label>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field: dateField }) => (
                        <Controller
                          name="time"
                          control={control}
                          render={({ field: timeField }) => (
                            <CalendarScheduler
                              showCard={false}
                              selectedDate={dateField.value ? new Date(dateField.value) : undefined}
                              selectedTime={timeField.value}
                              onDateChange={(d) => dateField.onChange(d ? format(d, "yyyy-MM-dd") : "")}
                              onTimeChange={(t) => timeField.onChange(t)}
                            />
                          )}
                        />
                      )}
                    />
                    {errors.date && <p className="text-xs text-destructive mt-1">{errors.date.message}</p>}
                    {errors.time && <p className="text-xs text-destructive mt-1">{errors.time.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Message (optional)</label>
                    <Textarea {...register("message")} placeholder="Any specific concerns..." className="min-h-[80px]" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">How did you hear about us?</label>
                    <Controller
                      name="source"
                      control={control}
                      render={({ field }) => (
                        <DropdownSelect
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Select"
                          options={sourceOptions}
                        />
                      )}
                    />
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
