import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export function useSiteContent() {
  const { lang } = useI18n();
  const { data } = useQuery({
    queryKey: ["site_content"],
    queryFn: async () => {
      const { data } = await supabase.from("site_content").select("key,value_fr,value_en");
      return data ?? [];
    },
  });
  const get = (key: string, fallback = "") => {
    const row = data?.find((r) => r.key === key);
    if (!row) return fallback;
    return (lang === "fr" ? row.value_fr : row.value_en) ?? fallback;
  };
  return { get };
}
