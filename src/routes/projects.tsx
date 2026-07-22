import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight } from "lucide-react";

// 1. Charger dynamiquement toutes les images du dossier src/assets/programs/
const programImages = import.meta.glob<{ default: string }>(
  "@/assets/programs/*.{png,jpg,jpeg,webp,svg}",
  { eager: true }
);

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Programmes — AGAKURA Jeunesse Providence" },
      { name: "description", content: "Nos trois programmes : Ferme-école, CESACO, Biodiversité & Résilience climatique." },
      { property: "og:title", content: "Nos programmes — AGAKURA" },
      { property: "og:description", content: "Ferme-école, CESACO et Biodiversité au service des communautés du Burundi." },
    ],
  }),
  component: Projects,
});

function Projects() {
  const { t, lang } = useI18n();
  const { data } = useQuery({
    queryKey: ["projects", "programs-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .is("program_slug", null)
        .order("sort_order");
      return data ?? [];
    },
  });

  const programs = data ?? [];

  return (
    <section className="section">
      <div className="container-x">
        <div className="max-w-2xl animate-fade-in">
          <div className="eyebrow">{t("projects.eyebrow")}</div>
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold">{t("projects.title")}</h1>
          <p className="mt-4 text-muted-foreground">{t("projects.page.sub")}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {programs.map((p, i) => {
            const title = lang === "fr" ? p.title_fr : p.title_en;
            const excerpt = lang === "fr" ? p.excerpt_fr : p.excerpt_en;

            // 2. Trouver l'image dans src/assets/programs/ qui correspond au slug du programme
            const matchingImagePath = Object.keys(programImages).find((path) =>
              path.includes(`/${p.slug}.`)
            );

            // Si l'image locale existe, on la prend, sinon on se rabat sur p.image_url de Supabase
            const imageSrc = matchingImagePath
              ? programImages[matchingImagePath].default
              : p.image_url;

            return (
              <article
                key={p.id}
                className="card-soft overflow-hidden group flex flex-col animate-fade-in hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${i * 120}ms`, animationFillMode: "both" }}
              >
                <div className="aspect-[4/3] overflow-hidden bg-secondary">
                  {imageSrc && (
                    <img
                      src={imageSrc}
                      alt={title ?? ""}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h2 className="font-bold text-lg leading-snug">{title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">{excerpt}</p>
                  <Link
                    to="/programs/$slug"
                    params={{ slug: p.slug }}
                    className="btn-primary mt-4 w-fit"
                  >
                    {lang === "fr" ? "Voir les détails" : "See details"}{" "}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}