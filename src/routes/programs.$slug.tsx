import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ExternalLink } from "lucide-react";

// Imports explicites des images statiques depuis src/assets/hero/
import champsImg from "@/assets/hero/champs.jpg";
import travauxImg from "@/assets/hero/travaux.jpg";
import visiteImg from "@/assets/hero/visite.jpg";
import troisImg from "@/assets/hero/33.jpeg";
import quatreImg from "@/assets/hero/44.jpg";

// Tableau réutilisable des 3 images statiques
const staticImages = [troisImg, travauxImg, quatreImg];

// Importation dynamique des images pour la couverture principale
const programImages = import.meta.glob<{ default: string }>(
  "@/assets/programs/*.{png,jpg,jpeg,webp,svg}",
  { eager: true }
);

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
    return (
      <div className="section container-x">
        <div className="h-96 w-full rounded-2xl bg-secondary animate-pulse" />
      </div>
    );
  }

  if (!program) {
    throw notFound();
  }

  // Image de couverture principale (cherche par slug ou retombe sur la 1re image statique)
  const mainImagePath = Object.keys(programImages).find((path) =>
    path.includes(`/${program.slug}.`)
  );
  const mainImageSrc = mainImagePath
    ? programImages[mainImagePath].default
    : program.image_url || staticImages[0];

  const title = lang === "fr" ? program.title_fr : program.title_en;
  const category = lang === "fr" ? program.category_fr : program.category_en;
  const excerpt = lang === "fr" ? program.excerpt_fr : program.excerpt_en;
  const body = lang === "fr" ? program.body_fr : program.body_en;

  return (
    <section className="section py-10">
      <div className="container-x">
        {/* Bouton retour */}
        <Link 
          to="/projects" 
          className="inline-flex items-center gap-2 text-sm text-primary font-semibold mb-8 hover:underline transition"
        >
          <ArrowLeft className="h-4 w-4" /> {lang === "fr" ? "Tous les programmes" : "All programs"}
        </Link>

        {/* En-tête principal & Image de couverture */}
        <div className="grid gap-10 lg:grid-cols-2 items-start animate-fade-in">
          <div className="overflow-hidden rounded-2xl shadow-sm border border-border/50 bg-secondary/30">
            {mainImageSrc && (
              <img 
                src={mainImageSrc} 
                alt={title ?? ""} 
                className="w-full aspect-[4/3] object-cover transition-transform duration-700 hover:scale-105" 
              />
            )}
          </div>
          <div className="flex flex-col justify-center">
            {category && (
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full w-fit mb-3">
                {category}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">{title}</h1>
            {excerpt && <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{excerpt}</p>}
            {body && <p className="mt-6 text-sm sm:text-base text-foreground/90 leading-relaxed whitespace-pre-line border-l-2 border-primary/40 pl-4">{body}</p>}
          </div>
        </div>

        {/* GALERIE D'IMAGES STATIQUES */}
        <div className="mt-16 pt-10 border-t border-border/50">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">{lang === "fr" ? "Galerie photos" : "Photo Gallery"}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {lang === "fr" ? "Aperçu du programme sur le terrain" : "Program field preview"}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {staticImages.map((imgSrc, gi) => (
              <a
                key={gi}
                href={imgSrc}
                target="_blank"
                rel="noreferrer"
                className="group relative overflow-hidden rounded-2xl border border-border/40 shadow-sm aspect-[4/3] block bg-secondary animate-fade-in"
                style={{ animationDelay: `${gi * 120}ms`, animationFillMode: "both" }}
              >
                <img 
                  src={imgSrc} 
                  alt={`Galerie ${gi + 1}`} 
                  loading="lazy" 
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                  <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
                    <ExternalLink className="h-3.5 w-3.5" />
                    {lang === "fr" ? "Agrandir" : "Enlarge"}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
{/* 
        
        {subs && subs.length > 0 && (
          <div className="mt-16 pt-10 border-t border-border/50">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight">{lang === "fr" ? "Projets associés" : "Related Projects"}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {lang === "fr" ? "Initiatives complémentaires du programme" : "Complementary program initiatives"}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {subs.map((s, si) => {
                const st = lang === "fr" ? s.title_fr : s.title_en;
                const se = lang === "fr" ? s.excerpt_fr : s.excerpt_en;

                // Distribution propre des 3 images statiques
                const subImageSrc = staticImages[si % staticImages.length];

                return (
                  <article
                    key={s.id}
                    className="group card-soft overflow-hidden border border-border/50 rounded-2xl animate-fade-in hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col"
                    style={{ animationDelay: `${si * 100}ms`, animationFillMode: "both" }}
                  >
                    <div className="overflow-hidden aspect-[4/3] bg-secondary">
                      <img 
                        src={subImageSrc} 
                        alt={st ?? ""} 
                        loading="lazy" 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors">{st}</h3>
                        {se && <p className="mt-2 text-sm text-muted-foreground line-clamp-3 leading-relaxed">{se}</p>}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )} */}
      </div>
    </section>
  );
}