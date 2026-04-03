import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col lg:flex-row w-full min-h-[85vh] bg-white">
      {/* Left Text Box - White Theme (Top of Site changed to white for blending into video scroll) */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-8 lg:px-16 py-16 relative">
        {/* Subtle grid pattern for white background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(#0c82a2 1px, transparent 1px), linear-gradient(90deg, #0c82a2 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>

        <h1 className="text-brand-teal-dark text-[11vw] lg:text-[6rem] leading-[0.9] font-black tracking-tighter mb-12 relative z-10 uppercase break-words px-2 lg:px-0">
          Το Φροντιστηριο <br/> Που <span className="text-brand-teal">Στηριζει</span> <br />Τους Στοχους Σου <br/>
          <span className="text-brand-orange text-[5vw] lg:text-[2.5rem] tracking-tight mt-6 block leading-none">Ολοκληρωμενη Προετοιμασια</span>
        </h1>

        <div className="mb-16 relative z-10 max-w-xl">
          <h2 className="text-gray-900 text-xl font-black mb-4 uppercase tracking-widest pl-2">Τι ακριβώς ψάχνεις;</h2>
          <div className="flex shadow-2xl border-4 border-gray-100">
            <select className="flex-1 bg-white text-gray-900 font-extrabold px-6 py-6 appearance-none focus:outline-none rounded-none text-lg">
              <option>Επιλογή Βαθμίδας</option>
              <option>Γενικό Λύκειο</option>
              <option>ΕΠΑΛ</option>
              <option>Γυμνάσιο</option>
              <option>Δημοτικό</option>
            </select>
            <button className="bg-brand-orange text-white px-10 flex items-center justify-center hover:bg-brand-teal transition-colors">
              <ChevronRight size={40} />
            </button>
          </div>
        </div>

        <div className="relative z-10 mt-auto pt-8 border-t-[6px] border-gray-100">
          <h3 className="text-brand-teal border-l-[6px] border-brand-teal pl-4 font-black text-lg mb-6 tracking-widest uppercase">Βρες γρηγορα</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">
            {["Θέματα Πανελλαδικών", "Υπολογισμός Μορίων", "Διαγωνίσματα", "Τράπεζα Θεμάτων", "Πανόραμα Σχολών", "School Portal"].map((link, i) => (
              <li key={i}>
                <Link href="#" className="text-gray-700 font-extrabold text-sm uppercase flex items-center gap-2 group tracking-widest hover:text-brand-orange transition-colors">
                  <span className="w-0 group-hover:w-4 h-1 bg-brand-orange transition-all"></span>
                  <ChevronRight size={18} className="text-brand-teal group-hover:hidden" />
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Image Placeholder Box */}
      <div className="w-full lg:w-[45%] min-h-[50vh] lg:min-h-full bg-gray-100 relative mt-16 xl:mt-0">
        <div className="absolute inset-0 flex flex-col items-center justify-center border-l-[12px] border-brand-orange text-center p-8 bg-zinc-200">
           <span className="text-6xl font-black text-white drop-shadow-md mb-4 tracking-widest">PLACEHOLDER</span>
           <span className="text-xl font-black text-gray-700 uppercase bg-white px-6 py-2 shadow-sm border-2 border-dashed border-gray-400">Κεντρική μεγάλη φωτογραφία 1920x1080</span>
        </div>
      </div>
    </section>
  );
}
