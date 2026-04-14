import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { FloatingHeader } from "@/components/ui/floating-header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { MobileCTABar } from "@/components/MobileCTABar";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { CLINIC } from "@/lib/constants";
import { META_PIXEL_SCRIPT, GTM_SCRIPT, GA4_SCRIPT } from "@/lib/analytics";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold font-heading text-navy">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-gold-foreground hover:bg-gold/90 transition-all duration-300">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${CLINIC.name} — ${CLINIC.tagline} | ${CLINIC.city}` },
      { name: "description", content: `${CLINIC.name} offers advanced medical care in ${CLINIC.city}. NABH accredited, 25+ expert doctors. Book your appointment today.` },
      { name: "author", content: CLINIC.name },
      { name: "robots", content: "index, follow" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_IN" },
      { property: "og:site_name", content: CLINIC.name },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    ],
    scripts: [
      { children: META_PIXEL_SCRIPT },
      { children: GTM_SCRIPT },
      { src: `https://www.googletagmanager.com/gtag/js?id=${CLINIC.ga4Id}`, async: true },
      { children: GA4_SCRIPT },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <FloatingHeader />
      <main className="pt-20 pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <MobileCTABar />
      <ExitIntentPopup />
    </>
  );
}
