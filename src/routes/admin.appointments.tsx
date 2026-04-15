import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAppointments, updateAppointment } from "@/lib/appointments.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, X, Phone, Mail, Calendar, Clock, MessageSquare } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
type Status = Database["public"]["Enums"]["appointment_status"];

export const Route = createFileRoute("/admin/appointments")({
  component: AdminAppointments,
});

const statusColors: Record<Status, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [staffNotes, setStaffNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  const loadAppointments = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const result = await getAppointments({
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      setAppointments(result.appointments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
    const channel = supabase
      .channel('admin-appointments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        loadAppointments();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = appointments.filter((a) => {
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.phone.includes(search);
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = async (id: string, status: Status) => {
    setUpdating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      await updateAppointment({
        data: { id, status },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      await loadAppointments();
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
      await updateAppointment({
        data: { id: selected.id, staff_notes: staffNotes },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      await loadAppointments();
      setSelected({ ...selected, staff_notes: staffNotes });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold font-heading text-navy mb-6">Appointments</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "pending", "confirmed", "completed", "cancelled"] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={filterStatus === s ? "default" : "outline"}
              onClick={() => setFilterStatus(s)}
              className="text-xs capitalize"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* List */}
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
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No appointments found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((appt) => (
            <div
              key={appt.id}
              onClick={() => { setSelected(appt); setStaffNotes(appt.staff_notes || ""); }}
              className="bg-card rounded-xl border p-4 cursor-pointer hover:border-gold/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-navy">{appt.name}</h3>
                    <Badge className={`text-xs ${statusColors[appt.status]}`}>{appt.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{appt.service}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{appt.preferred_date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{appt.preferred_time}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{appt.phone}</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(appt.created_at).toLocaleDateString()}
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
                <h2 className="text-lg font-bold font-heading text-navy">Appointment Details</h2>
                <button onClick={() => setSelected(null)} className="p-1 hover:bg-accent rounded-full"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Patient</p>
                  <p className="font-semibold">{selected.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Phone</p>
                    <a href={`tel:${selected.phone}`} className="text-sm flex items-center gap-1 text-gold"><Phone className="w-3 h-3" />{selected.phone}</a>
                  </div>
                  {selected.email && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Email</p>
                      <a href={`mailto:${selected.email}`} className="text-sm flex items-center gap-1 text-gold"><Mail className="w-3 h-3" />{selected.email}</a>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Service</p>
                    <p className="text-sm">{selected.service}</p>
                  </div>
                  {selected.doctor && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Doctor</p>
                      <p className="text-sm">{selected.doctor}</p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Date</p>
                    <p className="text-sm">{selected.preferred_date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Time</p>
                    <p className="text-sm">{selected.preferred_time}</p>
                  </div>
                </div>
                {selected.message && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Message</p>
                    <p className="text-sm bg-muted/50 rounded-lg p-3">{selected.message}</p>
                  </div>
                )}

                {/* Status change */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Status</p>
                  <div className="flex gap-2 flex-wrap">
                    {(["pending", "confirmed", "completed", "cancelled"] as Status[]).map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant={selected.status === s ? "default" : "outline"}
                        onClick={() => handleStatusChange(selected.id, s)}
                        disabled={updating}
                        className="text-xs capitalize"
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Staff notes */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Staff Notes</p>
                  <Textarea
                    value={staffNotes}
                    onChange={(e) => setStaffNotes(e.target.value)}
                    placeholder="Internal notes..."
                    className="min-h-[80px]"
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveNotes}
                    disabled={updating}
                    className="mt-2 bg-navy hover:bg-navy/90 text-navy-foreground"
                  >
                    Save Notes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
