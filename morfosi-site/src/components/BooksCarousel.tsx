"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";

export default function BooksCarousel({ books }: { books: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallbacks: Αν η βάση στο Sanity είναι άδεια
  const displayBooks = books?.length > 0 ? books : [
    { _id: 'b1', title: 'ΒΙΒΛΙΟ 1', category: 'Πρόσθεσε από το Studio' },
    { _id: 'b2', title: 'ΒΙΒΛΙΟ 2', category: 'Πρόσθεσε από το Studio' },
    { _id: 'b3', title: 'ΒΙΒΛΙΟ 3', category: 'Πρόσθεσε από το Studio' }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displayBooks.length);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + displayBooks.length) % displayBooks.length);
  };

  const getVisibleBooks = () => {
     const visible = [];
     for(let i = 0; i < 3; i++) {
        visible.push(displayBooks[(currentIndex + i) % displayBooks.length]);
     }
     return visible;
  }

  const visibleBooks = getVisibleBooks();

  return (
    <div className="w-full md:w-2/3">
       
       <div className="flex gap-4 items-center justify-start md:justify-end mb-6">
          <button aria-label="Προηγούμενο Βιβλίο" onClick={prevSlide} className="w-12 h-12 border-2 border-brand-orange text-brand-orange flex items-center justify-center hover:bg-brand-orange hover:text-brand-teal-dark transition-colors">
            <ChevronLeft size={24} />
          </button>
          <button aria-label="Επόμενο Βιβλίο" onClick={nextSlide} className="w-12 h-12 border-2 border-brand-orange bg-brand-orange text-brand-teal-dark flex items-center justify-center hover:bg-transparent hover:text-brand-orange transition-colors">
            <ChevronRight size={24} />
          </button>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleBooks.map((item, index) => (
             <div key={`${item._id}-${currentIndex}-${index}`} className="w-full h-full animate-in fade-in zoom-in-95 duration-300">
               <Link href={item.pdfUrl || item.externalUrl || '#'} target="_blank" rel="noopener noreferrer" className="bg-white aspect-[3/4] flex flex-col items-center justify-center p-0 border-b-[12px] border-brand-teal text-center hover:-translate-y-2 transition-transform shadow-xl w-full relative group overflow-hidden">
                  {item.coverUrl ? (
                     <Image src={item.coverUrl} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                     <div className="p-6 flex flex-col items-center justify-center w-full h-full">
                        <span className="text-brand-teal-dark font-black text-xl lg:text-2xl mb-2 block leading-snug">{item.title}</span>
                        <span className="text-gray-500 font-black uppercase text-xs tracking-widest">{item.category || 'ΕΚΔΟΣΗ'}</span>
                     </div>
                  )}
               </Link>
             </div>
          ))}
       </div>

    </div>
  );
}
