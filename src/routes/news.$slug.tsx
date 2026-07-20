import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

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
      <div className="section container-x">
        <p className="text-muted-foreground">Une erreur est survenue.</p>
        <button
          onClick={() => { reset(); router.invalidate(); }}
          className="mt-4 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          Réessayer
        </button>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="section container-x">
      <p className="text-muted-foreground">Article introuvable.</p>
      <Link to="/news" className="mt-4 inline-block text-primary hover:underline">← Retour aux actualités</Link>
    </div>
  ),
});

function NewsDetail() {
  const { slug } = Route.useParams();
  const { lang } = useI18n();
  const { data } = useQuery({
    queryKey: ["news", slug],
    queryFn: async () => {
      const { data } = await supabase.from("news").select("*").eq("slug", slug).eq("published", true).maybeSingle();
      return data;
    },
  });

  if (!data) {
    return (
      <section className="section">
        <div className="container-x">
          <Link to="/news" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> {lang === "fr" ? "Retour" : "Back"}
          </Link>
          <p className="mt-6 text-muted-foreground">
            {lang === "fr" ? "Chargement…" : "Loading…"}
          </p>
        </div>
      </section>
    );
  }

  const title = lang === "fr" ? data.title_fr : data.title_en;
  const body = lang === "fr" ? data.body_fr : data.body_en;
  const excerpt = lang === "fr" ? data.excerpt_fr : data.excerpt_en;

  return (
    <section className="section">
      <div className="container-x max-w-3xl">
        <Link to="/news" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> {lang === "fr" ? "Toutes les actualités" : "All news"}
        </Link>
        <time className="mt-6 block text-xs text-muted-foreground">
          {new Date(data.published_at).toLocaleDateString(lang)}
        </time>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold">{title}</h1>
        {data.image_url && (
          <img src={data.image_url} alt="" className="mt-6 w-full aspect-[16/9] object-cover rounded-2xl" />
        )}
        {excerpt && (
          <p className="mt-6 text-lg text-muted-foreground">{excerpt}</p>
        )}
        {body && (
          <div className="mt-6 whitespace-pre-line text-foreground/90 leading-relaxed">{body}</div>
        )}
      </div>
    </section>
  );
}
