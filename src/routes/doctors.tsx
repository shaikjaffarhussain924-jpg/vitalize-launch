import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Breadcrumb } from "@/components/Breadcrumb";
import { DestinationCard } from "@/components/ui/card-21";
import { CLINIC, DOCTORS, SERVICES } from "@/lib/constants";
import { useState } from "react";

const doctorImages = [
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80",
];

export const Route = createFileRoute("/doctors")({
  head: () => ({
    meta: [
      { title: `Our Doctors | ${CLINIC.name} — ${CLINIC.city}` },
      { name: "description", content: `Meet our 25+ expert doctors at ${CLINIC.name}. Experienced specialists in Cardiology, Dermatology, Orthopedics, and more.` },
      { property: "og:title", content: `Our Doctors | ${CLINIC.name}` },
      { property: "og:description", content: `Expert doctors across 6+ specialties in ${CLINIC.city}.` },
    ],
  }),
  component: DoctorsPage,
});

function DoctorsPage() {
  const [filter, setFilter] = useState("All");
  const specializations = ["All", ...new Set(DOCTORS.map((d) => d.specialization))];
  const filtered = filter === "All" ? DOCTORS : DOCTORS.filter((d) => d.specialization === filter);

  return (
    <div>
      <section className="bg-navy py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: "Our Doctors" }]} />
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy-foreground">Our Expert Doctors</h1>
          <p className="text-lg text-navy-foreground/70 mt-4 max-w-2xl">
            25+ highly qualified specialists committed to delivering the best medical care in {CLINIC.city}.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Filter className="w-5 h-5 text-muted-foreground mt-1" />
            {specializations.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === s ? "bg-navy text-navy-foreground" : "bg-accent text-foreground hover:bg-navy/10"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((doc, i) => (
              <AnimatedSection key={doc.id} delay={i * 100}>
                <DestinationCard
                  imageUrl={doctorImages[i % doctorImages.length]}
                  title={doc.name}
                  subtitle={`${doc.designation} • ${doc.specialization}`}
                  stats={`${doc.experience} yrs exp • ${doc.languages} • Reg: ${doc.regNo}`}
                  themeColor="220 40% 20%"
                >
                  <Link to="/book-appointment" className="mt-2 block" onClick={(e) => e.stopPropagation()}>
                    <Button className="w-full bg-gold hover:bg-gold/90 text-gold-foreground text-sm rounded-full">
                      Book Appointment
                    </Button>
                  </Link>
                </DestinationCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
