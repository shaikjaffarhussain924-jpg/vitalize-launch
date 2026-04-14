import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CLINIC, DOCTORS, SERVICES } from "@/lib/constants";
import { useState } from "react";

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
      <section className="bg-cream py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumb items={[{ label: "Our Doctors" }]} />
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy">Our Expert Doctors</h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl">
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
                <div className="bg-card rounded-xl border overflow-hidden group hover:shadow-lg transition-all">
                  <div className="aspect-[3/4] bg-navy/10 flex items-center justify-center text-muted-foreground relative overflow-hidden">
                    <span>Doctor Photo</span>
                    <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/10 transition-colors" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-lg font-semibold text-navy">{doc.name}</h3>
                    <p className="text-sm text-gold font-medium">{doc.designation}</p>
                    <p className="text-xs text-muted-foreground mt-1">{doc.qualification}</p>
                    <div className="flex flex-wrap gap-2 mt-3 text-xs text-muted-foreground">
                      <span className="bg-accent px-2 py-0.5 rounded">{doc.experience} yrs exp</span>
                      <span className="bg-accent px-2 py-0.5 rounded">{doc.languages}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2">Reg: {doc.regNo}</p>
                    <Link to="/book-appointment" className="mt-3 block">
                      <Button className="w-full bg-gold hover:bg-gold/90 text-gold-foreground text-sm">
                        Book Appointment
                      </Button>
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
