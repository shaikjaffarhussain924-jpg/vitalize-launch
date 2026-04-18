import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getContacts, updateContact } from "@/lib/contacts.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, X, Phone, Mail, MessageSquare } from "lucide-react";
import { WhatsAppThread } from "@/components/admin/WhatsAppThread";
import type { Database } from "@/integrations/supabase/types";

type Contact = Database["public"]["Tables"]["contact_submissions"]["Row"];
type CStatus = Database["public"]["Enums"]["contact_status"];

export const Route = createFileRoute("/admin/contacts")({
  component: AdminContacts,
});

const statusColors: Record<CStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  replied: "bg-amber-100 text-amber-800",
  closed: "bg-emerald-100 text-emerald-800",
};

function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<CStatus | "all">("all");
  const [selected, setSelected] = useState<Contact | null>(null);
  const [staffNotes, setStaffNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  const loadContacts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const result = await getContacts({
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      setContacts(result.contacts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
    const channel = supabase
      .channel('admin-contacts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_submissions' }, () => {
        loadContacts();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = contacts.filter((c) => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = async (id: string, status: CStatus) => {
    setUpdating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      await updateContact({
        data: { id, status },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      await loadContacts();
      if (selected?.id === id) setSelected({ ...selected, status });
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selected) return;
    setUpdating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      await updateContact({
        data: { id: selected.id, staff_notes: staffNotes },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      await loadContacts();
      setSelected({ ...selected, staff_notes: staffNotes });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold font-heading text-navy mb-6">Contact Submissions</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2">
          {(["all", "new", "replied", "closed"] as const).map((s) => (
            <Button key={s} size="sm" variant={filterStatus === s ? "default" : "outline"} onClick={() => setFilterStatus(s)} className="text-xs capitalize">
              {s}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-xl border p-4 animate-pulse">
              <div className="h-4 w-40 bg-muted rounded mb-2" />
              <div className="h-3 w-60 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No contacts found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((contact) => (
            <div
              key={contact.id}
              onClick={() => { setSelected(contact); setStaffNotes(contact.staff_notes || ""); }}
              className="bg-card rounded-xl border p-4 cursor-pointer hover:border-gold/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-navy">{contact.name}</h3>
                    <Badge className={`text-xs ${statusColors[contact.status]}`}>{contact.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{contact.message}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{contact.phone}</span>
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{contact.email}</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(contact.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-foreground/30 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-card w-full max-w-md h-full overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold font-heading text-navy">Contact Details</h2>
                <button onClick={() => setSelected(null)} className="p-1 hover:bg-accent rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Name</p>
                  <p className="font-semibold">{selected.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Phone</p>
                    <a href={`tel:${selected.phone}`} className="text-sm flex items-center gap-1 text-gold"><Phone className="w-3 h-3" />{selected.phone}</a>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <a href={`mailto:${selected.email}`} className="text-sm flex items-center gap-1 text-gold"><Mail className="w-3 h-3" />{selected.email}</a>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Message</p>
                  <p className="text-sm bg-muted/50 rounded-lg p-3">{selected.message}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Status</p>
                  <div className="flex gap-2">
                    {(["new", "replied", "closed"] as CStatus[]).map((s) => (
                      <Button key={s} size="sm" variant={selected.status === s ? "default" : "outline"} onClick={() => handleStatusChange(selected.id, s)} disabled={updating} className="text-xs capitalize">
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Staff Notes</p>
                  <Textarea value={staffNotes} onChange={(e) => setStaffNotes(e.target.value)} placeholder="Internal notes..." className="min-h-[80px]" />
                  <Button size="sm" onClick={handleSaveNotes} disabled={updating} className="mt-2 bg-navy hover:bg-navy/90 text-navy-foreground">
                    Save Notes
                  </Button>
                </div>

                {/* WhatsApp chat */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> WhatsApp Conversation
                  </p>
                  <WhatsAppThread phone={selected.phone} leadId={selected.id} leadType="contact" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
