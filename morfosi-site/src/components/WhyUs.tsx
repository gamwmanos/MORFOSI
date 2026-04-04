import { Users, ClipboardCheck, Target, Gift } from "lucide-react";
import Link from "next/link";

const REASONS = [
  {
    icon: <Users size={32} strokeWidth={2.5} />,
    number: "01",
    title: "Μικρά τμήματα έως 5 άτομα",
    description:
      "Κάθε μαθητής έχει φωνή στην τάξη. Δεν «χάνεται» στο πλήθος — ο καθηγητής γνωρίζει τις αδυναμίες του και εστιάζει σε αυτές.",
    color: "bg-brand-teal",
    borderColor: "border-brand-teal",
  },
  {
    icon: <ClipboardCheck size={32} strokeWidth={2.5} />,
    number: "02",
    title: "Εβδομαδιαία τεστ προόδου",
    description:
      "Γραπτή αξιολόγηση κάθε εβδομάδα. Ξέρεις ακριβώς πού βρίσκεσαι, τι πρέπει να βελτιώσεις, και πόσο πλησιάζεις τον στόχο σου.",
    color: "bg-brand-orange",
    borderColor: "border-brand-orange",
  },
  {
    icon: <Target size={32} strokeWidth={2.5} />,
    number: "03",
    title: "Εξατομικευμένο πλάνο σπουδών",
    description:
      "Κάθε μαθητής λαμβάνει πλάνο βάσει των στόχων του. Αν θέλεις Ιατρική, δεν διαβάζεις σαν αυτόν που θέλει Παιδαγωγικό.",
    color: "bg-brand-purple",
    borderColor: "border-brand-purple",
  },
  {
    icon: <Gift size={32} strokeWidth={2.5} />,
    number: "04",
    title: "Δωρεάν δοκιμαστικό μάθημα",
    description:
      "Δοκίμασε χωρίς δέσμευση. Έλα σε ένα μάθημα, γνώρισε τον καθηγητή σου, και αποφάσισε αν σου ταιριάζει.",
    color: "bg-brand-green",
    borderColor: "border-brand-green",
  },
];

export default function WhyUs() {
  return (
    <section className="bg-white py-24 md:py-32 w-full border-b-[8px] border-black relative overflow-hidden">
      {/* Huge background text */}
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-black text-gray-50 whitespace-nowrap select-none pointer-events-none uppercase tracking-tighter"
        aria-hidden="true"
      >
        ΓΙΑΤΙ ΕΜΑΣ
      </span>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 border-b-[6px] border-gray-900 pb-6">
          <div>
            <span className="text-brand-orange font-black text-xs uppercase tracking-[0.3em] mb-4 block">
              Γιατί Μόρφωση
            </span>
            <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter text-gray-900 leading-[0.9]">
              ΑΥΤΟ ΠΟΥ ΜΑΣ
              <br />
              <span className="text-brand-teal bg-black px-3 py-1 inline-block -rotate-1 mt-2">
                ΞΕΧΩΡΙΖΕΙ
              </span>
            </h2>
          </div>
          <p className="text-gray-500 font-bold text-lg max-w-md leading-relaxed">
            Δεν λέμε γενικά «είμαστε οι καλύτεροι». Σου δείχνουμε{" "}
            <span className="text-gray-900 font-black">ακριβώς</span> τι κάνουμε διαφορετικά.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {REASONS.map((reason) => (
            <div
              key={reason.number}
              className={`bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] p-8 md:p-10 relative group hover:-translate-y-2 hover:shadow-[12px_12px_0px_#000] transition-all duration-300 border-l-[12px] ${reason.borderColor}`}
            >
              {/* Number background */}
              <span className="absolute top-4 right-6 text-7xl font-black text-gray-100 select-none pointer-events-none group-hover:text-gray-200 transition-colors">
                {reason.number}
              </span>

              <div className="relative z-10">
                <div
                  className={`${reason.color} text-white w-14 h-14 flex items-center justify-center border-[3px] border-black shadow-[3px_3px_0px_#000] mb-6`}
                >
                  {reason.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight mb-4 leading-snug">
                  {reason.title}
                </h3>
                <p className="text-gray-600 font-bold leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-brand-orange text-white px-12 py-6 font-black uppercase tracking-widest text-base border-4 border-black shadow-[8px_8px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:translate-x-[5px] hover:translate-y-[5px] transition-all"
          >
            ΚΛΕΙΣΕ ΔΩΡΕΑΝ ΔΟΚΙΜΑΣΤΙΚΟ
            <span className="text-2xl">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
