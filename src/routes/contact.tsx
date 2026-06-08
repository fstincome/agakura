import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Mail, MapPin, Send } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — AGAKURA Jeunesse Providence" },
      { name: "description", content: "Get in touch with AGAKURA Jeunesse Providence in Makebuko, Gitega, Burundi." },
      { property: "og:title", content: "Contact — AGAKURA" },
      { property: "og:description", content: "Reach out to our team in Burundi." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert(form);
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success(t("contact.sent"));
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section className="section">
      <div className="container-x grid gap-10 lg:grid-cols-2">
        <div>
          <div className="eyebrow">{t("nav.contact")}</div>
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold">{t("contact.title")}</h1>
          <p className="mt-4 text-muted-foreground">{t("contact.sub")}</p>
          <div className="mt-8 space-y-4">
            <Item icon={<Phone className="h-4 w-4" />} label="(+257) 61 869 718" />
            <Item icon={<Mail className="h-4 w-4" />} label="contact@agakura.bi" />
            <Item icon={<MapPin className="h-4 w-4" />} label="Makebuko, Gitega, Burundi" />
          </div>
        </div>
        <form onSubmit={submit} className="card-soft p-6 sm:p-8 space-y-4">
          <Field label={t("contact.name")} value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Field label={t("contact.email")} type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
          <Field label={t("contact.subject")} value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} />
          <div>
            <label className="text-sm font-medium mb-1.5 block">{t("contact.message")}</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button disabled={loading} className="btn-primary w-full">
            <Send className="h-4 w-4" /> {loading ? "..." : t("contact.send")}
          </button>
        </form>
      </div>
    </section>
  );
}

function Item({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
