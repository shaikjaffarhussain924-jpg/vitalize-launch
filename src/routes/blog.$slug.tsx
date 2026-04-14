import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, Share2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CLINIC, BLOG_POSTS, DOCTORS } from "@/lib/constants";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);
    return {
      meta: [
        { title: `${post?.title || "Blog Post"} | ${CLINIC.name}` },
        { name: "description", content: post?.excerpt || "" },
        { property: "og:title", content: post?.title || "Blog Post" },
        { property: "og:description", content: post?.excerpt || "" },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: BlogPostPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-bold text-navy">Post Not Found</h1>
        <Link to="/blog" className="mt-4 inline-block text-gold hover:underline">View All Posts</Link>
      </div>
    </div>
  ),
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-navy">Post Not Found</h1>
          <Link to="/blog" className="mt-4 inline-block text-gold hover:underline">View All Posts</Link>
        </div>
      </div>
    );
  }

  const doctor = DOCTORS.find((d) => `Dr. ${d.name.split("Dr. ")[1]?.split(" ")[0]}` === post.author.split(" ").slice(0, 2).join(" ") || d.name === post.author.replace("Dr. ", ""));
  const related = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div>
      <section className="bg-cream py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Breadcrumb items={[{ label: "Blog", to: "/blog" }, { label: post.title }]} />
        </div>
      </section>

      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <span className="text-xs font-medium bg-gold/10 text-gold px-2 py-0.5 rounded-full">{post.category}</span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-navy">{post.title}</h1>
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime} read</span>
            <span>By {post.author}</span>
          </div>

          <div className="aspect-video bg-navy/10 rounded-xl flex items-center justify-center text-muted-foreground mt-8 mb-8">
            Blog Post Image
          </div>

          <div className="prose max-w-none text-foreground/90 space-y-4">
            <p>{post.excerpt}</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <h2 className="font-heading text-2xl font-bold text-navy mt-8">Key Points to Remember</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Regular checkups are essential for early detection</li>
              <li>Maintain a balanced diet rich in nutrients</li>
              <li>Exercise regularly — at least 30 minutes daily</li>
              <li>Stay hydrated and get adequate sleep</li>
              <li>Consult a specialist if symptoms persist</li>
            </ul>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <h2 className="font-heading text-2xl font-bold text-navy mt-8">When to See a Doctor</h2>
            <p>If you experience any of the symptoms mentioned above, don't hesitate to consult our specialists. Early detection and treatment can make a significant difference in outcomes.</p>
          </div>

          {/* Share */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t">
            <Share2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Share:</span>
            <button className="text-xs bg-cta text-cta-foreground px-3 py-1 rounded-full">WhatsApp</button>
            <button className="text-xs bg-accent px-3 py-1 rounded-full">Copy Link</button>
          </div>

          {/* CTA */}
          <div className="bg-navy rounded-xl p-8 mt-8 text-center text-navy-foreground">
            <h3 className="font-heading text-xl font-bold">Book an Appointment with Our {post.category} Specialist</h3>
            <p className="text-sm text-navy-foreground/70 mt-2">Get expert advice and personalized treatment</p>
            <Link to="/book-appointment" className="inline-block mt-4">
              <Button className="bg-gold hover:bg-gold/90 text-gold-foreground font-semibold px-6">
                Book Free Consultation
              </Button>
            </Link>
          </div>

          {/* Lead magnet */}
          <div className="bg-cream rounded-xl p-6 mt-8 text-center border">
            <h3 className="font-heading text-lg font-semibold text-navy">📚 Get a Free Health Checkup Guide</h3>
            <p className="text-sm text-muted-foreground mt-1">Download our comprehensive guide to preventive health</p>
            <div className="flex gap-2 max-w-sm mx-auto mt-4">
              <input type="email" placeholder="Your email" className="flex-1 px-3 py-2 border rounded-lg text-sm" />
              <Button className="bg-gold hover:bg-gold/90 text-gold-foreground text-sm">Get Guide</Button>
            </div>
          </div>

          {/* Related */}
          <div className="mt-12">
            <h3 className="font-heading text-2xl font-bold text-navy mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="group block bg-card rounded-xl overflow-hidden border hover:shadow-lg transition-all">
                  <div className="aspect-video bg-navy/10 flex items-center justify-center text-muted-foreground text-xs">Image</div>
                  <div className="p-4">
                    <span className="text-xs text-gold">{p.category}</span>
                    <h4 className="font-heading text-sm font-semibold text-navy mt-1 group-hover:text-gold transition-colors line-clamp-2">{p.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{p.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
