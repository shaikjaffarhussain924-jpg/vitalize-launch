import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CLINIC, BLOG_POSTS } from "@/lib/constants";
import { useState } from "react";

export const Route = createFileRoute("/blog")({
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
            <Link to="/blog/$slug" params={{ slug: BLOG_POSTS[0].slug }} className="block mb-12 group">
              <div className="grid md:grid-cols-2 gap-6 bg-card rounded-2xl border overflow-hidden hover:shadow-lg transition-all">
                <div className="aspect-video bg-navy/10 flex items-center justify-center text-muted-foreground">Featured Image</div>
                <div className="p-6 flex flex-col justify-center">
                  <span className="text-xs font-medium bg-gold/10 text-gold px-2 py-0.5 rounded-full w-fit">{BLOG_POSTS[0].category}</span>
                  <h2 className="font-heading text-2xl font-bold text-navy mt-3 group-hover:text-gold transition-colors">{BLOG_POSTS[0].title}</h2>
                  <p className="text-sm text-muted-foreground mt-2">{BLOG_POSTS[0].excerpt}</p>
                  <div className="mt-4 text-xs text-muted-foreground">{BLOG_POSTS[0].author} • {BLOG_POSTS[0].readTime} read</div>
                </div>
              </div>
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
                <Link to="/blog/$slug" params={{ slug: post.slug }} className="group block bg-card rounded-xl overflow-hidden border hover:shadow-lg transition-all">
                  <div className="aspect-video bg-navy/10 flex items-center justify-center text-muted-foreground">Blog Image</div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium bg-gold/10 text-gold px-2 py-0.5 rounded-full">{post.category}</span>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    <h3 className="font-heading font-semibold text-navy group-hover:text-gold transition-colors">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                    <div className="mt-3 text-xs text-muted-foreground">{post.author} • {post.date}</div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
