import { createFileRoute } from "@tanstack/react-router";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CLINIC } from "@/lib/constants";
import { useState } from "react";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: `Gallery | ${CLINIC.name} — ${CLINIC.city}` },
      { name: "description", content: `View patient results, clinic photos, and events at ${CLINIC.name}, ${CLINIC.city}.` },
      { property: "og:title", content: `Gallery | ${CLINIC.name}` },
      { property: "og:description", content: `See our clinic facilities and patient results.` },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [tab, setTab] = useState("Before/After");
  const tabs = ["Before/After", "Clinic Photos", "Events", "Videos"];

  return (
    <div>
      <section className="bg-cream py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: "Gallery" }]} />
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy">Our Gallery</h1>
          <p className="text-lg text-muted-foreground mt-4">Explore our clinic, results, and events.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  tab === t ? "bg-navy text-navy-foreground" : "bg-accent text-foreground hover:bg-navy/10"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {Array.from({ length: 9 }).map((_, i) => {
              const heights = ["aspect-square", "aspect-[3/4]", "aspect-video"];
              return (
                <AnimatedSection key={i} delay={i * 50}>
                  <div className={`${heights[i % 3]} bg-accent rounded-xl flex items-center justify-center text-sm text-muted-foreground border break-inside-avoid cursor-pointer hover:opacity-90 transition-opacity`}>
                    {tab} {i + 1}
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
