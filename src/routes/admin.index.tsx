import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  MessageSquare,
  Clock,
  Users,
  XCircle,
  CheckCircle2,
  TrendingUp,
  IndianRupee,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getDashboardStats } from "@/lib/contacts.functions";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

interface UpcomingAppointment {
  id: string;
  name: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
}

interface DashboardStats {
  totalAppointments: number;
  newContacts: number;
  pendingAppointments: number;
  todayAppointments: number;
  cancelledAppointments: number;
  completedAppointments: number;
  upcomingAppointments: UpcomingAppointment[];
  bookingsOverTime: { date: string; count: number }[];
}

const chartConfig: ChartConfig = {
  count: {
    label: "Bookings",
    color: "oklch(0.546 0.245 262.881)",
  },
};

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    newContacts: 0,
    pendingAppointments: 0,
    todayAppointments: 0,
    cancelledAppointments: 0,
    completedAppointments: 0,
    upcomingAppointments: [],
    bookingsOverTime: [],
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const result = await getDashboardStats({
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      setStats(result as DashboardStats);
    } catch (err) {
      console.error("Dashboard stats error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => { loadStats(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_submissions' }, () => { loadStats(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const cards = [
    { label: "Total Appointments", value: stats.totalAppointments, icon: CalendarDays, color: "text-blue-600 bg-blue-50" },
    { label: "Today's Bookings", value: stats.todayAppointments, icon: Users, color: "text-emerald-600 bg-emerald-50" },
    { label: "Pending", value: stats.pendingAppointments, icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "Completed", value: stats.completedAppointments, icon: CheckCircle2, color: "text-green-600 bg-green-50" },
    { label: "Cancelled", value: stats.cancelledAppointments, icon: XCircle, color: "text-red-600 bg-red-50" },
    { label: "New Contacts", value: stats.newContacts, icon: MessageSquare, color: "text-purple-600 bg-purple-50" },
  ];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      <h1 className="text-2xl font-bold font-heading text-navy">Dashboard</h1>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-xl border p-5 animate-pulse">
              <div className="h-4 w-20 bg-muted rounded mb-3" />
              <div className="h-8 w-12 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

      {/* Bottom section: chart + upcoming */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bookings Over Time Chart */}
          <div className="lg:col-span-2 bg-card rounded-xl border p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-navy">Bookings — Last 30 Days</h2>
            </div>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <AreaChart data={stats.bookingsOverTime} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: string) => {
                    const d = new Date(v + "T00:00:00");
                    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
                  }}
                  interval={4}
                  fontSize={11}
                />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} fontSize={11} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(v: string) => {
                        const d = new Date(v + "T00:00:00");
                        return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                      }}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-count)"
                  fill="url(#fillBookings)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-card rounded-xl border p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-navy">Upcoming (24h)</h2>
            </div>
            {stats.upcomingAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
            ) : (
              <div className="space-y-3 max-h-[280px] overflow-y-auto">
                {stats.upcomingAppointments.map((appt) => (
                  <div key={appt.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{appt.name}</p>
                      <p className="text-xs text-muted-foreground">{appt.service}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(appt.preferred_date)} · {appt.preferred_time}
                      </p>
                    </div>
                    <span className={`ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                      appt.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
