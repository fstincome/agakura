import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Target, Eye, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — AGAKURA Jeunesse Providence" },
      { name: "description", content: "Learn about AGAKURA Jeunesse Providence, a Burundi NGO active since 1995." },
      { property: "og:title", content: "About AGAKURA Jeunesse Providence" },
      { property: "og:description", content: "Our mission, vision and values for community development in Burundi." },
    ],
  }),
  component: About,
});

function About() {
  const { t } = useI18n();
  return (
    <>
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <div className="eyebrow">AGAKURA</div>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold">{t("about.title")}</h1>
            <p className="mt-5 text-muted-foreground leading-relaxed">{t("about.body")}</p>
          </div>
          <img src="https://agakura.bi/champs.jpg" alt="" className="rounded-3xl object-cover h-[420px] w-full" />
        </div>
      </section>
      <section className="section bg-secondary/40">
        <div className="container-x grid gap-5 md:grid-cols-3">
          {[
            { i: <Target />, t: t("about.mission"), b: t("about.mission.b") },
            { i: <Eye />, t: t("about.vision"), b: t("about.vision.b") },
            { i: <Heart />, t: t("about.values"), b: t("about.values.b") },
          ].map((x, i) => (
            <div key={i} className="card-soft p-7">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">{x.i}</div>
              <h3 className="mt-4 text-xl font-bold">{x.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{x.b}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
