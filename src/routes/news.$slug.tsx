import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

// Image statique brute
import visiteImg from "@/assets/hero/visite.jpg";

export const Route = createFileRoute("/news/$slug")({
  head: () => ({
    meta: [
      { title: "Actualité — AGAKURA Jeunesse Providence" },
      { name: "description", content: "Article d'actualité AGAKURA." },
    ],
  }),
  component: NewsDetail,
  errorComponent: ({ reset }) => {
    const router = useRouter();
    return (
      <div className="section container-x py-12">
        <p className="text-muted-foreground">Une erreur est survenue lors du chargement de l'article.</p>
        <button
          onClick={() => {
            reset();
            router.invalidate();
          }}
          className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:opacity-90 transition"
        >
          Réessayer
        </button>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="section container-x py-12">
      <p className="text-muted-foreground">Article introuvable.</p>
      <Link to="/news" className="mt-4 inline-flex items-center gap-2 text-primary font-semibold hover:underline">
        <ArrowLeft className="h-4 w-4" /> Retour aux actualités
      </Link>
    </div>
  ),
});

function NewsDetail() {
  const { slug } = Route.useParams();
  const { lang } = useI18n();

  const { data, isLoading } = useQuery({
    queryKey: ["news", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("news")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="section py-12">
        <div className="container-x max-w-3xl">
          <div className="h-6 w-32 rounded bg-secondary animate-pulse mb-6" />
          <div className="h-10 w-3/4 rounded bg-secondary animate-pulse mb-6" />
          <div className="h-[400px] w-full rounded-2xl bg-secondary animate-pulse" />
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="section py-12">
        <div className="container-x max-w-3xl">
          <Link to="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> {lang === "fr" ? "Toutes les actualités" : "All news"}
          </Link>
          <p className="mt-6 text-muted-foreground">
            {lang === "fr" ? "Cet article est indisponible." : "This article is unavailable."}
          </p>
        </div>
      </section>
    );
  }

  const title = lang === "fr" ? data.title_fr : data.title_en;
  const body = lang === "fr" ? data.body_fr : data.body_en;
  const excerpt = lang === "fr" ? data.excerpt_fr : data.excerpt_en;

  const formattedDate = new Date(data.published_at).toLocaleDateString(
    lang === "fr" ? "fr-FR" : "en-US",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <article className="section py-10 sm:py-16">
      <div className="container-x max-w-3xl animate-fade-in">
        <Link 
          to="/news" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> {lang === "fr" ? "Toutes les actualités" : "All news"}
        </Link>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary mb-3">
          <Calendar className="h-3.5 w-3.5" />
          <time dateTime={data.published_at}>{formattedDate}</time>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          {title}
        </h1>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border/50 shadow-sm aspect-[16/9] bg-secondary">
          <img 
            src={visiteImg} 
            alt={title ?? ""} 
            className="w-full h-full object-cover" 
          />
        </div>

        {excerpt && (
          <p className="mt-8 text-lg sm:text-xl font-medium text-muted-foreground leading-relaxed border-l-4 border-primary pl-4">
            {excerpt}
          </p>
        )}

        {body && (
          <div className="mt-8 pt-6 border-t border-border/40 whitespace-pre-line text-base sm:text-lg text-foreground/90 leading-relaxed font-normal space-y-4">
            {body}
          </div>
        )}
      </div>
    </article>
  );
}