import React from "react";
import {
  ArrowRight,
  Play,
  Target,
  Crown,
  Star,
  Hexagon,
  Triangle,
  Command,
  Ghost,
  Gem,
  Cpu,
} from "lucide-react";

interface Client {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface GlassmorphismTrustHeroProps {
  badge?: string;
  headingLine1?: string;
  headingHighlight?: string;
  headingLine2?: string;
  description?: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
  stats?: { value: string; label: string }[];
  satisfactionLabel?: string;
  satisfactionPercent?: number;
  clients?: Client[];
  clientsHeading?: string;
  backgroundImage?: string;
}

const DEFAULT_CLIENTS: Client[] = [
  { name: "Acme Corp", icon: Hexagon },
  { name: "Quantum", icon: Triangle },
  { name: "Command+Z", icon: Command },
  { name: "Phantom", icon: Ghost },
  { name: "Ruby", icon: Gem },
  { name: "Chipset", icon: Cpu },
];

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <p className="text-lg font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

export default function GlassmorphismTrustHero({
  badge = "Award-Winning Design",
  headingLine1 = "Crafting Digital",
  headingHighlight = "Experiences",
  headingLine2 = "That Matter",
  description = "We design interfaces that combine beauty with functionality, creating seamless experiences that users love and businesses thrive on.",
  primaryCTA = { label: "View Portfolio", href: "#" },
  secondaryCTA = { label: "Watch Showreel", href: "#" },
  stats = [
    { value: "50+", label: "Team Members" },
    { value: "12", label: "Awards Won" },
    { value: "99%", label: "Uptime" },
  ],
  satisfactionLabel = "Client Satisfaction",
  satisfactionPercent = 98,
  clients = DEFAULT_CLIENTS,
  clientsHeading = "Trusted by Industry Leaders",
  backgroundImage = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80",
}: GlassmorphismTrustHeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Background image with gradient mask */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left column */}
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold-light px-4 py-2 text-sm font-medium text-gold shadow-sm">
              <Crown className="h-4 w-4" />
              {badge}
              <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            </div>

            {/* Heading */}
            <h1 className="font-heading text-4xl font-bold leading-[1.1] tracking-tight text-navy md:text-5xl lg:text-6xl">
              {headingLine1}
              <br />
              <span className="text-gold-gradient">{headingHighlight}</span>
              <br />
              {headingLine2}
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-muted-foreground">
              {description}
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href={primaryCTA.href}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-gold-foreground shadow-[0_6px_24px_-6px_oklch(0.72_0.10_75/0.4)] transition-all duration-300 hover:bg-gold/90 hover:scale-[1.02]"
              >
                {primaryCTA.label}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={secondaryCTA.href}
                className="inline-flex items-center gap-2 rounded-full border-2 border-border px-7 py-3.5 text-sm font-semibold text-foreground transition-colors duration-300 hover:bg-accent"
              >
                <Play className="h-4 w-4" />
                {secondaryCTA.label}
              </a>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            {/* Stats card */}
            <div className="relative rounded-2xl border border-border bg-card/80 backdrop-blur-lg p-7 shadow-xl">
              {/* Glow */}
              <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-light">
                    <Target className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold text-foreground">
                      150+
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Projects Delivered
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      {satisfactionLabel}
                    </span>
                    <span className="font-semibold text-foreground">
                      {satisfactionPercent}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-gold to-cta transition-all duration-1000"
                      style={{ width: `${satisfactionPercent}%` }}
                    />
                  </div>
                </div>

                <div className="h-px w-full bg-border my-4" />

                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-3">
                  {stats.map((s, i) => (
                    <StatItem key={i} value={s.value} label={s.label} />
                  ))}
                </div>

                {/* Tags */}
                <div className="mt-5 flex gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cta/10 px-3 py-1.5 text-xs font-semibold text-cta">
                    <span className="h-1.5 w-1.5 rounded-full bg-cta animate-pulse" />
                    ACTIVE
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold">
                    <Crown className="h-3 w-3" />
                    PREMIUM
                  </span>
                </div>
              </div>
            </div>

            {/* Marquee card */}
            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-lg p-5 shadow-lg overflow-hidden">
              <p className="text-xs text-muted-foreground mb-4 uppercase tracking-[0.15em] font-medium">
                {clientsHeading}
              </p>
              <div className="relative overflow-hidden">
                <div className="animate-marquee flex gap-8">
                  {[...clients, ...clients, ...clients].map((client, i) => (
                    <div
                      key={i}
                      className="flex shrink-0 items-center gap-2 text-muted-foreground/60"
                    >
                      <client.icon className="h-5 w-5" />
                      <span className="whitespace-nowrap text-sm font-medium">
                        {client.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
