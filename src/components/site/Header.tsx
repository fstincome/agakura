import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Home, Info, Users, Rocket, Newspaper, Phone, Menu, X, Lock } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import logoAsset from "@/assets/agakura-logo.jpg.asset.json";

export function Header() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const links = [
    { to: "/", label: t("nav.home"), icon: Home },
    { to: "/about", label: t("nav.about"), icon: Info },
    { to: "/team", label: t("nav.team"), icon: Users },
    { to: "/projects", label: t("nav.projects"), icon: Rocket },
    { to: "/news", label: t("nav.news"), icon: Newspaper },
    { to: "/contact", label: t("nav.contact"), icon: Phone },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logoAsset.url}
            alt="AGAKURA Jeunesse Providence"
            className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/30 bg-white"
          />
          <div className="hidden sm:block leading-tight">
            <div className="text-sm font-bold tracking-tight">
              AGAKURA <span className="text-primary">JEUNESSE PROVIDENCE</span>
            </div>
            <div className="text-[11px] text-muted-foreground">{t("brand.tagline")}</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="pill-nav-link" activeOptions={{ exact: l.to === "/" }}>
              <l.icon className="h-4 w-4" />
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-0.5 rounded-full border border-border p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLang("fr")}
              className={`px-2.5 py-1 rounded-full transition ${lang === "fr" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              FR
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 rounded-full transition ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              EN
            </button>
          </div>
          <Link
            to={authed ? "/admin" : "/auth"}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-2 text-xs font-semibold text-background"
          >
            <Lock className="h-3.5 w-3.5" />
            {authed ? t("nav.admin") : "ELITE"}
          </Link>
          <button onClick={() => setOpen((o) => !o)} className="lg:hidden p-2 rounded-full hover:bg-secondary">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-x py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="pill-nav-link" onClick={() => setOpen(false)}>
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 px-2 pt-2">
              <button onClick={() => setLang("fr")} className={`text-xs px-3 py-1.5 rounded-full ${lang === "fr" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>FR</button>
              <button onClick={() => setLang("en")} className={`text-xs px-3 py-1.5 rounded-full ${lang === "en" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>EN</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
