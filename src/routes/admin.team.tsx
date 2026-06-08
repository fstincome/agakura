import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Save, Pencil } from "lucide-react";
import { LangTabs, AdminInput, AdminTextArea } from "@/components/admin/LangTabs";
import { ImageUpload } from "@/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/team")({ component: AdminTeam });

type Row = {
  id: string; name: string;
  role_fr: string | null; role_en: string | null;
  bio_fr: string | null; bio_en: string | null;
  photo_url: string | null;
  sort_order: number; published: boolean;
};
const empty: Row = { id: "", name: "", role_fr: "", role_en: "", bio_fr: "", bio_en: "", photo_url: "", sort_order: 0, published: true };

function AdminTeam() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const load = async () => {
    const { data } = await supabase.from("team_members").select("*").order("sort_order");
    setRows((data as Row[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const { id, ...rest } = editing;
    const op = id ? supabase.from("team_members").update(rest).eq("id", id) : supabase.from("team_members").insert(rest);
    const { error } = await op;
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEditing(null); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("team_members").delete().eq("id", id); load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Team</h2>
        <button onClick={() => setEditing(empty)} className="btn-primary"><Plus className="h-4 w-4" />New</button>
      </div>
      <div className="card-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left"><tr><th className="p-3">Name</th><th className="p-3">Role</th><th className="p-3">Pub</th><th className="p-3"></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3 text-muted-foreground">{r.role_fr || r.role_en}</td>
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
            <h3 className="text-lg font-bold">{editing.id ? "Edit" : "New"} member</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <AdminInput label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
              <AdminInput label="Sort order" type="number" value={String(editing.sort_order)} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) || 0 })} />
            </div>
            <ImageUpload label="Photo" value={editing.photo_url ?? ""} onChange={(v) => setEditing({ ...editing, photo_url: v })} />
            <LangTabs
              fr={
                <>
                  <AdminInput label="Rôle (FR)" value={editing.role_fr ?? ""} onChange={(v) => setEditing({ ...editing, role_fr: v })} />
                  <AdminTextArea label="Bio (FR)" value={editing.bio_fr ?? ""} onChange={(v) => setEditing({ ...editing, bio_fr: v })} />
                </>
              }
              en={
                <>
                  <AdminInput label="Role (EN)" value={editing.role_en ?? ""} onChange={(v) => setEditing({ ...editing, role_en: v })} />
                  <AdminTextArea label="Bio (EN)" value={editing.bio_en ?? ""} onChange={(v) => setEditing({ ...editing, bio_en: v })} />
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
