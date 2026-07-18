import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/programs/$slug")({
  component: ProgramDetail,
  notFoundComponent: () => (
    <div className="section container-x">
      <p className="text-muted-foreground">Programme introuvable.</p>
      <Link to="/projects" className="btn-outline mt-4 w-fit">Retour</Link>
    </div>
  ),
});

function ProgramDetail() {
  const { slug } = Route.useParams();
  const { lang } = useI18n();

  const { data: program, isLoading } = useQuery({
    queryKey: ["program", slug],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("*").eq("slug", slug).maybeSingle();
      return data;
    },
  });

  const { data: subs } = useQuery({
    queryKey: ["program-subs", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .eq("program_slug", slug)
        .order("sort_order");
      return data ?? [];
    },
  });

  if (isLoading) {
    return <div className="section container-x">Chargement…</div>;
  }

  if (!program) {
    throw notFound();
  }

  const title = lang === "fr" ? program.title_fr : program.title_en;
  const category = lang === "fr" ? program.category_fr : program.category_en;
  const excerpt = lang === "fr" ? program.excerpt_fr : program.excerpt_en;
  const body = lang === "fr" ? program.body_fr : program.body_en;
  const gallery = (program.gallery_urls ?? []) as string[];

  return (
    <section className="section">
      <div className="container-x">
        <Link to="/projects" className="inline-flex items-center gap-1 text-sm text-primary font-semibold mb-6">
          <ArrowLeft className="h-4 w-4" /> {lang === "fr" ? "Tous les programmes" : "All programs"}
        </Link>

        <div className="grid gap-8 lg:grid-cols-2 items-start animate-fade-in">
          <div className="overflow-hidden rounded-2xl">
            {program.image_url && (
              <img src={program.image_url} alt={title ?? ""} className="w-full aspect-[4/3] object-cover" />
            )}
          </div>
          <div>
            {category && <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">{category}</div>}
            <h1 className="mt-1 text-3xl sm:text-4xl font-bold">{title}</h1>
            {excerpt && <p className="mt-3 text-muted-foreground">{excerpt}</p>}
            {body && <p className="mt-4 text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{body}</p>}
          </div>
        </div>

        {gallery.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">{lang === "fr" ? "Galerie" : "Gallery"}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
          </div>
        )}

        {subs && subs.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold mb-6">{lang === "fr" ? "Projets associés" : "Related projects"}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {subs.map((s, si) => {
                const st = lang === "fr" ? s.title_fr : s.title_en;
                const se = lang === "fr" ? s.excerpt_fr : s.excerpt_en;
                return (
                  <article
                    key={s.id}
                    className="group card-soft overflow-hidden animate-fade-in hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                    style={{ animationDelay: `${si * 100}ms`, animationFillMode: "both" }}
                  >
                    {s.image_url && (
                      <div className="overflow-hidden">
                        <img src={s.image_url} alt={st ?? ""} loading="lazy" className="w-full aspect-[4/3] object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
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
      </div>
    </section>
  );
}
