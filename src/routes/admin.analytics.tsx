import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Globe, CalendarDays, Users } from "lucide-react";

export const Route = createFileRoute("/admin/analytics")({ component: Analytics });

type Visit = { id: string; path: string; country: string | null; visited_at: string };

const COUNTRY_NAMES: Record<string, string> = {
  BI: "🇧🇮 Burundi", FR: "🇫🇷 France", US: "🇺🇸 USA", BE: "🇧🇪 Belgique",
  CA: "🇨🇦 Canada", CD: "🇨🇩 RDC", RW: "🇷🇼 Rwanda", TZ: "🇹🇿 Tanzanie",
  UG: "🇺🇬 Ouganda", KE: "🇰🇪 Kenya", GB: "🇬🇧 UK", DE: "🇩🇪 Allemagne",
  CH: "🇨🇭 Suisse", NL: "🇳🇱 Pays-Bas",
};

function Analytics() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const since = new Date(Date.now() - days * 86400000).toISOString();
      const { data } = await supabase
        .from("page_visits")
        .select("id,path,country,visited_at")
        .gte("visited_at", since)
        .order("visited_at", { ascending: false })
        .limit(5000);
      setVisits((data as Visit[]) ?? []);
      setLoading(false);
    })();
  }, [days]);

  const byCountry = useMemo(() => {
    const m = new Map<string, number>();
    visits.forEach((v) => {
      const k = v.country || "??";
      m.set(k, (m.get(k) ?? 0) + 1);
    });
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [visits]);

  const byDay = useMemo(() => {
    const m = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      m.set(d, 0);
    }
    visits.forEach((v) => {
      const d = v.visited_at.slice(0, 10);
      if (m.has(d)) m.set(d, (m.get(d) ?? 0) + 1);
    });
    return [...m.entries()];
  }, [visits, days]);

  const maxDay = Math.max(1, ...byDay.map(([, c]) => c));
  const maxCountry = Math.max(1, ...byCountry.map(([, c]) => c));
  const total = visits.length;
  const uniqueCountries = byCountry.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Analytics visiteurs</h2>
        <div className="inline-flex rounded-full border border-border p-0.5 text-xs font-semibold">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-full transition ${days === d ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              {d}j
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={<Users className="h-5 w-5 text-primary" />} label="Visites totales" value={total} />
        <Stat icon={<Globe className="h-5 w-5 text-primary" />} label="Pays uniques" value={uniqueCountries} />
        <Stat icon={<CalendarDays className="h-5 w-5 text-primary" />} label="Période" value={`${days} jours`} />
      </div>

      {loading && <p className="text-sm text-muted-foreground">Chargement…</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-soft p-5">
          <h3 className="font-bold mb-4 flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Visites par jour</h3>
          <div className="flex items-end gap-1 h-48">
            {byDay.map(([d, c]) => (
              <div key={d} className="flex-1 flex flex-col items-center gap-1 group" title={`${d}: ${c}`}>
                <div className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100">{c}</div>
                <div
                  className="w-full bg-primary/80 hover:bg-primary rounded-t transition-all"
                  style={{ height: `${(c / maxDay) * 100}%`, minHeight: c > 0 ? 2 : 0 }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
            <span>{byDay[0]?.[0]}</span>
            <span>{byDay[byDay.length - 1]?.[0]}</span>
          </div>
        </div>

        <div className="card-soft p-5">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Globe className="h-4 w-4" /> Visites par pays</h3>
          {byCountry.length === 0 && <p className="text-sm text-muted-foreground">Aucune donnée.</p>}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {byCountry.map(([code, count]) => (
              <div key={code} className="flex items-center gap-3 text-sm">
                <div className="w-32 truncate font-medium">{COUNTRY_NAMES[code] || code}</div>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(count / maxCountry) * 100}%` }} />
                </div>
                <div className="w-12 text-right tabular-nums text-muted-foreground">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="card-soft p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{label}</div>
        {icon}
      </div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </div>
  );
}
