import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — AGAKURA Jeunesse Providence" },
      { name: "description", content: "Impact projects: vocational training, women inclusion, vulnerable support, rural development." },
      { property: "og:title", content: "Our Projects — AGAKURA" },
      { property: "og:description", content: "Initiatives transforming lives in rural Burundi." },
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
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(data ?? []).map((p) => (
            <article key={p.id} className="card-soft overflow-hidden">
              {p.image_url && <img src={p.image_url} alt="" className="aspect-[4/3] w-full object-cover" />}
              <div className="p-6">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">{lang === "fr" ? p.category_fr : p.category_en}</div>
                <h3 className="mt-1 text-lg font-bold">{lang === "fr" ? p.title_fr : p.title_en}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-4">{lang === "fr" ? p.excerpt_fr : p.excerpt_en}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
