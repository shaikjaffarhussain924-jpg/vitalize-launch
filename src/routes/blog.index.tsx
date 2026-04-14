import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Breadcrumb } from "@/components/Breadcrumb";
import { DestinationCard } from "@/components/ui/card-21";
import { CLINIC, BLOG_POSTS } from "@/lib/constants";
import { useState } from "react";

const blogImages = [
  "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1588776813677-77aaf5595b83?auto=format&fit=crop&w=600&q=80",
];

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: `Health Blog | ${CLINIC.name} — ${CLINIC.city}` },
      { name: "description", content: `Expert health articles and medical advice from doctors at ${CLINIC.name}, ${CLINIC.city}.` },
      { property: "og:title", content: `Health Blog | ${CLINIC.name}` },
      { property: "og:description", content: `Stay informed with expert medical advice from our doctors.` },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const categories = ["All", ...new Set(BLOG_POSTS.map((p) => p.category))];
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? BLOG_POSTS : BLOG_POSTS.filter((p) => p.category === filter);

  return (
    <div>
      <section className="bg-cream py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: "Blog" }]} />
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy">Health Blog</h1>
          <p className="text-lg text-muted-foreground mt-4">Expert medical advice from our doctors</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Featured */}
          <AnimatedSection>
            <Link to="/blog/$slug" params={{ slug: BLOG_POSTS[0].slug }} className="block mb-12">
              <DestinationCard
                imageUrl={blogImages[0]}
                title={BLOG_POSTS[0].title}
                subtitle={BLOG_POSTS[0].excerpt}
                stats={`${BLOG_POSTS[0].category} • ${BLOG_POSTS[0].readTime} read • ${BLOG_POSTS[0].author}`}
                themeColor="30 40% 20%"
                className="[&_a]:aspect-[21/9]"
              />
            </Link>
          </AnimatedSection>

          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((c) => (
              <button key={c} onClick={() => setFilter(c)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === c ? "bg-navy text-navy-foreground" : "bg-accent hover:bg-navy/10"}`}>
                {c}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <AnimatedSection key={post.slug} delay={i * 100}>
                <Link to="/blog/$slug" params={{ slug: post.slug }}>
                  <DestinationCard
                    imageUrl={blogImages[i % blogImages.length]}
                    title={post.title}
                    subtitle={post.excerpt}
                    stats={`${post.category} • ${post.readTime} • ${post.author}`}
                    themeColor="30 40% 20%"
                  />
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
