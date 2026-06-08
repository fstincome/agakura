import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/messages")({ component: Messages });

type Row = { id: string; name: string; email: string; subject: string | null; message: string; created_at: string };

function Messages() {
  const [rows, setRows] = useState<Row[]>([]);
  const load = async () => {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setRows((data as Row[]) ?? []);
  };
  useEffect(() => { load(); }, []);
  const del = async (id: string) => { await supabase.from("contact_messages").delete().eq("id", id); load(); };
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Contact messages</h2>
      {rows.length === 0 && <p className="text-muted-foreground text-sm">No messages yet.</p>}
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.id} className="card-soft p-5">
            <div className="flex justify-between items-start gap-3">
              <div>
                <div className="font-bold">{r.name} <span className="text-sm font-normal text-muted-foreground">· {r.email}</span></div>
                {r.subject && <div className="text-sm font-medium text-primary">{r.subject}</div>}
                <p className="mt-2 text-sm whitespace-pre-wrap">{r.message}</p>
                <div className="mt-2 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</div>
              </div>
              <button onClick={() => del(r.id)} className="text-destructive p-2 hover:bg-destructive/10 rounded"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
