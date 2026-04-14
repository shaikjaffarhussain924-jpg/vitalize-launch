import { CLINIC, WHATSAPP_LINKS } from "./constants";
import { trackContact } from "./analytics";

export function openWhatsApp(type: keyof typeof WHATSAPP_LINKS | string = "general") {
  trackContact();
  const url = typeof WHATSAPP_LINKS[type as keyof typeof WHATSAPP_LINKS] === "string"
    ? WHATSAPP_LINKS[type as keyof typeof WHATSAPP_LINKS] as string
    : WHATSAPP_LINKS.general;
  window.open(url, "_blank");
}

export function openWhatsAppService(serviceName: string) {
  trackContact();
  window.open(WHATSAPP_LINKS.service(serviceName), "_blank");
}

export function openWhatsAppBooking(name?: string) {
  trackContact();
  const text = name
    ? `Hi, I just booked an appointment. My name is ${name}.`
    : "Hi, I just booked an appointment. Please confirm.";
  window.open(`https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
}

export function getCallLink() {
  return `tel:${CLINIC.phone.replace(/[^+\d]/g, "")}`;
}
