## What I found

The CRM is still trying to send WhatsApp messages to `9640456448`, but Meta rejected every attempt with:

`(#131030) Recipient phone number not in allowed list`

The likely cause is the number format. Your appointment/contact records store the phone as a local 10-digit number (`9640456448`), but WhatsApp Cloud API expects the full international format for India: `919640456448`.

So even if you added `+91 96404 56448` in Meta’s test recipient list, the app is sending `9640456448`, which Meta treats as a different/invalid recipient.

## Plan to fix

1. **Normalize Indian phone numbers before sending**
   - If a CRM phone number is 10 digits, automatically prepend `91`.
   - If it already includes a country code, keep it normalized.
   - Use the same normalized format for loading/saving CRM chat messages.

2. **Make chat lookup backwards-compatible**
   - Existing failed records are stored as `9640456448`.
   - After the fix, new messages will store as `919640456448`.
   - I’ll update the chat thread query so it can show both formats for the same lead/phone where needed.

3. **Improve the error shown in the CRM**
   - If Meta returns `#131030`, show a clearer message explaining that the selected recipient must be added/verified in the Meta WhatsApp API test recipient list and must match the full country-code number.

4. **Add lightweight server logging for WhatsApp sends**
   - Log the normalized recipient number and Meta error code/message, without logging the token.
   - This will make future WhatsApp issues easier to diagnose.

## Technical details

Files to update:
- `src/lib/whatsapp.functions.ts`
- `src/components/admin/WhatsAppThread.tsx`

Core change:
```text
9640456448        -> 919640456448
+91 96404 56448  -> 919640456448
```

No database schema changes are needed.