import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

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

function Team() {
  const { t, lang } = useI18n();
  const { data } = useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const { data } = await supabase
        .from("team_members")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      return data ?? [];
    },
  });
  const members = data ?? [];
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
            <div key={m.id} className="card-soft p-6 flex items-center gap-4">
              {m.photo_url ? (
                <img src={m.photo_url} alt={m.name} className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-white font-bold text-xl">
                  {m.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                </div>
              )}
              <div>
                <div className="font-bold">{m.name}</div>
                <div className="text-sm text-muted-foreground">{lang === "fr" ? m.role_fr : m.role_en}</div>
                {(lang === "fr" ? m.bio_fr : m.bio_en) && (
                  <div className="text-xs text-muted-foreground mt-1">{lang === "fr" ? m.bio_fr : m.bio_en}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
