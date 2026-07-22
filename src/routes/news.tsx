import { createFileRoute, Link, Outlet, useChildMatches } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar, Newspaper } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

// Images statiques brutes
import champsImg from "@/assets/hero/champs.jpg";
import travauxImg from "@/assets/hero/travaux.jpg";
import visiteImg from "@/assets/hero/visite.jpg";

const newsStaticImages = [visiteImg, travauxImg, champsImg];

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "Actualités — AGAKURA Jeunesse Providence" },
      { name: "description", content: "Dernières histoires et mises à jour d'AGAKURA Jeunesse Providence." },
      { property: "og:title", content: "Actualités — AGAKURA" },
      { property: "og:description", content: "Dernières histoires et mises à jour communautaires." },
    ],
  }),
  component: NewsLayout,
});

function NewsLayout() {
  const childMatches = useChildMatches();
  if (childMatches.length > 0) {
    return <Outlet />;
  }
  return <NewsList />;
}

function NewsList() {
  const { t, lang } = useI18n();

  const { data, isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data } = await supabase
        .from("news")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      return data ?? [];
    },
  });

  const newsList = data ?? [];

  return (
    <section className="section py-12">
      <div className="container-x">
        <div className="max-w-2xl animate-fade-in">
          <div className="eyebrow inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            <Newspaper className="h-3.5 w-3.5" />
            {t("nav.news")}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            {t("news.title")}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {t("news.sub")}
          </p>
        </div>

        {isLoading && (
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-secondary animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && newsList.length === 0 && (
          <div className="mt-12 p-8 text-center rounded-2xl bg-secondary/30 border border-border/50">
            <p className="text-muted-foreground">{t("news.empty")}</p>
          </div>
        )}

        {!isLoading && newsList.length > 0 && (
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {newsList.map((n, idx) => {
              const title = lang === "fr" ? n.title_fr : n.title_en;
              const excerpt = lang === "fr" ? n.excerpt_fr : n.excerpt_en;

              // Image statique brute attribuée directement en fonction de la position (visite -> travaux -> champs)
              const imageSrc = newsStaticImages[idx % newsStaticImages.length];

              const formattedDate = new Date(n.published_at).toLocaleDateString(
                lang === "fr" ? "fr-FR" : "en-US",
                { day: "numeric", month: "long", year: "numeric" }
              );

              return (
                <article
                  key={n.id}
                  className="group card-soft overflow-hidden rounded-2xl border border-border/50 bg-card flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "both" }}
                >
                  <Link
                    to="/news/$slug"
                    params={{ slug: n.slug }}
                    className="overflow-hidden aspect-[16/9] bg-secondary relative block"
                  >
                    <img
                      src={imageSrc}
                      alt={title ?? ""}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>

                  <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-3">
                        <Calendar className="h-3.5 w-3.5" />
                        <time dateTime={n.published_at}>{formattedDate}</time>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug">
                        <Link to="/news/$slug" params={{ slug: n.slug }}>
                          {title}
                        </Link>
                      </h3>

                      {excerpt && (
                        <p className="mt-3 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {excerpt}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/40">
                      <Link
                        to="/news/$slug"
                        params={{ slug: n.slug }}
                        className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all"
                      >
                        {lang === "fr" ? "Lire l'article complet" : "Read full story"}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}