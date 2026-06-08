import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Save, Pencil } from "lucide-react";
import { LangTabs, AdminInput, AdminTextArea } from "@/components/admin/LangTabs";
import { ImageUpload } from "@/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/hero")({ component: AdminHero });

type Row = {
  id: string;
  title_fr: string; title_en: string;
  subtitle_fr: string | null; subtitle_en: string | null;
  cta_label_fr: string | null; cta_label_en: string | null;
  cta_href: string | null;
  image_url: string | null;
  sort_order: number; published: boolean;
};
const empty: Row = { id: "", title_fr: "", title_en: "", subtitle_fr: "", subtitle_en: "", cta_label_fr: "", cta_label_en: "", cta_href: "/projects", image_url: "", sort_order: 0, published: true };

function AdminHero() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const load = async () => {
    const { data } = await supabase.from("hero_slides").select("*").order("sort_order");
    setRows((data as Row[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const { id, ...rest } = editing;
    const op = id ? supabase.from("hero_slides").update(rest).eq("id", id) : supabase.from("hero_slides").insert(rest);
    const { error } = await op;
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEditing(null); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("hero_slides").delete().eq("id", id); load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Hero slides</h2>
        <button onClick={() => setEditing(empty)} className="btn-primary"><Plus className="h-4 w-4" />New</button>
      </div>
      <div className="card-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left"><tr><th className="p-3">Order</th><th className="p-3">Title</th><th className="p-3">Pub</th><th className="p-3"></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="p-3">{r.sort_order}</td>
                <td className="p-3 font-medium">{r.title_fr || r.title_en}</td>
                <td className="p-3">{r.published ? "✓" : "—"}</td>
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
            <h3 className="text-lg font-bold">{editing.id ? "Edit" : "New"} slide</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <AdminInput label="Sort order" type="number" value={String(editing.sort_order)} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) || 0 })} />
              <AdminInput label="CTA href" value={editing.cta_href ?? ""} onChange={(v) => setEditing({ ...editing, cta_href: v })} />
            </div>
            <ImageUpload label="Background image" value={editing.image_url ?? ""} onChange={(v) => setEditing({ ...editing, image_url: v })} />
            <LangTabs
              fr={
                <>
                  <AdminInput label="Titre (FR)" value={editing.title_fr} onChange={(v) => setEditing({ ...editing, title_fr: v })} />
                  <AdminTextArea label="Sous-titre (FR)" value={editing.subtitle_fr ?? ""} onChange={(v) => setEditing({ ...editing, subtitle_fr: v })} />
                  <AdminInput label="Libellé CTA (FR)" value={editing.cta_label_fr ?? ""} onChange={(v) => setEditing({ ...editing, cta_label_fr: v })} />
                </>
              }
              en={
                <>
                  <AdminInput label="Title (EN)" value={editing.title_en} onChange={(v) => setEditing({ ...editing, title_en: v })} />
                  <AdminTextArea label="Subtitle (EN)" value={editing.subtitle_en ?? ""} onChange={(v) => setEditing({ ...editing, subtitle_en: v })} />
                  <AdminInput label="CTA label (EN)" value={editing.cta_label_en ?? ""} onChange={(v) => setEditing({ ...editing, cta_label_en: v })} />
                </>
              }
            />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />Published</label>
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
