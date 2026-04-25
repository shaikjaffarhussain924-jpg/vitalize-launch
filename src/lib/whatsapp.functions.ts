import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

function normalizePhone(input: string): string {
  let digits = input.replace(/[^\d]/g, "");
  // Strip leading 0 (common in IN local format)
  if (digits.startsWith("0")) digits = digits.replace(/^0+/, "");
  // Default to India country code if missing (10-digit local number)
  if (digits.length === 10) digits = "91" + digits;
  return digits;
}

function altPhones(phone: string): string[] {
  // Backwards-compat: also match the old un-prefixed 10-digit format
  const set = new Set<string>([phone]);
  if (phone.startsWith("91") && phone.length === 12) set.add(phone.slice(2));
  return Array.from(set);
}

export const getWhatsAppThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { phone: string }) => {
    if (!input?.phone || typeof input.phone !== "string") {
      throw new Error("phone is required");
    }
    return { phone: normalizePhone(input.phone) };
  })
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const phones = altPhones(data.phone);
    const { data: messages, error } = await supabase
      .from("whatsapp_messages")
      .select("*")
      .in("phone", phones)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return { messages: messages ?? [] };
  });

export const sendWhatsAppMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { phone: string; body: string; leadId?: string; leadType?: "appointment" | "contact" }) => {
    if (!input?.phone || typeof input.phone !== "string") throw new Error("phone is required");
    if (!input?.body || typeof input.body !== "string" || input.body.length > 4000) throw new Error("body required (<=4000 chars)");
    return {
      phone: normalizePhone(input.phone),
      body: input.body,
      leadId: input.leadId,
      leadType: input.leadType,
    };
  })
  .handler(async ({ data }) => {
    const token = process.env.META_WA_ACCESS_TOKEN;
    const phoneId = process.env.META_WA_PHONE_NUMBER_ID;

    if (!token || !phoneId) {
      // Store locally even if Meta not yet configured, marked as failed
      await supabaseAdmin.from("whatsapp_messages").insert({
        phone: data.phone,
        direction: "out",
        body: data.body,
        status: "failed",
        error_message: "META_WA_ACCESS_TOKEN or META_WA_PHONE_NUMBER_ID not set",
        lead_id: data.leadId ?? null,
        lead_type: data.leadType ?? null,
      });
      return { success: false, error: "WhatsApp credentials not configured. Add them in project secrets." };
    }

    try {
      const res = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: data.phone,
          type: "text",
          text: { body: data.body },
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        const code = json?.error?.code;
        let errMsg = json?.error?.message || `Meta API error ${res.status}`;
        if (code === 131030) {
          errMsg = `Recipient +${data.phone} is not in your Meta WhatsApp test recipient list. While the app is in development mode, add this number under WhatsApp → API Setup → "To" → Manage phone number list, then verify it via the OTP Meta sends. Or publish your Meta app to message any number.`;
        } else if (code === 131026) {
          errMsg = `+${data.phone} is not a valid WhatsApp number, or hasn't messaged your business in the last 24 hours (free-form messages require a 24h window — use a template message otherwise).`;
        } else if (code === 190 || code === 102) {
          errMsg = `WhatsApp access token is invalid or expired. Generate a new permanent token in Meta and update the META_WA_ACCESS_TOKEN secret.`;
        }
        console.error("[WhatsApp send failed]", { phone: data.phone, code, status: res.status, message: json?.error?.message });
        await supabaseAdmin.from("whatsapp_messages").insert({
          phone: data.phone,
          direction: "out",
          body: data.body,
          status: "failed",
          error_message: errMsg,
          lead_id: data.leadId ?? null,
          lead_type: data.leadType ?? null,
        });
        return { success: false, error: errMsg };
      }

      const waId = json?.messages?.[0]?.id ?? null;
      await supabaseAdmin.from("whatsapp_messages").insert({
        phone: data.phone,
        direction: "out",
        body: data.body,
        status: "sent",
        wa_message_id: waId,
        lead_id: data.leadId ?? null,
        lead_type: data.leadType ?? null,
      });

      return { success: true, wa_message_id: waId };
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      await supabaseAdmin.from("whatsapp_messages").insert({
        phone: data.phone,
        direction: "out",
        body: data.body,
        status: "failed",
        error_message: errMsg,
        lead_id: data.leadId ?? null,
        lead_type: data.leadType ?? null,
      });
      return { success: false, error: errMsg };
    }
  });
