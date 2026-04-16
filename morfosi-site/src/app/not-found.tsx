import Link from "next/link";
import type { Metadata } from "next";
import { Home, Phone, ArrowRight, Calculator, BookOpen, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "404 – Η σελίδα δεν βρέθηκε | Φροντιστήριο Μόρφωση",
  description: "Η σελίδα που ψάχνετε δεν υπάρχει. Επιστρέψτε στην αρχική σελίδα του Φροντιστηρίου Μόρφωση.",
};

const QUICK_LINKS = [
  { href: "/", label: "Αρχική", icon: Home, color: "bg-brand-teal" },
  { href: "/contact", label: "Επικοινωνία", icon: Phone, color: "bg-brand-orange" },
  { href: "/calculator", label: "Υπολογιστής Μορίων", icon: Calculator, color: "bg-brand-green" },
  { href: "/exams", label: "Θέματα Εξετάσεων", icon: BookOpen, color: "bg-brand-purple" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#031516] flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden font-sans">

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#0c82a2 1px, transparent 1px), linear-gradient(90deg, #0c82a2 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Giant 404 */}
      <div
        className="absolute select-none pointer-events-none font-black text-[35vw] leading-none text-white opacity-[0.03] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
        aria-hidden="true"
      >
        404
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl">

        {/* Orange top accent */}
        <div className="w-24 h-2 bg-brand-orange mb-8" />

        {/* Error code */}
        <div className="flex items-end gap-6 mb-6">
          <span className="text-[120px] md:text-[180px] font-black text-white leading-none tracking-tighter">
            4<span className="text-brand-orange">0</span>4
          </span>
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight mb-4">
          Ουπς! Αυτή η σελίδα<br />
          <span className="text-brand-teal">χάθηκε στις διακοπές...</span>
        </h1>
        <p className="text-gray-400 font-bold text-lg max-w-xl mb-12 leading-relaxed border-l-[5px] border-brand-orange pl-6">
          Η σελίδα που ψάχνατε δεν υπάρχει ή μετακινήθηκε. Μην ανησυχείτε — γυρίστε πίσω και βρείτε αυτό που χρειαζόσαστε.
        </p>

        {/* Quick links grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {QUICK_LINKS.map(({ href, label, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className={`${color} border-[4px] border-white/20 p-6 flex flex-col gap-4 group hover:-translate-y-2 hover:border-white/50 transition-all shadow-[6px_6px_0px_rgba(255,255,255,0.1)]`}
            >
              <Icon size={28} className="text-white" strokeWidth={2} />
              <span className="text-white font-black text-sm uppercase tracking-widest">{label}</span>
              <ArrowRight size={16} className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

        {/* Search suggestion */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 text-gray-500">
            <Search size={16} />
            <span className="font-bold text-sm uppercase tracking-widest">Ή επιστρέψτε στην αρχική:</span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-brand-orange text-white px-8 py-4 font-black uppercase tracking-widest text-sm border-4 border-white/20 shadow-[6px_6px_0px_rgba(0,0,0,0.5)] hover:shadow-[2px_2px_0px_rgba(0,0,0,0.5)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
          >
            <Home size={16} strokeWidth={3} />
            ΑΡΧΙΚΗ ΣΕΛΙΔΑ
          </Link>
        </div>
      </div>

      {/* Bottom brand */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <span className="text-white/20 font-black text-xs uppercase tracking-[0.4em]">ΜΟΡΦΩΣΗ • ΦΡΟΝΤΙΣΤΗΡΙΟ</span>
      </div>
    </div>
  );
}
