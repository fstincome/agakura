import { useState, type ReactNode } from "react";

export function LangTabs({ fr, en }: { fr: ReactNode; en: ReactNode }) {
  const [tab, setTab] = useState<"fr" | "en">("fr");
  return (
    <div>
      <div className="inline-flex items-center gap-0.5 rounded-full border border-border p-0.5 text-xs font-semibold mb-3">
        <button
          type="button"
          onClick={() => setTab("fr")}
          className={`px-3 py-1.5 rounded-full transition ${tab === "fr" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          🇫🇷 Français
        </button>
        <button
          type="button"
          onClick={() => setTab("en")}
          className={`px-3 py-1.5 rounded-full transition ${tab === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          🇬🇧 English
        </button>
      </div>
      <div className="space-y-3">{tab === "fr" ? fr : en}</div>
    </div>
  );
}

export const AdminInput = ({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) => (
  <div>
    <label className="text-xs font-medium mb-1 block">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
  </div>
);

export const AdminTextArea = ({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) => (
  <div>
    <label className="text-xs font-medium mb-1 block">{label}</label>
    <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
  </div>
);
