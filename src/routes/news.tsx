import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News — AGAKURA Jeunesse Providence" },
      { name: "description", content: "Latest stories and updates from AGAKURA Jeunesse Providence." },
      { property: "og:title", content: "News — AGAKURA" },
      { property: "og:description", content: "Latest community stories and updates." },
    ],
  }),
  component: News,
});

function News() {
  const { t, lang } = useI18n();
  const { data } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data } = await supabase.from("news").select("*").eq("published", true).order("published_at", { ascending: false });
      return data ?? [];
    },
  });
  return (
    <section className="section">
      <div className="container-x">
        <div className="max-w-2xl">
          <div className="eyebrow">{t("nav.news")}</div>
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold">{t("news.title")}</h1>
          <p className="mt-4 text-muted-foreground">{t("news.sub")}</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {(data ?? []).length === 0 && <p className="text-muted-foreground">{t("news.empty")}</p>}
          {(data ?? []).map((n) => {
            const excerpt = lang === "fr" ? n.excerpt_fr : n.excerpt_en;
            return (
              <article key={n.id} className="card-soft overflow-hidden flex flex-col">
                {n.image_url && <img src={n.image_url} alt="" className="aspect-[16/9] w-full object-cover" />}
                <div className="p-6 flex flex-col flex-1">
                  <time className="text-xs text-muted-foreground">{new Date(n.published_at).toLocaleDateString(lang)}</time>
                  <h3 className="mt-1 text-xl font-bold">{lang === "fr" ? n.title_fr : n.title_en}</h3>
                  {excerpt && <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{excerpt}</p>}
                  <Link
                    to="/news/$slug"
                    params={{ slug: n.slug }}
                    className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-primary hover:gap-2 transition-all"
                  >
                    {lang === "fr" ? "Lire plus" : "Read more"}
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

