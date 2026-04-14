"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const steps = [
  { id: "personal", title: "Your Info" },
  { id: "concern", title: "Health Concern" },
  { id: "preferences", title: "Preferences" },
  { id: "schedule", title: "Schedule" },
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  concern: string;
  department: string;
  symptoms: string;
  preferredDoctor: string;
  visitType: string;
  previousVisit: string;
  preferredDate: string;
  preferredTime: string;
  insurance: string;
  additionalInfo: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const contentVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
};

const MultistepConsultationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    concern: "",
    department: "",
    symptoms: "",
    preferredDoctor: "",
    visitType: "",
    previousVisit: "",
    preferredDate: "",
    preferredTime: "",
    insurance: "",
    additionalInfo: "",
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Consultation request submitted! We'll contact you shortly.");
      setIsSubmitting(false);
    }, 1500);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.name.trim() !== "" && formData.phone.trim() !== "";
      case 1:
        return formData.department !== "";
      case 2:
        return formData.visitType !== "";
      case 3:
        return formData.preferredDate !== "" && formData.preferredTime !== "";
      default:
        return true;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <motion.button
                type="button"
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 border-2",
                  index < currentStep
                    ? "bg-gold text-gold-foreground border-gold"
                    : index === currentStep
                      ? "bg-navy text-navy-foreground border-gold"
                      : "bg-muted text-muted-foreground border-border"
                )}
                onClick={() => {
                  if (index <= currentStep) setCurrentStep(index);
                }}
                whileTap={{ scale: 0.95 }}
              >
                {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
              </motion.button>
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2">
                  <div className={cn(
                    "h-1 rounded-full transition-all duration-500",
                    index < currentStep ? "bg-gold" : "bg-border"
                  )} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <span key={step.id} className={cn(
              "text-xs transition-colors",
              index <= currentStep ? "text-gold font-medium" : "text-muted-foreground"
            )}>
              {step.title}
            </span>
          ))}
        </div>
      </div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="border-2 border-border/50 shadow-lg bg-card">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Step 1: Personal Info */}
                {currentStep === 0 && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-navy font-heading">Your Information</CardTitle>
                      <CardDescription>Help us know who you are</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => updateFormData("name", e.target.value)}
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => updateFormData("phone", e.target.value)}
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="email">Email (Optional)</Label>
                        <Input
                          id="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => updateFormData("email", e.target.value)}
                        />
                      </motion.div>
                    </CardContent>
                  </>
                )}

                {/* Step 2: Health Concern */}
                {currentStep === 1 && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-navy font-heading">Health Concern</CardTitle>
                      <CardDescription>Tell us about your health needs</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label>Department *</Label>
                        <Select
                          value={formData.department}
                          onValueChange={(value) => updateFormData("department", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Medicine</SelectItem>
                            <SelectItem value="cardiology">Cardiology</SelectItem>
                            <SelectItem value="dermatology">Dermatology</SelectItem>
                            <SelectItem value="orthopedics">Orthopedics</SelectItem>
                            <SelectItem value="pediatrics">Pediatrics</SelectItem>
                            <SelectItem value="gynecology">Gynecology</SelectItem>
                            <SelectItem value="ent">ENT</SelectItem>
                            <SelectItem value="dental">Dental</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="symptoms">Describe your symptoms</Label>
                        <Textarea
                          id="symptoms"
                          placeholder="Brief description of your symptoms or concern"
                          value={formData.symptoms}
                          onChange={(e) => updateFormData("symptoms", e.target.value)}
                          className="min-h-[80px]"
                        />
                      </motion.div>
                    </CardContent>
                  </>
                )}

                {/* Step 3: Preferences */}
                {currentStep === 2 && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-navy font-heading">Visit Preferences</CardTitle>
                      <CardDescription>How would you like to consult?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label>Visit Type *</Label>
                        <RadioGroup
                          value={formData.visitType}
                          onValueChange={(value) => updateFormData("visitType", value)}
                          className="space-y-2"
                        >
                          {[
                            { value: "in-person", label: "In-Person Visit" },
                            { value: "video", label: "Video Consultation" },
                            { value: "phone", label: "Phone Consultation" },
                          ].map((type, index) => (
                            <motion.div
                              key={type.value}
                              className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-accent transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0, transition: { delay: 0.1 * index, duration: 0.3 } }}
                            >
                              <RadioGroupItem value={type.value} id={`type-${index}`} />
                              <Label htmlFor={`type-${index}`} className="cursor-pointer w-full">{type.label}</Label>
                            </motion.div>
                          ))}
                        </RadioGroup>
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label>Have you visited us before?</Label>
                        <RadioGroup
                          value={formData.previousVisit}
                          onValueChange={(value) => updateFormData("previousVisit", value)}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="prev-yes" />
                            <Label htmlFor="prev-yes" className="cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="prev-no" />
                            <Label htmlFor="prev-no" className="cursor-pointer">No, first time</Label>
                          </div>
                        </RadioGroup>
                      </motion.div>
                    </CardContent>
                  </>
                )}

                {/* Step 4: Schedule */}
                {currentStep === 3 && (
                  <>
                    <CardHeader>
                      <CardTitle className="text-navy font-heading">Schedule</CardTitle>
                      <CardDescription>Pick your preferred date and time</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="preferredDate">Preferred Date *</Label>
                        <Input
                          id="preferredDate"
                          type="date"
                          value={formData.preferredDate}
                          onChange={(e) => updateFormData("preferredDate", e.target.value)}
                        />
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label>Preferred Time *</Label>
                        <Select
                          value={formData.preferredTime}
                          onValueChange={(value) => updateFormData("preferredTime", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select time slot" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                            <SelectItem value="afternoon">Afternoon (12 PM - 3 PM)</SelectItem>
                            <SelectItem value="evening">Evening (3 PM - 6 PM)</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="additionalInfo">Additional Notes</Label>
                        <Textarea
                          id="additionalInfo"
                          placeholder="Any additional information for the doctor"
                          value={formData.additionalInfo}
                          onChange={(e) => updateFormData("additionalInfo", e.target.value)}
                          className="min-h-[80px]"
                        />
                      </motion.div>
                    </CardContent>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <CardFooter className="flex justify-between pt-6 pb-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1 rounded-full border-navy text-navy"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  onClick={currentStep === steps.length - 1 ? handleSubmit : nextStep}
                  disabled={!isStepValid() || isSubmitting}
                  className="flex items-center gap-1 rounded-full bg-gold hover:bg-gold/90 text-gold-foreground shadow-[0_4px_15px_-3px_oklch(0.72_0.10_75/0.4)]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      {currentStep === steps.length - 1 ? "Submit" : "Next"}
                      {currentStep === steps.length - 1 ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </>
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          </div>
        </Card>
      </motion.div>

      <motion.div
        className="mt-4 text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
      </motion.div>
    </div>
  );
};

export default MultistepConsultationForm;
