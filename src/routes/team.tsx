import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Linkedin, Twitter, X as XIcon, User } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — AGAKURA Jeunesse Providence" },
      { name: "description", content: "Meet the team behind AGAKURA Jeunesse Providence." },
      { property: "og:title", content: "Our Team — AGAKURA" },
      { property: "og:description", content: "A dedicated team serving Burundi communities since 1995." },
    ],
  }),
  component: Team,
});

type Member = {
  id: string; name: string;
  first_name: string | null; last_name: string | null;
  role_fr: string | null; role_en: string | null;
  position_fr: string | null; position_en: string | null;
  bio_fr: string | null; bio_en: string | null;
  photo_url: string | null;
  linkedin_url: string | null; twitter_url: string | null;
};

function Team() {
  const { t, lang } = useI18n();
  const [openId, setOpenId] = useState<string | null>(null);
  const { data } = useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const { data } = await supabase
        .from("team_members")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      return (data as Member[]) ?? [];
    },
  });
  const members = data ?? [];
  const open = members.find((m) => m.id === openId) ?? null;

  const displayName = (m: Member) =>
    [m.first_name, m.last_name].filter(Boolean).join(" ") || m.name;
  const position = (m: Member) =>
    (lang === "fr" ? m.position_fr : m.position_en) || (lang === "fr" ? m.role_fr : m.role_en);
  const groupLabel = (m: Member) => (lang === "fr" ? m.role_fr : m.role_en) || "";
  const bio = (m: Member) => (lang === "fr" ? m.bio_fr : m.bio_en);

  const groups = members.reduce<Record<string, Member[]>>((acc, m) => {
    const key = groupLabel(m) || "—";
    (acc[key] ||= []).push(m);
    return acc;
  }, {});
  const groupOrder = Object.keys(groups);

  return (
    <section className="section">
      <div className="container-x">
        <div className="max-w-2xl">
          <div className="eyebrow">{t("nav.team")}</div>
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold">{t("team.title")}</h1>
          <p className="mt-4 text-muted-foreground">{t("team.sub")}</p>
        </div>
        {groupOrder.map((g) => (
          <div key={g} className="mt-14">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold">{g}</h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {groups[g].map((m) => (
                <div key={m.id} className="card-soft overflow-hidden flex flex-col">
                  {m.photo_url ? (
                    <img src={m.photo_url} alt={displayName(m)} className="w-full aspect-[4/3] object-cover" />
                  ) : (
                    <div className="w-full aspect-[4/3] grid place-items-center bg-gradient-to-br from-primary to-accent text-white font-bold text-4xl">
                      {displayName(m).split(" ").map((s) => s[0]).join("").slice(0, 2)}
                    </div>
                  )}
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div>
                      <div className="font-bold text-lg">{displayName(m)}</div>
                      <div className="text-sm text-primary font-medium">{position(m)}</div>
                    </div>
                    {bio(m) && (
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{bio(m)}</p>
                    )}
                    <div className="flex items-center gap-3 mt-auto pt-2">
                      {m.linkedin_url && (
                        <a href={m.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {m.twitter_url && (
                        <a href={m.twitter_url} target="_blank" rel="noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-primary">
                          <Twitter className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/60 grid place-items-center p-4 z-50" onClick={() => setOpenId(null)}>
          <div className="bg-card rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                {open.photo_url && (
                  <img src={open.photo_url} alt={displayName(open)} className="h-16 w-16 rounded-full object-cover" />
                )}
                <div>
                  <div className="font-bold text-lg">{displayName(open)}</div>
                  <div className="text-sm text-muted-foreground">{position(open)}</div>
                </div>
              </div>
              <button onClick={() => setOpenId(null)} className="text-muted-foreground hover:text-foreground">
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-foreground/90 whitespace-pre-line">{bio(open)}</p>
            {(open.linkedin_url || open.twitter_url) && (
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                {open.linkedin_url && (
                  <a href={open.linkedin_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                )}
                {open.twitter_url && (
                  <a href={open.twitter_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                    <Twitter className="h-4 w-4" /> Twitter
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
