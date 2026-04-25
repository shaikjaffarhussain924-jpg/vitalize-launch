import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

function normalizePhone(input: string): string {
  return input.replace(/[^\d]/g, "");
}

async function autoLinkLead(phone: string): Promise<{ lead_id: string | null; lead_type: string | null }> {
  // Try appointments first (most recent)
  const { data: appt } = await supabaseAdmin
    .from("appointments")
    .select("id")
    .ilike("phone", `%${phone.slice(-10)}%`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (appt) return { lead_id: appt.id, lead_type: "appointment" };

  const { data: contact } = await supabaseAdmin
    .from("contact_submissions")
    .select("id")
    .ilike("phone", `%${phone.slice(-10)}%`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (contact) return { lead_id: contact.id, lead_type: "contact" };

  return { lead_id: null, lead_type: null };
}

export const Route = createFileRoute("/api/public/whatsapp/webhook")({
  server: {
    handlers: {
      // Meta verification handshake
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const mode = url.searchParams.get("hub.mode");
        const token = url.searchParams.get("hub.verify_token");
        const challenge = url.searchParams.get("hub.challenge");
        const verifyToken = process.env.META_WA_VERIFY_TOKEN;

        if (mode === "subscribe" && token && verifyToken && token === verifyToken) {
          return new Response(challenge ?? "", { status: 200 });
        }
        return new Response("Forbidden", { status: 403 });
      },

      // Inbound messages + status updates from Meta
      POST: async ({ request }) => {
        try {
          const payload = await request.json();
          const entries = payload?.entry ?? [];

          for (const entry of entries) {
            const changes = entry?.changes ?? [];
            for (const change of changes) {
              const value = change?.value ?? {};

              // Inbound messages
              const messages = value?.messages ?? [];
              for (const msg of messages) {
                const phone = normalizePhone(msg?.from ?? "");
                const waId = msg?.id;
                const text = msg?.text?.body ?? msg?.button?.text ?? msg?.interactive?.button_reply?.title ?? "[unsupported message type]";
                if (!phone || !waId) continue;

                // Dedupe by wa_message_id
                const { data: existing } = await supabaseAdmin
                  .from("whatsapp_messages")
                  .select("id")
                  .eq("wa_message_id", waId)
                  .maybeSingle();
                if (existing) continue;

                const { lead_id, lead_type } = await autoLinkLead(phone);

                await supabaseAdmin.from("whatsapp_messages").insert({
                  phone,
                  direction: "in",
                  body: text,
                  wa_message_id: waId,
                  status: "received",
                  lead_id,
                  lead_type,
                });
              }

              // Status updates (delivered/read) — best-effort, ignore errors
              const statuses = value?.statuses ?? [];
              for (const st of statuses) {
                const waId = st?.id;
                const status = st?.status;
                if (!waId || !status) continue;
                await supabaseAdmin
                  .from("whatsapp_messages")
                  .update({ status })
                  .eq("wa_message_id", waId);
              }
            }
          }

          return new Response("OK", { status: 200 });
        } catch (err) {
          console.error("WhatsApp webhook error:", err);
          // Return 200 anyway so Meta doesn't retry-storm us
          return new Response("OK", { status: 200 });
        }
      },
    },
  },
});
