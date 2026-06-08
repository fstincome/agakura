import { Link } from "@tanstack/react-router";
import { Phone, MapPin, Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="container-x py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground font-bold">A</div>
            <div className="font-bold">AGAKURA <span className="text-primary">JEUNESSE PROVIDENCE</span></div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-md">{t("brand.tagline")}</p>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3">Navigation</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">{t("nav.about")}</Link></li>
            <li><Link to="/projects" className="hover:text-foreground">{t("nav.projects")}</Link></li>
            <li><Link to="/team" className="hover:text-foreground">{t("nav.team")}</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">{t("nav.contact")}</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold mb-3">Contact</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> (+257) 61 869 718</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Makebuko, Gitega</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> contact@agakura.bi</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-x py-5 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} AGAKURA Jeunesse Providence. {t("footer.rights")}</span>
          <span>Makebuko · Gitega · Burundi</span>
        </div>
      </div>
    </footer>
  );
}
