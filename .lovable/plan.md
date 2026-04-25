# Fix: Meta webhook verification fails (404)

## Root cause
Two problems with the current webhook route at `/api/whatsapp/webhook`:

1. **It returns 404 in production.** Confirmed by hitting `https://vitalize-launch.lovable.app/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=poison9090&hub.challenge=test` → 404 HTML page.
2. **Routes under `/api/*` (but NOT `/api/public/*`) require auth on published Lovable sites.** Meta's verification request has no auth header, so even once deployed it would be rejected.

Both are fixed by moving the route under `/api/public/*`.

## Changes

### 1. Rename the route file
- Delete `src/routes/api.whatsapp.webhook.ts`
- Create `src/routes/api.public.whatsapp.webhook.ts` with the same handler logic, but `createFileRoute("/api/public/whatsapp/webhook")`

The handler code itself stays identical — Meta verify token check, inbound message storage with dedup, status updates, auto-link to lead by phone.

### 2. Republish
The new route only goes live after a publish. Once published, Meta's GET verification will receive the `hub.challenge` echo and succeed.

### 3. Update the Callback URL in Meta
After deploy, you change the URL in Meta Developer Dashboard from:
```
https://vitalize-launch.lovable.app/api/whatsapp/webhook
```
to:
```
https://vitalize-launch.lovable.app/api/public/whatsapp/webhook
```
Verify token stays `poison9090`. Then click **Verify and Save** → ✅. Then subscribe to `messages` field.

## What does NOT change
- `META_WA_VERIFY_TOKEN`, `META_WA_ACCESS_TOKEN`, `META_WA_PHONE_NUMBER_ID` secrets — already set correctly
- The admin chat UI (`WhatsAppThread.tsx`)
- Outbound send flow (`whatsapp.functions.ts`) — that's a server function, not a public route, so it stays where it is
- Database schema

## Verification after deploy
I'll re-hit the new URL with the verify-token query string and confirm it echoes back the challenge with HTTP 200, before you click Verify in Meta.
