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
  first_name: string | null; last_name: string | null;
  role_fr: string | null; role_en: string | null;
  position_fr: string | null; position_en: string | null;
  bio_fr: string | null; bio_en: string | null;
  photo_url: string | null;
  linkedin_url: string | null; twitter_url: string | null;
  sort_order: number; published: boolean;
};
const empty: Row = {
  id: "", name: "", first_name: "", last_name: "",
  role_fr: "", role_en: "", position_fr: "", position_en: "",
  bio_fr: "", bio_en: "", photo_url: "",
  linkedin_url: "", twitter_url: "",
  sort_order: 0, published: true,
};

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
    // Auto-fill name from first/last if empty
    if (!rest.name && (rest.first_name || rest.last_name)) {
      rest.name = [rest.first_name, rest.last_name].filter(Boolean).join(" ");
    }
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => {
          const fullName = [r.first_name, r.last_name].filter(Boolean).join(" ") || r.name;
          return (
            <div key={r.id} className="card-soft overflow-hidden flex flex-col">
              {r.photo_url ? (
                <img src={r.photo_url} alt={fullName} className="w-full aspect-[4/3] object-cover" />
              ) : (
                <div className="w-full aspect-[4/3] grid place-items-center bg-gradient-to-br from-primary to-accent text-white font-bold text-3xl">
                  {fullName.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                </div>
              )}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold">{fullName}</div>
                    <div className="text-xs text-primary font-medium">{r.position_fr || r.position_en || r.role_fr || r.role_en}</div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${r.published ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>{r.published ? "Publié" : "Brouillon"}</span>
                </div>
                {(r.bio_fr || r.bio_en) && (
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    {r.bio_fr && <p className="line-clamp-3"><span className="font-semibold text-foreground/70">FR:</span> {r.bio_fr}</p>}
                    {r.bio_en && <p className="line-clamp-3"><span className="font-semibold text-foreground/70">EN:</span> {r.bio_en}</p>}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                  {r.linkedin_url && <a href={r.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-primary truncate max-w-[140px]">LinkedIn ↗</a>}
                  {r.twitter_url && <a href={r.twitter_url} target="_blank" rel="noreferrer" className="hover:text-primary truncate max-w-[140px]">Twitter ↗</a>}
                </div>
                <div className="flex gap-2 mt-auto pt-3 border-t border-border">
                  <button onClick={() => setEditing(r)} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"><Pencil className="h-3.5 w-3.5" />Éditer</button>
                  <button onClick={() => remove(r.id)} className="inline-flex items-center gap-1 text-xs font-semibold text-destructive hover:underline ml-auto"><Trash2 className="h-3.5 w-3.5" />Supprimer</button>
                </div>
              </div>
            </div>
          );
        })}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">Aucun membre.</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center p-4 z-50" onClick={() => setEditing(null)}>
          <div className="bg-card rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto space-y-3" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold">{editing.id ? "Edit" : "New"} member</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <AdminInput label="Prénom / First name" value={editing.first_name ?? ""} onChange={(v) => setEditing({ ...editing, first_name: v })} />
              <AdminInput label="Nom / Last name" value={editing.last_name ?? ""} onChange={(v) => setEditing({ ...editing, last_name: v })} />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <AdminInput label="Display name (optional)" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
              <AdminInput label="Sort order" type="number" value={String(editing.sort_order)} onChange={(v) => setEditing({ ...editing, sort_order: Number(v) || 0 })} />
            </div>
            <ImageUpload label="Profile photo" value={editing.photo_url ?? ""} onChange={(v) => setEditing({ ...editing, photo_url: v })} />
            <div className="grid sm:grid-cols-2 gap-3">
              <AdminInput label="LinkedIn URL" value={editing.linkedin_url ?? ""} onChange={(v) => setEditing({ ...editing, linkedin_url: v })} />
              <AdminInput label="Twitter / X URL" value={editing.twitter_url ?? ""} onChange={(v) => setEditing({ ...editing, twitter_url: v })} />
            </div>
            <LangTabs
              fr={
                <>
                  <AdminInput label="Poste (FR)" value={editing.position_fr ?? ""} onChange={(v) => setEditing({ ...editing, position_fr: v })} />
                  <AdminTextArea label="Bio (FR)" value={editing.bio_fr ?? ""} onChange={(v) => setEditing({ ...editing, bio_fr: v })} />
                </>
              }
              en={
                <>
                  <AdminInput label="Position (EN)" value={editing.position_en ?? ""} onChange={(v) => setEditing({ ...editing, position_en: v })} />
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
