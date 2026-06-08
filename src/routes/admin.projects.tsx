import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Save, Pencil } from "lucide-react";

export const Route = createFileRoute("/admin/projects")({ component: AdminProjects });

type Row = {
  id: string;
  slug: string;
  title_en: string;
  title_fr: string;
  category_en: string | null;
  category_fr: string | null;
  excerpt_en: string | null;
  excerpt_fr: string | null;
  image_url: string | null;
  published: boolean;
  sort_order: number;
};

const empty: Row = {
  id: "", slug: "", title_en: "", title_fr: "", category_en: "", category_fr: "",
  excerpt_en: "", excerpt_fr: "", image_url: "", published: true, sort_order: 0,
};

function AdminProjects() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);

  const load = async () => {
    const { data } = await supabase.from("projects").select("*").order("sort_order");
    setRows((data as Row[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const { id, ...rest } = editing;
    const payload = { ...rest, slug: rest.slug || rest.title_en.toLowerCase().replace(/\s+/g, "-") };
    const op = id ? supabase.from("projects").update(payload).eq("id", id) : supabase.from("projects").insert(payload);
    const { error } = await op;
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEditing(null); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Projects</h2>
        <button onClick={() => setEditing(empty)} className="btn-primary"><Plus className="h-4 w-4" />New</button>
      </div>
      <div className="card-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left">
            <tr><th className="p-3">Title</th><th className="p-3">Category</th><th className="p-3">Pub</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="p-3 font-medium">{r.title_en}</td>
                <td className="p-3 text-muted-foreground">{r.category_en}</td>
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
            <h3 className="text-lg font-bold">{editing.id ? "Edit" : "New"} project</h3>
            <Grid>
              <Input label="Slug" value={editing.slug} onChange={(v) => setEditing({ ...editing, slug: v })} />
              <Input label="Sort order" type="number" value={String(editing.sort_order)} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) || 0 })} />
              <Input label="Title (FR)" value={editing.title_fr} onChange={(v) => setEditing({ ...editing, title_fr: v })} />
              <Input label="Title (EN)" value={editing.title_en} onChange={(v) => setEditing({ ...editing, title_en: v })} />
              <Input label="Category (FR)" value={editing.category_fr ?? ""} onChange={(v) => setEditing({ ...editing, category_fr: v })} />
              <Input label="Category (EN)" value={editing.category_en ?? ""} onChange={(v) => setEditing({ ...editing, category_en: v })} />
            </Grid>
            <TextArea label="Excerpt (FR)" value={editing.excerpt_fr ?? ""} onChange={(v) => setEditing({ ...editing, excerpt_fr: v })} />
            <TextArea label="Excerpt (EN)" value={editing.excerpt_en ?? ""} onChange={(v) => setEditing({ ...editing, excerpt_en: v })} />
            <Input label="Image URL" value={editing.image_url ?? ""} onChange={(v) => setEditing({ ...editing, image_url: v })} />
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

const Grid = ({ children }: { children: React.ReactNode }) => <div className="grid sm:grid-cols-2 gap-3">{children}</div>;
const Input = ({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) => (
  <div><label className="text-xs font-medium mb-1 block">{label}</label><input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" /></div>
);
const TextArea = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div><label className="text-xs font-medium mb-1 block">{label}</label><textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" /></div>
);
