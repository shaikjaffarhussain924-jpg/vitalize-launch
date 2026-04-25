import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getWhatsAppThread, sendWhatsAppMessage } from "@/lib/whatsapp.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Check, CheckCheck, AlertCircle, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type WAMessage = Database["public"]["Tables"]["whatsapp_messages"]["Row"];

interface Props {
  phone: string;
  leadId?: string;
  leadType?: "appointment" | "contact";
}

function normalizePhone(input: string): string {
  let digits = input.replace(/[^\d]/g, "");
  if (digits.startsWith("0")) digits = digits.replace(/^0+/, "");
  if (digits.length === 10) digits = "91" + digits;
  return digits;
}

function phoneVariants(phone: string): string[] {
  const set = new Set<string>([phone]);
  if (phone.startsWith("91") && phone.length === 12) set.add(phone.slice(2));
  if (phone.length === 10) set.add("91" + phone);
  return Array.from(set);
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDateLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
}

export function WhatsAppThread({ phone, leadId, leadType }: Props) {
  const normalizedPhone = normalizePhone(phone);
  const [messages, setMessages] = useState<WAMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const result = await getWhatsAppThread({
        data: { phone: normalizedPhone },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      setMessages(result.messages as WAMessage[]);
    } catch (err) {
      console.error("Failed to load WhatsApp thread:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    load();

    const variants = phoneVariants(normalizedPhone);
    const channel = supabase
      .channel(`wa-thread-${normalizedPhone}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "whatsapp_messages", filter: `phone=in.(${variants.join(",")})` },
        () => { load(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedPhone]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const result = await sendWhatsAppMessage({
        data: { phone: normalizedPhone, body, leadId, leadType },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!result.success) {
        toast.error("Failed to send", { description: result.error });
      } else {
        setText("");
        toast.success("Message sent");
      }
      await load();
    } catch (err) {
      toast.error("Send error", { description: err instanceof Error ? err.message : "Unknown" });
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group by date
  const grouped: { label: string; items: WAMessage[] }[] = [];
  let currentLabel = "";
  for (const m of messages) {
    const label = formatDateLabel(m.created_at);
    if (label !== currentLabel) {
      grouped.push({ label, items: [m] });
      currentLabel = label;
    } else {
      grouped[grouped.length - 1].items.push(m);
    }
  }

  return (
    <div className="flex flex-col h-[500px] rounded-xl border bg-[#efeae2] overflow-hidden">
      {/* Header */}
      <div className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <MessageCircle className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">+{normalizedPhone}</p>
          <p className="text-xs text-white/70">WhatsApp chat</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23efeae2'/%3E%3Ccircle cx='20' cy='20' r='1' fill='%23d9d2c7'/%3E%3C/svg%3E\")" }}>
        {loading ? (
          <p className="text-center text-xs text-muted-foreground py-8">Loading messages…</p>
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-10 h-10 mx-auto mb-2 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No messages yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Send the first message to start the conversation</p>
          </div>
        ) : (
          grouped.map((group) => (
            <div key={group.label} className="space-y-2">
              <div className="flex justify-center">
                <span className="text-[10px] bg-white/80 text-gray-600 px-2 py-1 rounded-md shadow-sm">{group.label}</span>
              </div>
              {group.items.map((m) => {
                const isOut = m.direction === "out";
                return (
                  <div key={m.id} className={`flex ${isOut ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] px-3 py-2 rounded-lg shadow-sm ${
                        isOut ? "bg-[#dcf8c6] text-gray-900" : "bg-white text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{m.body}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[10px] text-gray-500">{formatTime(m.created_at)}</span>
                        {isOut && (
                          <>
                            {m.status === "failed" ? (
                              <AlertCircle className="w-3 h-3 text-red-500" />
                            ) : m.status === "read" ? (
                              <CheckCheck className="w-3 h-3 text-blue-500" />
                            ) : m.status === "delivered" ? (
                              <CheckCheck className="w-3 h-3 text-gray-500" />
                            ) : (
                              <Check className="w-3 h-3 text-gray-500" />
                            )}
                          </>
                        )}
                      </div>
                      {m.status === "failed" && m.error_message && (
                        <p className="text-[10px] text-red-600 mt-1">{m.error_message}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Composer */}
      <div className="bg-[#f0f0f0] border-t px-3 py-2 flex items-end gap-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          className="flex-1 min-h-[40px] max-h-[120px] resize-none bg-white"
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={!text.trim() || sending}
          size="icon"
          className="bg-[#075e54] hover:bg-[#064c44] text-white shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
