import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { LayoutDashboard, Rocket, Newspaper, Mail, LogOut, Image, Users, FileText, BarChart3, ExternalLink, Menu, X } from "lucide-react";
import logoAsset from "@/assets/agakura-logo.jpg.asset.json";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { t } = useI18n();
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) nav({ to: "/auth" });
      else setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!s) nav({ to: "/auth" });
    });
    return () => sub.subscription.unsubscribe();
  }, [nav]);

  const signOut = async () => {
    await supabase.auth.signOut();
    nav({ to: "/" });
  };

  if (!ready) return <div className="px-6 py-20">Loading…</div>;

  const items = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/hero", label: "Hero", icon: Image },
    { to: "/admin/projects", label: t("nav.projects"), icon: Rocket },
    { to: "/admin/news", label: t("nav.news"), icon: Newspaper },
    { to: "/admin/team", label: t("nav.team"), icon: Users },
    { to: "/admin/content", label: "Content", icon: FileText },
    { to: "/admin/messages", label: "Messages", icon: Mail },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/admin" className="flex items-center gap-2 shrink-0">
              <img src={logoAsset.url} alt="AGAKURA" className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/30 bg-white" />
              <div className="hidden sm:block leading-tight">
                <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Super Admin</div>
                <div className="text-sm font-bold">AGAKURA</div>
              </div>
            </Link>
            <nav className="hidden lg:flex items-center gap-1 ml-4 overflow-x-auto">
              {items.map((it) => {
                const active = it.exact ? path === it.to : path.startsWith(it.to);
                return (
                  <Link key={it.to} to={it.to} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                    <it.icon className="h-3.5 w-3.5" />{it.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/" className="hidden sm:inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary">
              <ExternalLink className="h-3.5 w-3.5" />Site
            </Link>
            <button onClick={signOut} className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background">
              <LogOut className="h-3.5 w-3.5" />{t("admin.logout")}
            </button>
            <button onClick={() => setOpen((o) => !o)} className="lg:hidden p-2 rounded-full hover:bg-secondary">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden border-t border-border px-4 py-3 flex flex-col gap-1">
            {items.map((it) => {
              const active = it.exact ? path === it.to : path.startsWith(it.to);
              return (
                <Link key={it.to} to={it.to} onClick={() => setOpen(false)} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${active ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
                  <it.icon className="h-4 w-4" />{it.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>
      <main className="flex-1 w-full px-4 sm:px-6 py-6">
        {path === "/admin" ? <Dashboard /> : <Outlet />}
      </main>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, news: 0, messages: 0 });
  useEffect(() => {
    (async () => {
      const [p, n, m] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("news").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }),
      ]);
      setStats({ projects: p.count ?? 0, news: n.count ?? 0, messages: m.count ?? 0 });
    })();
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <div className="eyebrow">Overview</div>
        <h1 className="mt-1 text-3xl font-bold">Dashboard</h1>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        {[
          { label: "Projects", value: stats.projects, icon: Rocket },
          { label: "News", value: stats.news, icon: Newspaper },
          { label: "Messages", value: stats.messages, icon: Mail },
        ].map((s) => (
          <div key={s.label} className="card-soft p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{s.label}</div>
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-2 text-3xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
