import { createFileRoute, Outlet, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { CalendarDays, MessageSquare, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);

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
        <div className="p-6 border-b border-white/10">
          <h2 className="font-heading text-lg font-bold">Clinic CRM</h2>
          <p className="text-xs text-navy-foreground/60 mt-1">Staff Dashboard</p>
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
      </div>

      {/* Main */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
