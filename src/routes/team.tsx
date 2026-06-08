import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — AGAKURA Jeunesse Providence" },
      { name: "description", content: "Meet the team behind AGAKURA Jeunesse Providence." },
      { property: "og:title", content: "Our Team — AGAKURA" },
      { property: "og:description", content: "A dedicated team serving Burundi communities since 1995." },
    ],
  }),
  component: Team,
});

const members = [
  { n: "Jean-Marie N.", r: { fr: "Directeur exécutif", en: "Executive Director" } },
  { n: "Claudine M.", r: { fr: "Coordinatrice programmes", en: "Programs Coordinator" } },
  { n: "Patrick K.", r: { fr: "Responsable jeunesse", en: "Youth Officer" } },
  { n: "Élise B.", r: { fr: "Inclusion des femmes", en: "Women's Inclusion Lead" } },
  { n: "Désiré H.", r: { fr: "Environnement", en: "Environment Lead" } },
  { n: "Sandrine I.", r: { fr: "Santé communautaire", en: "Community Health" } },
];

function Team() {
  const { t, lang } = useI18n();
  return (
    <section className="section">
      <div className="container-x">
        <div className="max-w-2xl">
          <div className="eyebrow">{t("nav.team")}</div>
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold">{t("team.title")}</h1>
          <p className="mt-4 text-muted-foreground">{t("team.sub")}</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <div key={m.n} className="card-soft p-6 flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-white font-bold text-xl">
                {m.n.split(" ").map((s) => s[0]).join("")}
              </div>
              <div>
                <div className="font-bold">{m.n}</div>
                <div className="text-sm text-muted-foreground">{lang === "fr" ? m.r.fr : m.r.en}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
