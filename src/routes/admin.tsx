import { createFileRoute, Outlet, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef, useState } from "react";
import { CalendarDays, MessageSquare, LayoutDashboard, LogOut, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

// Short inline ping sound (base64 wav)
const PING_SRC = "data:audio/wav;base64,UklGRlwEAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YTgEAAAAAP8AAQD+AAIA/QADAPwABAD7AAUA+gAGAPkABwD4AAgA9wAJAPYACgD1AAsA9AAMAPMADQDyAA4A8QAPAPAAEADvABEA7gASAO0AEwDsABQA6wAVAOoAFgDpABcA6AAYAOcAGQDmABoA5QAbAOQAHADjAB0A4gAeAOEAHwDgACAA3wAhAN4AIgDdACMA3AAkANsAJQDaACYA2QAnANgAKADXACkA1gAqANUAKwDUACwA0wAtANIALgDRAC8A0AAwAM8AMQDOADIAzQAzAMwANADLADUAygA2AMkANwDIADgAxwA5AMYAOgDFADsAxAA8AMMAPQDCAD4AwQA/AMAAQAC/AEEAvgBCAL0AQwC8AEQAuwBFALoARgC5AEcAuABIALcASQC2AEoAtQBLALQATAC0AE0AswBOALIATwCxAFAAsABRAK8AUgCuAFMArQBUAKwAVQCrAFYAqgBXAKkAWACoAFkApwBaAKYAWwClAFwApABdAKMAXgCiAF8AoQBgAKAAYQCfAGIAngBjAJ0AZACcAGUAmwBmAJoAZwCZAGgAmABpAJcAagCWAGsAlQBsAJQAbQCTAG4AkgBvAJEAcACQAHEAjwByAI4AcwCNAHQAjAB1AIsAdgCKAHcAiQB4AIgAeQCHAHoAhgB7AIUAfACEAH0AgwB+AIIAfwCBAIAAgACBAH8AggB+AIMAfQCEAHwAhQB7AIYAegCHAHkAiAB4AIkAdwCKAHYAiwB1AIwAdACNAHMAjgByAI8AcQCQAHAAkQBvAJIAbgCTAG0AlABsAJUAawCWAGoAlwBpAJgAaACZAGcAmgBmAJsAZQCcAGQAnQBjAJ4AYgCfAGEAoABgAKEAXwCiAF4AowBdAKQAXACpAFsAqgBaAKsAWQCsAFgArQBXAK4AVgCvAFUAsABUALEAUwCyAFIAswBRALQAUACyAE8AswBOALQATQC1AEwAtgBLALcASgC4AEkAuQBIALoARwC7AEYAvABFAL0ARAC+AEMAvwBCAMAAQQDBAEAAwgA/AMMAPgDEAD0AxQA8AMYAOwDHADoAyAA5AMkAOADKADcAywA2AMwANQDNADQAzgAzAM8AMgDQADEA0QAwANIALwDTAC4A1AAtANUALADWACsA1wAqANgAKQDZACgA2gAnANsAJgDcACUA3QAkAN4AIwDfACIA4AAhAOEAIADiAB8A4wAeAOQAHQDlABwA5gAbAOcAGgDoABkA6QAYAOoAFwDrABYA7AAVAO0AFADuABMA7wASAPAAEQDxABAA8gAPAPMADgD0AA0A9QAMAPYACwD3AAoA+AAJAPkACAD6AAcA+wAGAPwABQD9AAQA/gADAP8AAgAA";

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [muted, setMuted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("admin_notif_muted") === "1";
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mutedRef = useRef(muted);

  useEffect(() => {
    mutedRef.current = muted;
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_notif_muted", muted ? "1" : "0");
    }
  }, [muted]);

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session && !location.pathname.includes("/admin/login")) {
        navigate({ to: "/admin/login" });
        return;
      }
      setAuthed(!!session);
    };
    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setAuthed(!!session);
      if (!session && !location.pathname.includes("/admin/login")) {
        navigate({ to: "/admin/login" });
      }
    });
    return () => subscription.unsubscribe();
  }, [location.pathname, navigate]);

  // Realtime notifications for new bookings & contacts
  useEffect(() => {
    if (!authed) return;

    audioRef.current = new Audio(PING_SRC);
    audioRef.current.volume = 0.4;

    const playPing = () => {
      if (mutedRef.current) return;
      audioRef.current?.play().catch(() => {});
    };

    const channel = supabase
      .channel("admin-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "appointments" },
        (payload) => {
          const a = payload.new as { name: string; service: string; preferred_date: string; preferred_time: string };
          playPing();
          toast.success(`New appointment from ${a.name}`, {
            description: `${a.service} • ${a.preferred_date} at ${a.preferred_time}`,
            duration: 8000,
            action: {
              label: "View",
              onClick: () => navigate({ to: "/admin/appointments" }),
            },
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contact_submissions" },
        (payload) => {
          const c = payload.new as { name: string; message: string };
          playPing();
          toast.info(`New contact from ${c.name}`, {
            description: c.message?.slice(0, 80) + (c.message?.length > 80 ? "…" : ""),
            duration: 8000,
            action: {
              label: "View",
              onClick: () => navigate({ to: "/admin/contacts" }),
            },
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authed, navigate]);

  // Login page renders without sidebar
  if (location.pathname.includes("/admin/login")) {
    return <Outlet />;
  }

  if (authed === null) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  }

  const navItems = [
    { to: "/admin" as const, label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/appointments" as const, label: "Appointments", icon: CalendarDays },
    { to: "/admin/contacts" as const, label: "Contacts", icon: MessageSquare },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy text-navy-foreground flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold">Clinic CRM</h2>
            <p className="text-xs text-navy-foreground/60 mt-1">Staff Dashboard</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMuted((m) => !m)}
            className="text-navy-foreground/70 hover:text-white hover:bg-white/10"
            title={muted ? "Unmute notifications" : "Mute notifications"}
          >
            {muted ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          </Button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === to
                  ? "bg-white/10 text-white font-medium"
                  : "text-navy-foreground/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-navy-foreground/70 hover:text-white hover:bg-white/5"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-navy text-navy-foreground border-t border-white/10 z-50 flex">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs ${
              location.pathname === to ? "text-gold" : "text-navy-foreground/60"
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
        <button
          onClick={() => setMuted((m) => !m)}
          className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs ${
            muted ? "text-navy-foreground/60" : "text-gold"
          }`}
        >
          {muted ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
          {muted ? "Muted" : "Alerts"}
        </button>
      </div>

      {/* Main */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
