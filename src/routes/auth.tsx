import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Login — AGAKURA Admin" }] }),
  component: Auth,
});

function Auth() {
  const { t } = useI18n();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/admin" });
    });
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Connected");
    nav({ to: "/admin" });
  };

  return (
    <section className="min-h-[80vh] grid place-items-center px-4 py-16">
      <div className="w-full max-w-md card-soft p-8">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary mx-auto">
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-center">{t("auth.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground text-center">{t("auth.sub")}</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button disabled={loading} className="btn-primary w-full">{loading ? "..." : t("auth.signin")}</button>
        </form>
        <Link to="/" className="block mt-4 text-center text-xs text-muted-foreground hover:text-foreground">← Back</Link>
      </div>
    </section>
  );
}
