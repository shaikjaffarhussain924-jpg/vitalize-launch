import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitToWeb3Forms } from "@/lib/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  phone: z.string().min(10, "Valid phone required").max(15),
});

type FormData = z.infer<typeof schema>;

export function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Check cookie
    const dismissed = document.cookie.includes("exit_popup_dismissed=true");
    if (dismissed) return;

    let timer: ReturnType<typeof setTimeout>;

    // Desktop: mouse leave
    const handleMouseOut = (e: MouseEvent) => {
      if (e.clientY < 10 && !show) {
        setShow(true);
      }
    };

    // Mobile: after 30s
    timer = setTimeout(() => {
      if (!dismissed) setShow(true);
    }, 30000);

    document.addEventListener("mouseout", handleMouseOut);
    return () => {
      document.removeEventListener("mouseout", handleMouseOut);
      clearTimeout(timer);
    };
  }, [show]);

  const dismiss = () => {
    setShow(false);
    document.cookie = "exit_popup_dismissed=true; max-age=604800; path=/";
  };

  const onSubmit = async (data: FormData) => {
    await submitToWeb3Forms({ name: data.name, phone: data.phone }, "Exit Intent - ₹500 OFF Offer");
    setSubmitted(true);
    setTimeout(dismiss, 3000);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 backdrop-blur-sm animate-fade-in px-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        <button onClick={dismiss} className="absolute top-3 right-3 p-1 hover:bg-accent rounded-full">
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-cta/10 flex items-center justify-center mx-auto mb-3"><CheckCircle className="w-6 h-6 text-cta" /></div>
            <h3 className="font-heading text-xl font-bold">Offer Claimed!</h3>
            <p className="text-sm text-muted-foreground mt-2">We'll call you shortly with your ₹500 discount code.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-2"><Clock className="w-5 h-5 text-gold" /></div>
              <h3 className="font-heading text-2xl font-bold text-navy">Wait! Get ₹500 OFF</h3>
              <p className="text-sm text-muted-foreground mt-1">Your first consultation — Limited time offer</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <Input placeholder="Your Name" {...register("name")} className="text-base" />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Input placeholder="Phone Number" type="tel" {...register("phone")} className="text-base" />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-gold hover:bg-gold/90 text-gold-foreground font-semibold text-base py-5">
                {isSubmitting ? "Claiming..." : "Claim ₹500 OFF →"}
              </Button>
              <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1"><Lock className="w-3 h-3" /> 100% Confidential · No spam</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
