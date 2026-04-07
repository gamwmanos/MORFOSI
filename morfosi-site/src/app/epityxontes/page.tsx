'use client';

import { useEffect, useState } from 'react';
import { client } from '@/sanity/client';
import { Loader2, Calendar, FileText, ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';

interface SuccessYear {
  _id: string;
  year: number;
  pdfUrl: string;
}

const QUERY = `*[_type == "successYear"] | order(year desc) {
  _id,
  year,
  "pdfUrl": pdfArchive.asset->url
}`;

export default function EpityxontesPage() {
  const [years, setYears] = useState<SuccessYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeYear, setActiveYear] = useState<SuccessYear | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await client.fetch(QUERY);
        setYears(data);
        if (data.length > 0) {
          setActiveYear(data[0]); // Auto-select the most recent year
        }
      } catch (err) {
        console.error("Failed to fetch success years", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-brand-teal selection:text-white pb-24">
      {/* HEADER SECTION */}
      <section className="bg-gray-950 py-24 px-6 lg:px-12 relative overflow-hidden border-b-[8px] border-brand-orange">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#f97316 1px, transparent 1px), linear-gradient(to right, #f97316 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/#testimonials" className="inline-flex items-center gap-2 text-white/50 hover:text-brand-orange font-black uppercase tracking-widest text-xs mb-8 transition-colors">
            <ArrowLeft size={16} /> ΠΙΣΩ ΣΤΗΝ ΑΡΧΙΚΗ
          </Link>
          <div className="text-brand-orange font-black text-xs uppercase tracking-[0.3em] mb-4">Το Hall of Fame μας</div>
          <h1 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]">
            ΕΠΙΤΥΧΟΝΤΕΣ<br />
            <span className="text-brand-teal">ΟΛΩΝ ΤΩΝ ΕΤΩΝ</span>
          </h1>
          <p className="mt-8 max-w-2xl text-gray-400 font-bold text-lg leading-relaxed border-l-4 border-brand-orange pl-4">
            Ρίξτε μια ματιά στους μαθητές που μας εμπιστεύτηκαν και έκαναν τα όνειρά τους πραγματικότητα. Επιλέξτε χρονιά για να δείτε τα ονόματα.
          </p>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mt-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-brand-teal">
            <Loader2 size={48} className="animate-spin mb-4" />
            <span className="font-black uppercase tracking-widest text-sm text-gray-500">ΦΟΡΤΩΣΗ ΔΕΔΟΜΕΝΩΝ...</span>
          </div>
        ) : years.length === 0 ? (
          <div className="text-center py-32">
            <Calendar size={64} className="mx-auto text-gray-300 mb-6" />
            <h3 className="text-2xl font-black text-gray-900 uppercase">Καθως φαινεται δεν υπαρχουν ακομα εγγραφες</h3>
            <p className="text-gray-500 font-bold mt-2">Η γραμματεία πρέπει να ανεβάσει PDF στο Sanity Studio.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 items-start">
             {/* LEFT SIDE: YEARS NAVIGATION */}
             <div className="w-full lg:w-1/4 flex flex-col gap-4">
               <h3 className="font-black text-gray-900 uppercase tracking-widest border-b-4 border-gray-900 pb-4 mb-2">
                 Επιλογη Χρονιας
               </h3>
               <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                 {years.map((year) => {
                   const isActive = activeYear?._id === year._id;
                   return (
                     <button
                       key={year._id}
                       onClick={() => setActiveYear(year)}
                       className={`flex items-center justify-between p-6 border-4 shadow-[4px_4px_0px_#000] font-black uppercase text-xl transition-all ${
                         isActive 
                           ? "bg-brand-orange border-black text-white hover:shadow-[2px_2px_0px_#000] group" 
                           : "bg-white border-black text-gray-900 hover:bg-gray-100 hover:shadow-[2px_2px_0px_#000]"
                       }`}
                     >
                       <span>{year.year}</span>
                       <FileText size={24} strokeWidth={isActive ? 3 : 2} className={isActive ? "text-black" : "text-gray-400"} />
                     </button>
                   );
                 })}
               </div>
             </div>

             {/* RIGHT SIDE: PDF VIEWER */}
             <div className="w-full lg:w-3/4">
                {activeYear ? (
                  <div className="bg-white border-[6px] border-black shadow-[16px_16px_0px_#000] flex flex-col">
                    <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Calendar size={20} className="text-brand-orange" />
                        <span className="font-black tracking-widest text-sm uppercase">Επιτυχοντες - {activeYear.year}</span>
                      </div>
                      <a href={activeYear.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-brand-teal hover:bg-brand-orange transition-colors px-4 py-2 border-2 border-white/20">
                        <Download size={14} /> ΚΑΤΕΒΑΣΜΑ
                      </a>
                    </div>
                    <div className="relative w-full aspect-[1/1.4] md:aspect-[16/10] bg-gray-100">
                      <iframe 
                        src={`${activeYear.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                        title={`Επιτυχόντες ${activeYear.year}`}
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>
                ) : null}
             </div>
          </div>
        )}
      </section>
    </div>
  );
}
