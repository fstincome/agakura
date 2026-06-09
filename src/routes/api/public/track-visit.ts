import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/track-visit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json().catch(() => ({}))) as {
            path?: string;
            referrer?: string;
          };
          const path = (body.path || "/").slice(0, 500);
          const referrer = (body.referrer || "").slice(0, 500) || null;
          const userAgent = (request.headers.get("user-agent") || "").slice(0, 500);
          const country =
            request.headers.get("cf-ipcountry") ||
            request.headers.get("x-vercel-ip-country") ||
            request.headers.get("x-country") ||
            null;

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          await supabaseAdmin.from("page_visits").insert({
            path,
            country,
            user_agent: userAgent,
            referrer,
          });
          return new Response("ok");
        } catch (e) {
          return new Response("ok");
        }
      },
    },
  },
});
