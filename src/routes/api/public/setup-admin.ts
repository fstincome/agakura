import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const EMAIL = "advaxe.mucatcha@gmail.com";
const PASSWORD = "Nadvaxe";

export const Route = createFileRoute("/api/public/setup-admin")({
  server: {
    handlers: {
      GET: async () => {
        // Find or create user
        let userId: string | null = null;
        const { data: list } = await supabaseAdmin.auth.admin.listUsers();
        const existing = list?.users?.find((u) => u.email?.toLowerCase() === EMAIL.toLowerCase());
        if (existing) {
          userId = existing.id;
          await supabaseAdmin.auth.admin.updateUserById(userId, { password: PASSWORD, email_confirm: true });
        } else {
          const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: EMAIL,
            password: PASSWORD,
            email_confirm: true,
            user_metadata: { full_name: "Advaxe Mucatcha" },
          });
          if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
          userId = data.user?.id ?? null;
        }
        if (!userId) return Response.json({ ok: false, error: "no user" }, { status: 500 });

        // Ensure profile
        await supabaseAdmin.from("profiles").upsert({ id: userId, email: EMAIL, full_name: "Advaxe Mucatcha" });

        // Assign super_admin role
        const { error: rErr } = await supabaseAdmin
          .from("user_roles")
          .upsert({ user_id: userId, role: "super_admin" }, { onConflict: "user_id,role" });
        if (rErr) return Response.json({ ok: false, error: rErr.message }, { status: 500 });

        return Response.json({ ok: true, userId, email: EMAIL });
      },
    },
  },
});
