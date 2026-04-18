

# WhatsApp Inbox Inside CRM (Meta Cloud API)

Click any lead → opens a WhatsApp-style chat panel inside the admin → shows full message history with that phone number → admin types and sends → message delivers on real WhatsApp → replies stream back live.

## Architecture

```text
Customer's WhatsApp
        ↕
   Meta Cloud API
        ↕
  /api/whatsapp/webhook  ← inbound messages
        ↕
  whatsapp_messages table (Supabase + Realtime)
        ↕
  Admin CRM <WhatsAppThread/>  ← live chat UI + composer
        ↕
  sendWhatsAppMessage server fn → Meta Graph API → customer's phone
```

## Phase 1 — Database (migration)

New table `whatsapp_messages`:
- `id` uuid PK
- `phone` text NOT NULL (indexed) — normalized E.164, used to thread by lead
- `direction` text — 'in' | 'out'
- `body` text
- `wa_message_id` text UNIQUE — Meta's ID, prevents duplicate inserts from webhook retries
- `status` text — 'received' | 'sent' | 'delivered' | 'read' | 'failed'
- `lead_id` uuid NULL, `lead_type` text NULL — soft link to appointment/contact
- `created_at` timestamptz
- RLS: SELECT + INSERT for admin/staff only; webhook uses service role
- Add to realtime publication

## Phase 2 — Meta Cloud API wiring

### Secrets to request after plan approval
- `META_WA_ACCESS_TOKEN` — permanent System User token
- `META_WA_PHONE_NUMBER_ID` — sender phone number ID
- `META_WA_VERIFY_TOKEN` — random string you choose, pasted into Meta dashboard

### Server route `src/routes/api/whatsapp.webhook.ts`
- `GET` — Meta verification handshake (returns `hub.challenge` if verify token matches)
- `POST` — parses inbound payload, normalizes phone, dedupes by `wa_message_id`, inserts row with `direction='in'`, auto-links to most recent appointment/contact with same phone

### Server function `src/lib/whatsapp.functions.ts`
- `sendWhatsAppMessage({ phone, body, leadId?, leadType? })` — admin/staff gated, POSTs to `https://graph.facebook.com/v20.0/{PHONE_NUMBER_ID}/messages`, stores outbound row
- `getThread(phone)` — returns all messages for a phone, ordered by time

## Phase 3 — Chat UI

### `src/components/admin/WhatsAppThread.tsx`
- WhatsApp-style bubbles: inbound left/grey, outbound right/green
- Shows date separators + status ticks (✓ sent, ✓✓ delivered/read)
- Realtime subscription on `whatsapp_messages` filtered by phone — new messages appear instantly without refresh
- Composer at bottom: textarea + Send button (Enter to send, Shift+Enter newline)
- Empty state: "No messages yet — send the first one to start the conversation"
- Auto-scroll to latest on new message

### Wire into existing admin drawers
- `admin.appointments.tsx` detail drawer → add tab "WhatsApp Chat" rendering `<WhatsAppThread phone={selected.phone} leadId={selected.id} leadType="appointment" />`
- `admin.contacts.tsx` detail drawer → same
- Add a small green WhatsApp icon next to the lead's phone in the row → indicates chat exists / unread count

## Phase 4 — Meta dashboard setup (you do this once after I build it)

1. meta business → create WhatsApp Business app
2. Add test number (free) or verify your business number
3. Generate permanent access token (System User → assign WhatsApp asset)
4. Webhook config:
   - Callback URL: `https://vitalize-launch.lovable.app/api/whatsapp/webhook`
   - Verify token: same string you pasted as `META_WA_VERIFY_TOKEN`
   - Subscribe to `messages` field
5. Done — inbound messages start flowing into the CRM

## Files

**New:**
- `supabase/migrations/{ts}_whatsapp_messages.sql`
- `src/routes/api/whatsapp.webhook.ts`
- `src/lib/whatsapp.functions.ts` (rename existing `whatsapp.ts` helper or merge)
- `src/components/admin/WhatsAppThread.tsx`

**Edited:**
- `src/routes/admin.appointments.tsx` — add WhatsApp tab in drawer
- `src/routes/admin.contacts.tsx` — add WhatsApp tab in drawer

## Notes

- The 24-hour rule: Meta only allows free-form replies within 24h of customer's last message. Outside that window you can only send pre-approved template messages. The composer will warn when outside window (Phase 1 sends free-form; templates can be added later).
- No new dependencies needed (uses fetch + existing Supabase realtime).
- This plan is the chat-history piece only. Lead scoring (Hot/Warm/Cold + AI) from earlier is a separate build — say the word and I'll bundle both.

