import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Programmes — AGAKURA Jeunesse Providence" },
      { name: "description", content: "Nos trois programmes : Ferme-école, CESACO (santé communautaire & nutrition), Biodiversité & Résilience climatique." },
      { property: "og:title", content: "Nos programmes — AGAKURA" },
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
  return (
    <section className="section">
      <div className="container-x">
        <div className="max-w-2xl">
          <div className="eyebrow">{t("projects.eyebrow")}</div>
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold">{t("projects.title")}</h1>
          <p className="mt-4 text-muted-foreground">{t("projects.page.sub")}</p>
        </div>
        <div className="mt-12 space-y-16">
          {(data ?? []).map((p, i) => {
            const title = lang === "fr" ? p.title_fr : p.title_en;
            const category = lang === "fr" ? p.category_fr : p.category_en;
            const excerpt = lang === "fr" ? p.excerpt_fr : p.excerpt_en;
            const body = lang === "fr" ? p.body_fr : p.body_en;
            const gallery = (p.gallery_urls ?? []) as string[];
            const reverse = i % 2 === 1;
            return (
              <article key={p.id} className="grid gap-8 lg:grid-cols-2 items-start">
                <div className={reverse ? "lg:order-2" : ""}>
                  {p.image_url && (
                    <img src={p.image_url} alt={title ?? ""} className="rounded-2xl w-full aspect-[4/3] object-cover" loading="lazy" />
                  )}
                </div>
                <div className={reverse ? "lg:order-1" : ""}>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">{category}</div>
                  <h2 className="mt-1 text-2xl sm:text-3xl font-bold">{title}</h2>
                  <p className="mt-3 text-muted-foreground">{excerpt}</p>
                  {body && <p className="mt-3 text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{body}</p>}
                  {gallery.length > 0 && (
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      {gallery.map((url) => (
                        <a key={url} href={url} target="_blank" rel="noreferrer" className="block">
                          <img src={url} alt="" className="rounded-lg aspect-square object-cover w-full hover:opacity-90 transition" loading="lazy" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
