import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Programmes & Projets — AGAKURA Jeunesse Providence" },
      { name: "description", content: "Nos trois programmes et les projets associés : Ferme-école, CESACO (santé & nutrition), Biodiversité & Résilience climatique." },
      { property: "og:title", content: "Nos programmes & projets — AGAKURA" },
      { property: "og:description", content: "Ferme-école, CESACO et Biodiversité au service des communautés du Burundi." },
    ],
  }),
  component: Projects,
});

function Projects() {
  const { t, lang } = useI18n();
  const { data } = useQuery({
    queryKey: ["projects", "all"],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("*").eq("published", true).order("sort_order");
      return data ?? [];
    },
  });

  const rows = data ?? [];
  const programs = rows.filter((r) => !r.program_slug);
  const subsByProgram = (slug: string) => rows.filter((r) => r.program_slug === slug);

  return (
    <section className="section">
      <div className="container-x">
        <div className="max-w-2xl animate-fade-in">
          <div className="eyebrow">{t("projects.eyebrow")}</div>
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold">{t("projects.title")}</h1>
          <p className="mt-4 text-muted-foreground">{t("projects.page.sub")}</p>
        </div>

        <div className="mt-12 space-y-20">
          {programs.map((p, i) => {
            const title = lang === "fr" ? p.title_fr : p.title_en;
            const category = lang === "fr" ? p.category_fr : p.category_en;
            const excerpt = lang === "fr" ? p.excerpt_fr : p.excerpt_en;
            const body = lang === "fr" ? p.body_fr : p.body_en;
            const gallery = (p.gallery_urls ?? []) as string[];
            const subs = subsByProgram(p.slug);
            const reverse = i % 2 === 1;
            return (
              <section key={p.id} className="space-y-8 animate-fade-in" style={{ animationDelay: `${i * 120}ms`, animationFillMode: "both" }}>
                <article className="grid gap-8 lg:grid-cols-2 items-start">
                  <div className={`overflow-hidden rounded-2xl group ${reverse ? "lg:order-2" : ""}`}>
                    {p.image_url && (
                      <img
                        src={p.image_url}
                        alt={title ?? ""}
                        loading="lazy"
                        className="w-full aspect-[4/3] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className={reverse ? "lg:order-1" : ""}>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">{category}</div>
                    <h2 className="mt-1 text-2xl sm:text-3xl font-bold">{title}</h2>
                    <p className="mt-3 text-muted-foreground">{excerpt}</p>
                    {body && <p className="mt-3 text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{body}</p>}
                    {gallery.length > 0 && (
                      <div className="mt-5 grid grid-cols-3 gap-2">
                        {gallery.map((url, gi) => (
                          <a
                            key={url}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="block overflow-hidden rounded-lg animate-zoom-in"
                            style={{ animationDelay: `${gi * 80}ms`, animationFillMode: "both" }}
                          >
                            <img src={url} alt="" loading="lazy" className="aspect-square object-cover w-full transition-transform duration-500 hover:scale-110" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </article>

                {subs.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-primary/80 mb-4">
                      {lang === "fr" ? "Projets associés" : "Related projects"}
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {subs.map((s, si) => {
                        const st = lang === "fr" ? s.title_fr : s.title_en;
                        const se = lang === "fr" ? s.excerpt_fr : s.excerpt_en;
                        return (
                          <article
                            key={s.id}
                            className="group card-soft overflow-hidden animate-fade-in-up hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                            style={{ animationDelay: `${si * 100}ms`, animationFillMode: "both" }}
                          >
                            {s.image_url && (
                              <div className="overflow-hidden">
                                <img
                                  src={s.image_url}
                                  alt={st ?? ""}
                                  loading="lazy"
                                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />
                              </div>
                            )}
                            <div className="p-4">
                              <h3 className="font-semibold">{st}</h3>
                              {se && <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{se}</p>}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
