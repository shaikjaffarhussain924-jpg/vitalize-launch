import { createFileRoute } from "@tanstack/react-router";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { CLINIC } from "@/lib/constants";
import { useState } from "react";

const galleryImages: Record<string, string[]> = {
  "Before/After": [
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1588776813677-77aaf5595b83?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=600&q=80",
  ],
  "Clinic Photos": [
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1581093458791-9d42e3c50e89?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=600&q=80",
  ],
  "Events": [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1587825140708-dfaf18c4f4d4?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1464047736614-af63643285bf?auto=format&fit=crop&w=600&q=80",
  ],
  "Videos": [
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1588776813677-77aaf5595b83?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=600&q=80",
  ],
};

const captions: Record<string, string[]> = {
  "Before/After": ["Dental Restoration", "Skin Treatment", "Hair Transplant", "Facial Rejuvenation", "Orthodontic Results", "Dermal Fillers", "Laser Treatment", "Cosmetic Procedure", "Recovery Progress"],
  "Clinic Photos": ["Reception Area", "Consultation Room", "Diagnostic Lab", "Treatment Suite", "Waiting Lounge", "Operation Theatre", "Recovery Ward", "Equipment Room", "Exterior View"],
  "Events": ["Health Camp 2024", "Blood Donation Drive", "Medical Conference", "Community Outreach", "Doctor Meet", "Wellness Workshop", "Annual Day", "Award Ceremony", "Health Awareness"],
  "Videos": ["Patient Testimonial", "Procedure Walkthrough", "Doctor Interview", "Facility Tour", "Health Tips", "Treatment Demo", "Recovery Stories", "Expert Talk", "Clinic Overview"],
};

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
  const images = galleryImages[tab] || galleryImages["Before/After"];
  const labels = captions[tab] || captions["Before/After"];

  return (
    <div>
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: "Gallery" }]} />
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy-foreground">Our Gallery</h1>
          <p className="text-lg text-navy-foreground/70 mt-4">Explore our clinic, results, and events.</p>
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
            {images.map((src, i) => {
              const heights = ["aspect-square", "aspect-[3/4]", "aspect-video"];
              return (
                <AnimatedSection key={`${tab}-${i}`} delay={i * 50}>
                  <div className={`${heights[i % 3]} relative rounded-xl overflow-hidden border break-inside-avoid cursor-pointer group`}>
                    <img
                      src={src}
                      alt={labels[i]}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <ProgressiveBlur
                      direction="bottom"
                      blurLayers={5}
                      blurIntensity={0.4}
                      className="absolute inset-x-0 bottom-0 h-1/2"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-sm font-medium text-white">{labels[i]}</p>
                    </div>
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
