import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarDays, MessageSquare, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getDashboardStats } from "@/lib/contacts.functions";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    newContacts: 0,
    pendingAppointments: 0,
    todayAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const result = await getDashboardStats({
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        setStats(result);
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = [
    { label: "Total Appointments", value: stats.totalAppointments, icon: CalendarDays, color: "text-blue-600 bg-blue-50" },
    { label: "Pending Bookings", value: stats.pendingAppointments, icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "Today's Bookings", value: stats.todayAppointments, icon: Users, color: "text-emerald-600 bg-emerald-50" },
    { label: "New Contacts", value: stats.newContacts, icon: MessageSquare, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold font-heading text-navy mb-6">Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-xl border p-5 animate-pulse">
              <div className="h-4 w-20 bg-muted rounded mb-3" />
              <div className="h-8 w-12 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-card rounded-xl border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-navy">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
