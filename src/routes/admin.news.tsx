import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Save, Pencil } from "lucide-react";
import { LangTabs, AdminInput, AdminTextArea } from "@/components/admin/LangTabs";

export const Route = createFileRoute("/admin/news")({ component: AdminNews });

type Row = {
  id: string; slug: string;
  title_en: string; title_fr: string;
  excerpt_en: string | null; excerpt_fr: string | null;
  body_en: string | null; body_fr: string | null;
  image_url: string | null; published: boolean; published_at: string;
};
const empty: Row = { id: "", slug: "", title_en: "", title_fr: "", excerpt_en: "", excerpt_fr: "", body_en: "", body_fr: "", image_url: "", published: true, published_at: new Date().toISOString() };

function AdminNews() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const load = async () => {
    const { data } = await supabase.from("news").select("*").order("published_at", { ascending: false });
    setRows((data as Row[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const { id, ...rest } = editing;
    const payload = { ...rest, slug: rest.slug || rest.title_en.toLowerCase().replace(/\s+/g, "-") };
    const op = id ? supabase.from("news").update(payload).eq("id", id) : supabase.from("news").insert(payload);
    const { error } = await op;
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEditing(null); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("news").delete().eq("id", id); load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">News</h2>
        <button onClick={() => setEditing(empty)} className="btn-primary"><Plus className="h-4 w-4" />New</button>
      </div>
      <div className="card-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left"><tr><th className="p-3">Title</th><th className="p-3">Date</th><th className="p-3">Pub</th><th className="p-3"></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="p-3 font-medium">{r.title_fr || r.title_en}</td>
                <td className="p-3 text-muted-foreground">{new Date(r.published_at).toLocaleDateString()}</td>
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
            <h3 className="text-lg font-bold">{editing.id ? "Edit" : "New"} news</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <AdminInput label="Slug" value={editing.slug} onChange={(v) => setEditing({ ...editing, slug: v })} />
              <AdminInput label="Date" type="date" value={editing.published_at.slice(0, 10)} onChange={(v) => setEditing({ ...editing, published_at: new Date(v).toISOString() })} />
            </div>
            <AdminInput label="Image URL" value={editing.image_url ?? ""} onChange={(v) => setEditing({ ...editing, image_url: v })} />
            <LangTabs
              fr={
                <>
                  <AdminInput label="Titre (FR)" value={editing.title_fr} onChange={(v) => setEditing({ ...editing, title_fr: v })} />
                  <AdminTextArea label="Extrait (FR)" value={editing.excerpt_fr ?? ""} onChange={(v) => setEditing({ ...editing, excerpt_fr: v })} />
                  <AdminTextArea label="Contenu (FR)" rows={8} value={editing.body_fr ?? ""} onChange={(v) => setEditing({ ...editing, body_fr: v })} />
                </>
              }
              en={
                <>
                  <AdminInput label="Title (EN)" value={editing.title_en} onChange={(v) => setEditing({ ...editing, title_en: v })} />
                  <AdminTextArea label="Excerpt (EN)" value={editing.excerpt_en ?? ""} onChange={(v) => setEditing({ ...editing, excerpt_en: v })} />
                  <AdminTextArea label="Body (EN)" rows={8} value={editing.body_en ?? ""} onChange={(v) => setEditing({ ...editing, body_en: v })} />
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
