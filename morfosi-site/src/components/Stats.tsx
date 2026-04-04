import Link from "next/link";

export default function Stats() {
  return (
    <section className="bg-gradient-to-r from-brand-purple to-[#1a1c3d] py-32 w-full relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-orange mb-4 tracking-wider uppercase">
          Η Δυναμη της Εμπειριας μας
        </h2>
        <p className="text-white font-bold text-lg mb-20 tracking-widest">Οι αριθμοί μας σήμερα</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-16 text-center text-white items-end mt-12 min-h-[160px]">
          
          <div className="border-t-4 border-brand-orange hover:border-white pt-6 relative top-0 hover:-top-[24px] transition-all duration-700 ease-out cursor-default group w-full">
            <span className="font-sans font-black leading-none block mb-4 tracking-tighter shadow-sm text-5xl lg:text-7xl group-hover:text-6xl group-hover:lg:text-[8rem] transition-all duration-700 ease-out">
              95<span className="text-3xl group-hover:text-5xl transition-all duration-700 ease-out">%</span>
            </span>
            <span className="font-black uppercase tracking-widest text-xs text-gray-300 group-hover:text-sm group-hover:text-white transition-all duration-700 ease-out">
              ΠΟΣΟΣΤΟ<br/>ΕΠΙΤΥΧΙΑΣ
            </span>
          </div>

          <div className="border-t-4 border-brand-orange hover:border-white pt-6 relative top-0 hover:-top-[24px] transition-all duration-700 ease-out cursor-default group w-full">
            <span className="font-sans font-black leading-none block mb-4 tracking-tighter shadow-sm text-5xl lg:text-7xl group-hover:text-6xl group-hover:lg:text-[8rem] transition-all duration-700 ease-out">
              45
            </span>
            <span className="font-black uppercase tracking-widest text-xs text-gray-300 group-hover:text-sm group-hover:text-white transition-all duration-700 ease-out">
              ΚΟΡΥΦΑΙΟΙ<br/>ΕΚΠΑΙΔΕΥΤΙΚΟΙ
            </span>
          </div>

          <div className="border-t-4 border-brand-orange hover:border-white pt-6 relative top-0 hover:-top-[24px] transition-all duration-700 ease-out cursor-default group w-full">
             <span className="font-sans font-black leading-none block mb-4 tracking-tighter shadow-sm text-5xl lg:text-7xl group-hover:text-6xl group-hover:lg:text-[8rem] transition-all duration-700 ease-out">
               {new Date().getFullYear() - 2005}
             </span>
             <span className="font-black uppercase tracking-widest text-xs text-gray-300 group-hover:text-sm group-hover:text-white transition-all duration-700 ease-out">
               ΧΡΟΝΙΑ<br/>ΕΜΠΕΙΡΙΑΣ
             </span>
          </div>

          <div className="border-t-4 border-brand-orange hover:border-white pt-6 relative top-0 hover:-top-[24px] transition-all duration-700 ease-out cursor-default group w-full">
            <span className="font-sans font-black leading-none block mb-4 tracking-tighter shadow-sm text-5xl lg:text-7xl group-hover:text-6xl group-hover:lg:text-[8rem] transition-all duration-700 ease-out">
              1.200+
            </span>
            <span className="font-black uppercase tracking-widest text-xs text-gray-300 group-hover:text-sm group-hover:text-white transition-all duration-700 ease-out">
              ΕΠΙΤΥΧΟΝΤΕΣ<br/>ΜΑΘΗΤΕΣ
            </span>
          </div>

        </div>

        <div className="mt-28">
          <Link href="/contact" className="bg-brand-orange text-white px-10 py-5 font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-colors shadow-lg inline-block">
            ΚΛΕΙΣΕ ΔΩΡΕΑΝ ΔΟΚΙΜΑΣΤΙΚΟ →
          </Link>
        </div>
      </div>
    </section>
  )
}
