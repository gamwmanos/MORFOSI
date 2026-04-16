import { FileText, BarChart3, ArrowRight, Users } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    number: "01",
    icon: <Users size={36} strokeWidth={2} />,
    title: "ΡΑΝΤΕΒΟΥ\nΓΝΩΡΙΜΙΑΣ",
    description:
      "Κλείνεις ένα ραντεβού γνωριμίας. Συζητάμε τις ανάγκες σου, γνωρίζεις τους καθηγητές μας και σχεδιάζουμε το μέλλον σου.",
    color: "bg-brand-teal",
  },
  {
    number: "02",
    icon: <FileText size={36} strokeWidth={2} />,
    title: "ΕΞΑΤΟΜΙΚΕΥΜΕΝΟ\nΠΛΑΝΟ",
    description:
      "Σχεδιάζουμε πλάνο σπουδών βάσει των στόχων σου, της σχολής που θέλεις, και των σημείων που χρειάζεσαι βελτίωση.",
    color: "bg-brand-orange",
  },
  {
    number: "03",
    icon: <BarChart3 size={36} strokeWidth={2} />,
    title: "ΕΒΔΟΜΑΔΙΑΙΑ\nΠΑΡΑΚΟΛΟΥΘΗΣΗ",
    description:
      "Κάθε εβδομάδα τεστ προόδου, αναφορά στους γονείς, και διαρκής προσαρμογή του πλάνου μέχρι να πετύχεις τον στόχο σου.",
    color: "bg-brand-green",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 py-24 md:py-32 w-full border-b-[8px] border-brand-teal relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-brand-teal font-black text-xs uppercase tracking-[0.3em] mb-4 block">
            Πώς Δουλεύει
          </span>
          <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter text-gray-900 leading-[0.9] mb-6">
            3 ΑΠΛΑ ΒΗΜΑΤΑ
            <br />
            <span className="text-brand-orange">ΜΕΧΡΙ ΤΗΝ ΕΠΙΤΥΧΙΑ</span>
          </h2>
          <p className="text-gray-400 font-bold max-w-lg mb-10 mx-auto">
            Η πρώτη κίνηση είναι η επικοινωνία μαζί μας. Χωρίς καμία δέσμευση.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {STEPS.map((step, i) => (
            <div key={step.number} className="relative flex flex-col">
              {/* Connecting arrow between steps (desktop only) */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                  <div className="bg-black text-white w-8 h-8 flex items-center justify-center border-2 border-black">
                    <ArrowRight size={16} strokeWidth={3} />
                  </div>
                </div>
              )}

              <div
                className={`${step.color} border-[4px] border-black ${
                  i < STEPS.length - 1 ? "lg:border-r-0" : ""
                } p-10 md:p-12 flex-1 flex flex-col group hover:brightness-110 transition-all relative overflow-hidden`}
              >
                {/* Big number background */}
                <span className="absolute -top-4 -right-2 text-[10rem] font-black text-black/10 leading-none select-none pointer-events-none">
                  {step.number}
                </span>

                <div className="relative z-10 flex flex-col flex-1">
                  {/* Icon */}
                  <div className="bg-white text-gray-900 w-16 h-16 flex items-center justify-center border-[3px] border-black shadow-[4px_4px_0px_#000] mb-8">
                    {step.icon}
                  </div>

                  {/* Step label */}
                  <span className="text-white/60 font-black text-xs tracking-widest uppercase mb-3">
                    ΒΗΜΑ {step.number}
                  </span>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-tight mb-6 whitespace-pre-line">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/90 font-bold leading-relaxed flex-1">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-black text-white px-12 py-6 font-black uppercase tracking-widest text-base border-4 border-black shadow-[8px_8px_0px_#0c82a2] hover:shadow-[3px_3px_0px_#0c82a2] hover:translate-x-[5px] hover:translate-y-[5px] transition-all"
          >
            ΞΕΚΙΝΑ ΑΠΟ ΤΟ ΒΗΜΑ 1
            <span className="text-brand-orange text-2xl">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
