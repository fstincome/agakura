import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { LayoutDashboard, Rocket, Newspaper, Mail, LogOut, Image, Users, FileText, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { t } = useI18n();
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [ready, setReady] = useState(false);

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

  if (!ready) return <div className="container-x py-20">Loading…</div>;

    const items = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/hero", label: "Hero slides", icon: Image },
    { to: "/admin/projects", label: t("nav.projects"), icon: Rocket },
    { to: "/admin/news", label: t("nav.news"), icon: Newspaper },
    { to: "/admin/team", label: t("nav.team"), icon: Users },
    { to: "/admin/content", label: "Site content", icon: FileText },
    { to: "/admin/messages", label: "Messages", icon: Mail },
    { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="container-x py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="eyebrow">Super Admin</div>
          <h1 className="mt-1 text-3xl font-bold">{t("admin.title")}</h1>
        </div>
        <button onClick={signOut} className="btn-outline"><LogOut className="h-4 w-4" />{t("admin.logout")}</button>
      </div>
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex lg:flex-col gap-1 overflow-x-auto">
          {items.map((it) => {
            const active = it.exact ? path === it.to : path.startsWith(it.to);
            return (
              <Link key={it.to} to={it.to} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition whitespace-nowrap ${active ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
                <it.icon className="h-4 w-4" />{it.label}
              </Link>
            );
          })}
        </nav>
        <div className="min-w-0">
          {path === "/admin" ? <Dashboard /> : <Outlet />}
        </div>
      </div>
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
  );
}
