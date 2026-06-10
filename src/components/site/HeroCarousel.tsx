import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { createServerFn } from "@tanstack/react-start";

export function HeroCarousel() {
  const { lang, t } = useI18n();
  const { data: slides } = useQuery({
    queryKey: ["hero_slides"],
    queryFn: async () => {
      const { data } = await supabase
        .from("hero_slides")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      return data ?? [];
    },
  });
  const list = slides ?? [];
  const [i, setI] = useState(0);

  useEffect(() => {
    if (list.length < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % list.length), 5500);
    return () => clearInterval(id);
  }, [list.length]);

  useEffect(() => {
    if (i >= list.length) setI(0);
  }, [list.length, i]);

  if (list.length === 0) {
    return (
      <div className="container-x pt-8">
        <div className="h-[420px] sm:h-[560px] rounded-3xl bg-secondary animate-pulse" />
      </div>
    );
  }

  const s = list[i] ?? list[0];
  const title = lang === "fr" ? s.title_fr : s.title_en;
  const sub = lang === "fr" ? s.subtitle_fr : s.subtitle_en;
  const cta = lang === "fr" ? s.cta_label_fr : s.cta_label_en;

  return (
    <section className="container-x pt-8">
      <div className="relative overflow-hidden rounded-3xl">
        {list.map((slide, idx) => (
          <img
            key={slide.id}
            src={slide.image_url ?? ""}
            alt=""
            className={`h-[420px] sm:h-[560px] w-full object-cover transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0 absolute inset-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex items-end">
          <div key={s.id} className="p-6 sm:p-12 max-w-3xl text-white animate-fade-in">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-3">
              {t("hero.eyebrow")}
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold leading-[1.05] italic">{title}</h1>
            {sub && (
              <p className="mt-5 text-sm sm:text-base text-white/85 max-w-2xl border-l-2 border-primary pl-4">{sub}</p>
            )}
            <div className="mt-7 flex flex-wrap gap-3">
              {cta && s.cta_href && (
                <Link to={s.cta_href} className="btn-primary">
                  {cta} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <Link to="/contact" className="btn-outline bg-white/10 border-white/30 text-white hover:bg-white/20">
                {t("hero.cta2")}
              </Link>
            </div>
          </div>
        </div>

        {list.length > 1 && (
          <>
            <button
              aria-label="Previous"
              onClick={() => setI((x) => (x - 1 + list.length) % list.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              aria-label="Next"
              onClick={() => setI((x) => (x + 1) % list.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {list.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Slide ${idx + 1}`}
                  onClick={() => setI(idx)}
                  className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-white" : "w-3 bg-white/50"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
