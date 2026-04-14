import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CLINIC, BLOG_POSTS } from "@/lib/constants";
import { openWhatsAppBooking } from "@/lib/whatsapp";
import { trackCompleteRegistration } from "@/lib/analytics";
import { useEffect } from "react";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: `Thank You | ${CLINIC.name}` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  useEffect(() => {
    trackCompleteRegistration();
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16">
      <div className="max-w-lg mx-auto px-4 text-center">
        {/* Checkmark animation */}
        <div className="w-24 h-24 rounded-full bg-cta/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-cta" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" className="animate-checkmark" />
          </svg>
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-navy">Your Appointment is Confirmed</h1>
        <p className="text-muted-foreground mt-4">
          We'll call you within 2 hours to confirm your slot. Meanwhile, join our WhatsApp for instant updates.
        </p>

        <Button
          onClick={() => openWhatsAppBooking()}
          className="mt-8 bg-cta hover:bg-cta/90 text-cta-foreground font-semibold text-lg px-10 py-6 rounded-xl"
        >
          Continue on WhatsApp →
        </Button>

        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Button variant="outline" className="text-sm">📅 Add to Calendar</Button>
          <Button variant="outline" className="text-sm" onClick={() => openWhatsAppBooking()}>📤 Share on WhatsApp</Button>
        </div>

        {/* Blog recommendations */}
        <div className="mt-12 text-left">
          <h3 className="font-heading text-xl font-semibold text-navy mb-4 text-center">While You Wait — Read These</h3>
          <div className="grid gap-4">
            {BLOG_POSTS.slice(0, 3).map((post) => (
              <Link key={post.slug} to="/blog/$slug" params={{ slug: post.slug }} className="flex gap-3 bg-card rounded-lg border p-3 hover:shadow-sm transition-all group">
                <div className="w-16 h-16 rounded-lg shrink-0 overflow-hidden">
                  <img
                    src={[
                      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=150&q=80",
                      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=150&q=80",
                      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=150&q=80",
                    ][BLOG_POSTS.slice(0, 3).indexOf(post) % 3]}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-navy group-hover:text-gold transition-colors line-clamp-1">{post.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{post.excerpt}</p>
                  <span className="text-xs text-gold">{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
