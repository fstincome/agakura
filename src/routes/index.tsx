import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { HeroCarousel } from "@/components/site/HeroCarousel";
import { ArrowRight, Phone, MapPin, Users, ShieldCheck, Leaf, GraduationCap, Sparkles } from "lucide-react";
import { createServerFn } from "@tanstack/react-start";

const getHeroSlides = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data } = await supabase
      .from("hero_slides")
      .select("*")
      .eq("published", true)
      .order("sort_order");
    return data ?? [];
  });

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AGAKURA Jeunesse Providence — Community Development NGO Burundi" },
      { name: "description", content: "Education, health, youth empowerment and environmental programs in Burundi since 1995." },
      { property: "og:title", content: "AGAKURA Jeunesse Providence" },
      { property: "og:description", content: "Community Development & Youth Empowerment NGO in Burundi." },
      { property: "og:image", content: "https://agakura.bi/visite.jpg" },
    ],
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["hero_slides"],
      queryFn: () => getHeroSlides({ data: undefined }),
    });
    return {};
  },
  component: Home,
});

function Home() {
  const { t, lang } = useI18n();
  const { data: projects } = useQuery({
    queryKey: ["projects", "home-programs"],
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

  return (
    <>
      <HeroCarousel />

      {/* INFO BAR */}
      <section className="container-x mt-8">
        <div className="rounded-full bg-primary text-primary-foreground px-4 sm:px-8 py-6 grid gap-6 sm:grid-cols-3 sm:divide-x sm:divide-white/20">
          <InfoCell icon={<Users />} title={t("stats.dev")} sub={t("stats.dev.sub")} />
          <InfoCell icon={<Phone />} title={t("stats.avail")} sub="(+257) 61 869 718" />
          <InfoCell icon={<MapPin />} title={t("stats.hq")} sub={t("stats.hq.sub")} />
        </div>
      </section>

      {/* LEGAL */}
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <div className="eyebrow">Compliance</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold">{t("legal.title")}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{t("legal.body")}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge icon={<ShieldCheck className="h-4 w-4" />}>{t("legal.tag1")}</Badge>
              <Badge icon={<Sparkles className="h-4 w-4" />}>{t("legal.tag2")}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src="https://agakura.bi/champs.jpg" alt="" className="rounded-2xl h-48 sm:h-64 w-full object-cover" />
            <img src="https://agakura.bi/travaux.jpg" alt="" className="rounded-2xl h-48 sm:h-64 w-full object-cover mt-8" />
          </div>
        </div>
      </section>

      {/* CORE DOMAINS */}
      <section className="section bg-secondary/40">
        <div className="container-x">
          <div className="text-center mb-12">
            <div className="eyebrow">{t("core.eyebrow")}</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold">{t("core.title")}</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <DomainCard icon={<GraduationCap className="h-6 w-6" />} title={t("core.youth.t")} body={t("core.youth.b")} />
            <DomainCard icon={<Users className="h-6 w-6" />} title={t("core.women.t")} body={t("core.women.b")} />
            <DomainCard icon={<Leaf className="h-6 w-6" />} title={t("core.env.t")} body={t("core.env.b")} />
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="section">
        <div className="container-x">
          <div className="text-center mb-12">
            <div className="eyebrow">{t("projects.eyebrow")}</div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold">{t("projects.title")}</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(projects ?? []).map((p) => (
              <article key={p.id} className="card-soft overflow-hidden group">
                <div className="aspect-[4/3] overflow-hidden bg-secondary">
                  {p.image_url && (
                    <img src={p.image_url} alt={lang === "fr" ? p.title_fr : p.title_en} className="h-full w-full object-cover transition group-hover:scale-105" />
                  )}
                </div>
                <div className="p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {lang === "fr" ? p.category_fr : p.category_en}
                  </div>
                  <h3 className="mt-1 font-bold">{lang === "fr" ? p.title_fr : p.title_en}</h3>
                  <Link to="/projects" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    {t("projects.details")} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function InfoCell({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-4 sm:px-6">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-white/15">{icon}</div>
      <div>
        <div className="font-bold italic">{title}</div>
        <div className="text-sm text-white/85">{sub}</div>
      </div>
    </div>
  );
}

function Badge({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground">
      {icon}{children}
    </span>
  );
}

function DomainCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="card-soft p-6 hover:-translate-y-1 transition">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</div>
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
