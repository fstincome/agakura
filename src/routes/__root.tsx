import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { I18nProvider } from "@/lib/i18n";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">Page not found.</p>
        <Link to="/" className="btn-primary mt-6">Go home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please try again.</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="btn-primary mt-6">Retry</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AGAKURA Jeunesse Providence — NGO Burundi" },
      { name: "description", content: "Community Development & Youth Empowerment NGO in Burundi since 1995." },
      { property: "og:title", content: "AGAKURA Jeunesse Providence — NGO Burundi" },
      { property: "og:description", content: "Community Development & Youth Empowerment NGO in Burundi since 1995." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AGAKURA Jeunesse Providence — NGO Burundi" },
      { name: "twitter:description", content: "Community Development & Youth Empowerment NGO in Burundi since 1995." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/47b50e5c-e98f-4d01-948c-dcb024c20583/id-preview-13ac2898--acad4b25-10ea-4967-9d70-ec81d2b32bae.lovable.app-1780922362915.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/47b50e5c-e98f-4d01-948c-dcb024c20583/id-preview-13ac2898--acad4b25-10ea-4967-9d70-ec81d2b32bae.lovable.app-1780922362915.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  useEffect(() => {
    const track = (path: string) => {
      if (path.startsWith("/admin") || path.startsWith("/auth") || path.startsWith("/api")) return;
      fetch("/api/public/track-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, referrer: document.referrer || "" }),
        keepalive: true,
      }).catch(() => {});
    };
    track(window.location.pathname);
    const unsub = router.subscribe("onResolved", ({ toLocation }) => track(toLocation.pathname));
    return () => unsub();
  }, [router]);
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1"><Outlet /></main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </I18nProvider>
    </QueryClientProvider>
  );
}
