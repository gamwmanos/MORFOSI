import { BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export interface ProgramType {
  _id: string;
  title: string;
  description?: string;
  slug?: string;
  iconUrl?: string; // 🖼️ Image URL from Sanity
}

export default function Programs({ programs = [] }: { programs?: ProgramType[] }) {
  const items = programs.length > 0 ? programs : [
    { _id: 'f1', title: 'Demo Πρόγραμμα 1', description: 'Δημιούργησε προγράμματα στο Sanity Studio' },
    { _id: 'f2', title: 'Demo Πρόγραμμα 2', description: 'Δημιούργησε προγράμματα στο Sanity Studio' },
  ];

  // Επειδή θέλουμε τα χρώματα να είναι σταθερά Morfosi, 
  // τα αναθέτουμε βάσει της σειράς (index) που εμφανίζονται.
  const colorMap = [
    { colorClass: "text-brand-orange", borderClass: "border-brand-orange", bgHover: "hover:bg-orange-50" },
    { colorClass: "text-brand-purple", borderClass: "border-brand-purple", bgHover: "hover:bg-purple-50" },
    { colorClass: "text-brand-red", borderClass: "border-brand-red", bgHover: "hover:bg-red-50" },
    { colorClass: "text-brand-green", borderClass: "border-brand-green", bgHover: "hover:bg-green-50" },
  ];

  return (
    <section className="bg-white py-32 w-full text-gray-900 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col xl:flex-row gap-16 items-center lg:items-stretch">
          {/* Left: Titles & Desc */}
          <div className="xl:w-1/3 flex flex-col justify-center">
             <h2 className="text-5xl font-black uppercase tracking-tighter mb-6 leading-none text-brand-teal-dark">
               Προγράμματα <br/><span className="text-brand-teal">Σπουδών</span>
             </h2>
             <p className="text-gray-600 font-medium mb-10 leading-relaxed text-lg">
               Σχεδιασμένα αυστηρά για να καλύπτουν κάθε εκπαιδευτική ανάγκη. Από θεμέλια γνώσης στο Γυμνάσιο, μέχρι την απόλυτη κορύφωση των Πανελλαδικών Εξετάσεων.
             </p>
             <Link href="/contact" className="bg-brand-teal text-white w-fit px-10 py-5 font-black uppercase tracking-widest text-sm hover:bg-brand-teal-dark transition-colors shadow-lg inline-block">
               ΔΕΣ ΤΟ ΠΛΑΝΟ ΜΑΘΗΜΑΤΩΝ →
             </Link>
          </div>

          {/* Right: Sharp Line Minimalist Grid (Dynamic from CMS) */}
          <div className="xl:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
             {items.map((prog, i) => {
               // Cycle through our 4 Morfosi styles using modulo math
               const style = colorMap[i % colorMap.length];
               
               return (
                 <div key={prog._id} className={`bg-white p-10 flex flex-col justify-between group shadow-sm hover:shadow-xl transition-all border-l-[10px] ${style.borderClass} ${style.bgHover} min-h-[280px]`}>
                   <div className="mb-8">
                     {/* Αν υπάρχει εικόνα/εικονίδιο από το Sanity τη δείχνουμε, αλλιώς fallback lucide icon */}
                     {prog.iconUrl ? (
                         <Image src={prog.iconUrl} alt={prog.title} width={48} height={48} className="w-12 h-12 mb-6 object-contain" />
                     ) : (
                         <BookOpen size={48} className={`${style.colorClass} mb-6`} strokeWidth={2} />
                     )}
                     <h3 className="text-3xl font-black tracking-tighter mb-3 text-brand-teal-dark">{prog.title}</h3>
                     <p className="text-xs text-gray-500 font-black uppercase tracking-widest leading-relaxed">
                       {prog.description || 'Χωρίς περιγραφή.'}
                     </p>
                   </div>
                   <div className={`${style.colorClass} font-black text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform w-fit`}>
                     Περισσοτερα &rarr;
                   </div>
                 </div>
               );
             })}
          </div>
        </div>
      </div>
    </section>
  )
}
