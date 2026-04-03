import { ChevronRight, ChevronLeft } from "lucide-react";

export interface TestimonialType {
  _id: string;
  studentName: string;
  year?: number;
  university?: string;
  quote?: string;
  photoUrl?: string;
}

export default function Testimonials({ testimonials = [] }: { testimonials?: TestimonialType[] }) {
  // Αν η βάση Sanity είναι άδεια, δείχνουμε ένα fallback placeholder για να μην σπάσει το CSS
  const items = testimonials.length > 0 ? testimonials.slice(0, 2) : [
    { _id: 'fallback-1', studentName: 'Μαθητής - Demo', university: 'Πρόσθεσε από το /studio', quote: 'Αυτή είναι μια προσωρινή εγγραφή επειδή η βάση δεδομένων του Sanity δεν έχει ακόμα περιεχόμενο.' },
    { _id: 'fallback-2', studentName: 'Μαθήτρια - Demo', university: 'Πρόσθεσε από το /studio', quote: 'Αυτή είναι μια προσωρινή εγγραφή επειδή η βάση δεδομένων του Sanity δεν έχει ακόμα περιεχόμενο.' }
  ];

  return (
    <section className="bg-white py-32 w-full border-t border-gray-200 flex flex-col items-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
        {/* Title Area */}
        <div className="flex flex-col md:flex-row gap-8 justify-between items-end mb-16 border-b-[6px] border-brand-teal pb-6">
          <div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 uppercase tracking-tighter">
              Ιστορίες <br/><span className="text-brand-orange">Επιτυχίας</span>
            </h2>
            <p className="mt-4 font-bold text-gray-500 tracking-wide uppercase text-sm">Οι Πρωταγωνιστές Της Μόρφωσης</p>
          </div>
          <div className="flex gap-4">
             <button className="bg-gray-50 hover:bg-brand-teal hover:text-white p-4 transition-colors border-2 border-gray-100">
               <ChevronLeft size={24} />
             </button>
             <button className="bg-gray-50 hover:bg-brand-teal hover:text-white p-4 transition-colors border-2 border-gray-100">
               <ChevronRight size={24} />
             </button>
          </div>
        </div>

        {/* Sharp Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {items.map((item, index) => (
             <div key={item._id} className={`bg-gray-50 border-l-[12px] p-8 shadow-sm group hover:shadow-2xl transition-all relative ${index === 0 ? 'border-brand-teal' : 'border-brand-orange'}`}>
                <div className="flex flex-col sm:flex-row gap-8 items-start">
                   {/* Φωτογραφία Μαθητή (ή Placeholder αν λείπει) */}
                   <div className="w-32 h-32 bg-gray-300 flex-shrink-0 grayscale group-hover:grayscale-0 transition-all flex items-center justify-center overflow-hidden">
                      {item.photoUrl ? (
                         <img src={item.photoUrl} alt={item.studentName} className="w-full h-full object-cover" />
                      ) : (
                         <span className="text-gray-500 font-extrabold text-xs">ΦΩΤΟ</span>
                      )}
                   </div>
                   <div>
                      <h3 className="font-black text-2xl text-gray-900 tracking-tight mb-1">{item.studentName}</h3>
                      <p className={`font-black text-xs tracking-widest uppercase mb-4 ${index === 0 ? 'text-brand-orange' : 'text-brand-teal'}`}>
                        {item.university || 'ΣΧΟΛΗ ΕΠΙΤΥΧΙΑΣ'} {item.year ? `(${item.year})` : ''}
                      </p>
                      <p className="text-gray-700 italic font-medium leading-relaxed">
                        "{item.quote || 'Κανένα κείμενο διαθέσιμο.'}"
                      </p>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </section>
  )
}
