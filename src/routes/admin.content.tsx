import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Save, Pencil } from "lucide-react";
import { LangTabs, AdminInput, AdminTextArea } from "@/components/admin/LangTabs";

export const Route = createFileRoute("/admin/content")({ component: AdminContent });

type Row = {
  id: string; key: string; label: string | null;
  value_fr: string | null; value_en: string | null;
};
const empty: Row = { id: "", key: "", label: "", value_fr: "", value_en: "" };

function AdminContent() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const load = async () => {
    const { data } = await supabase.from("site_content").select("*").order("key");
    setRows((data as Row[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const { id, ...rest } = editing;
    if (!rest.key) return toast.error("Key is required");
    const op = id ? supabase.from("site_content").update(rest).eq("id", id) : supabase.from("site_content").insert(rest);
    const { error } = await op;
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEditing(null); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("site_content").delete().eq("id", id); load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Site content</h2>
          <p className="text-xs text-muted-foreground mt-1">Editable bilingual texts used across pages (About, Contact info…).</p>
        </div>
        <button onClick={() => setEditing(empty)} className="btn-primary"><Plus className="h-4 w-4" />New</button>
      </div>
      <div className="card-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left"><tr><th className="p-3">Key</th><th className="p-3">Label</th><th className="p-3">FR preview</th><th className="p-3"></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="p-3 font-mono text-xs">{r.key}</td>
                <td className="p-3 text-muted-foreground">{r.label}</td>
                <td className="p-3 text-muted-foreground truncate max-w-xs">{r.value_fr}</td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => setEditing(r)} className="text-primary"><Pencil className="h-4 w-4 inline" /></button>
                  <button onClick={() => remove(r.id)} className="text-destructive"><Trash2 className="h-4 w-4 inline" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center p-4 z-50" onClick={() => setEditing(null)}>
          <div className="bg-card rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto space-y-3" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold">{editing.id ? "Edit" : "New"} content</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <AdminInput label="Key (unique)" value={editing.key} onChange={(v) => setEditing({ ...editing, key: v })} />
              <AdminInput label="Label" value={editing.label ?? ""} onChange={(v) => setEditing({ ...editing, label: v })} />
            </div>
            <LangTabs
              fr={<AdminTextArea label="Valeur (FR)" rows={6} value={editing.value_fr ?? ""} onChange={(v) => setEditing({ ...editing, value_fr: v })} />}
              en={<AdminTextArea label="Value (EN)" rows={6} value={editing.value_en ?? ""} onChange={(v) => setEditing({ ...editing, value_en: v })} />}
            />
            <div className="flex gap-2 pt-2">
              <button onClick={save} className="btn-primary"><Save className="h-4 w-4" />Save</button>
              <button onClick={() => setEditing(null)} className="btn-outline">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
