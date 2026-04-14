import { CLINIC } from "./constants";
import { trackLead } from "./analytics";

function getUTMParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const stored = sessionStorage.getItem("utm_params");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export async function submitToWeb3Forms(data: Record<string, string>, subject: string = "New Appointment Lead") {
  const utm = getUTMParams();
  
  const payload = {
    access_key: CLINIC.web3formsKey,
    subject,
    from_name: CLINIC.name,
    ...data,
    utm_source: utm.utm_source || "",
    utm_medium: utm.utm_medium || "",
    utm_campaign: utm.utm_campaign || "",
  };

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (result.success) {
      trackLead(subject);
    }
    return result;
  } catch (error) {
    console.error("Form submission error:", error);
    return { success: false };
  }
}
