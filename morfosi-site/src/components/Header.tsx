"use client";
import Link from "next/link";
import { ChevronDown, Phone } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full relative z-50">
      {/* Top Bar - Very Dark Teal */}
      <div className="bg-brand-teal-dark text-white text-xs md:text-sm font-bold tracking-widest py-2 px-6 lg:px-12 flex justify-between items-center">
        <div className="hidden md:flex items-center gap-4 uppercase">
          <span>Οι εγγραφες για τη νεα σχολικη χρονια ξεκινησαν</span>
          <Link href="#" className="bg-brand-orange hover:bg-orange-600 text-white px-3 py-1 transition-colors">
            ΕΓΓΡΑΦΕΣ
          </Link>
        </div>
        <div className="flex items-center gap-6 ml-auto font-black text-xs">
          <Link href="#" className="hover:text-brand-orange transition-colors">e-MORFOSI</Link>
          <Link href="#" className="hover:text-brand-orange transition-colors">BLOG</Link>
        </div>
      </div>

      {/* Main NavBar - White, Sharp, Large */}
      <div className="bg-white px-6 lg:px-12 py-4 flex items-center justify-between border-b-[6px] border-brand-teal">
        <div className="flex items-center">
          <Link href="/" className="block">
            <img src="/morfosi.jpg" alt="Μόρφωση" className="h-16 md:h-24 w-auto object-contain mix-blend-multiply drop-shadow-sm" />
          </Link>
        </div>

        <nav className="hidden xl:flex items-center gap-8 ml-10 flex-1">
          {["ΕΚΠΑΙΔΕΥΣΗ", "ΦΙΛΟΣΟΦΙΑ", "ΠΑΝΕΛΛΗΝΙΕΣ", "ΝΕΑ & ΑΝΑΚΟΙΝΩΣΕΙΣ"].map((item, i) => (
            <div key={i} className="group relative">
              <Link href="#" className="text-gray-900 font-extrabold text-sm hover:text-brand-teal flex items-center gap-1 uppercase transition-colors">
                {item} <ChevronDown size={16} />
              </Link>
              {/* Boxy sharp line on hover */}
              <div className="absolute -bottom-6 left-0 w-full h-[6px] bg-brand-orange scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">Γραμμή Επικοινωνίας</span>
            <span className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tighter">
              210 123 4567
            </span>
          </div>
          <button className="bg-black text-white px-6 py-4 font-black text-sm uppercase flex items-center gap-2 hover:bg-brand-teal transition-colors rounded-none tracking-wider">
            ΕΠΙΚΟΙΝΩΝΙΑ
          </button>
        </div>
      </div>
    </header>
  );
}
