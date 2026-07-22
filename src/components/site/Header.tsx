import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

// Importation directe du logo situé dans src/assets/logo.jpg
import logoImg from "@/assets/logo.jpg";

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
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/team", label: t("nav.team") },
    { to: "/projects", label: t("nav.projects") },
    { to: "/news", label: t("nav.news") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-3 md:gap-6">
        <Link to="/" className="flex items-center gap-2 min-w-0 shrink-0">
          {/* Utilisation du logo local */}
          <img
            src={logoImg}
            alt="AGAKURA Jeunesse Providence"
            className="h-10 w-10 md:h-11 md:w-11 rounded-full object-cover ring-2 ring-primary/30 bg-white shrink-0"
          />
          <div className="hidden sm:block leading-tight min-w-0">
            <div className="text-[13px] md:text-sm font-bold tracking-tight truncate">
              AGAKURA <span className="text-primary">JEUNESSE PROVIDENCE</span>
            </div>
            <div className="hidden md:block text-[11px] text-muted-foreground truncate">{t("brand.tagline")}</div>
          </div>
        </Link>

        <nav className="hidden md:flex flex-1 items-center justify-center gap-[clamp(0.25rem,1.5vw,1rem)] min-w-0">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-2 py-1.5 text-[clamp(0.75rem,1.1vw,0.9rem)] font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap [&.active]:text-primary"
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-0.5 rounded-full border border-border p-0.5 text-xs font-semibold">
            <button
              onClick={() => setLang("fr")}
              className={`px-2 py-1 rounded-full transition ${lang === "fr" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              FR
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-1 rounded-full transition ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              EN
            </button>
          </div>
          <Link
            to={authed ? "/admin" : "/auth"}
            className="hidden sm:inline-flex items-center rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90 transition"
          >
            {authed ? t("nav.admin") : "Login"}
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden p-2 rounded-full hover:bg-secondary"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-x py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground [&.active]:text-primary [&.active]:bg-secondary"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 px-2 pt-2">
              <button onClick={() => setLang("fr")} className={`text-xs px-3 py-1.5 rounded-full ${lang === "fr" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>FR</button>
              <button onClick={() => setLang("en")} className={`text-xs px-3 py-1.5 rounded-full ${lang === "en" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>EN</button>
              <Link
                to={authed ? "/admin" : "/auth"}
                onClick={() => setOpen(false)}
                className="ml-auto inline-flex items-center rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background"
              >
                {authed ? t("nav.admin") : "Login"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}