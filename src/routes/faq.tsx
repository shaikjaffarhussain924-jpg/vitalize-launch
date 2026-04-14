import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CLINIC, FAQ_DATA } from "@/lib/constants";
import { useState } from "react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: `FAQ | ${CLINIC.name} — ${CLINIC.city}` },
      { name: "description", content: `Frequently asked questions about ${CLINIC.name}. Find answers about appointments, insurance, treatments, and more.` },
      { property: "og:title", content: `FAQ | ${CLINIC.name}` },
      { property: "og:description", content: `Answers to common questions about our clinic.` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: Object.values(FAQ_DATA).flat().map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }),
      },
    ],
  }),
  component: FAQPage,
});

function FAQPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("General");
  const categories = Object.keys(FAQ_DATA);

  const filteredFaqs = search
    ? Object.values(FAQ_DATA).flat().filter((f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
    : (FAQ_DATA as any)[activeCategory] || [];

  return (
    <div>
      <section className="bg-cream py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: "FAQ" }]} />
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy">Frequently Asked Questions</h1>
          <div className="relative mt-6 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl bg-card text-base"
            />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          {!search && (
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === c ? "bg-navy text-navy-foreground" : "bg-accent hover:bg-navy/10"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-3">
            {filteredFaqs.map((faq: { q: string; a: string }, i: number) => (
              <AnimatedSection key={i} delay={i * 50}>
                <details className="bg-card rounded-lg border p-4 group">
                  <summary className="font-medium text-navy cursor-pointer list-none flex justify-between items-center">
                    {faq.q}
                    <span className="text-gold group-open:rotate-45 transition-transform text-xl ml-2">+</span>
                  </summary>
                  <p className="text-sm text-muted-foreground mt-3">{faq.a}</p>
                </details>
              </AnimatedSection>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No questions found. Try a different search term.</p>
          )}
        </div>
      </section>
    </div>
  );
}
