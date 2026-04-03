export default function PromoStrips() {
  return (
    <>
      <section className="w-full flex flex-col lg:flex-row">
        {/* Strip 1: Protypa - Teal Background */}
        <div className="w-full lg:w-1/2 flex flex-col xl:flex-row min-h-[500px]">
           {/* Image half */}
           <div className="w-full xl:w-1/2 bg-gray-200 relative flex items-center justify-center p-8">
             <span className="font-black text-3xl text-gray-400 uppercase tracking-widest text-center">PHOTO<br/>PLACEHOLDER</span>
           </div>
           {/* Text half */}
           <div className="w-full xl:w-1/2 p-12 bg-brand-teal flex flex-col justify-center relative">
             <div className="absolute top-0 right-0 w-4 h-full bg-brand-orange"></div>
             <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter text-white">
               Προτυπα & <br/>Πειραματικα Σχολεια
             </h2>
             <p className="font-bold text-white/90 text-sm mb-8 leading-relaxed">
               Προετοιμάζουμε στοχευμένα τους μαθητές για τις απαιτητικές εξετάσεις εισαγωγής στα Πρότυπα, με την εγγύηση της Μόρφωσης.
             </p>
             <button className="bg-transparent border-4 border-white text-white px-6 py-3 font-black uppercase tracking-widest text-xs hover:bg-white hover:text-brand-teal transition-colors w-max">
               ΕΝΗΜΕΡΩΣΗ
             </button>
           </div>
        </div>

        {/* Strip 2: Epaggelmatikos - Dark Background */}
        <div className="w-full lg:w-1/2 flex flex-col xl:flex-row min-h-[500px] border-l-[12px] border-white">
           {/* Text half */}
           <div className="w-full xl:w-1/2 p-12 bg-gray-900 flex flex-col justify-center relative order-2 xl:order-1">
             <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter text-white">
               Επαγγελματικός <br/> Προσανατολισμός
             </h2>
             <p className="font-bold text-gray-400 text-sm mb-8 leading-relaxed">
               Χρουμε το μέλλον σου μαζί. Μέσα από εξειδικευμένα τεστ δομών και προσωπικές συνεντεύξεις, χαρτογραφούμε τις κλίσεις σου.
             </p>
             <button className="bg-brand-orange text-white px-6 py-3 font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-colors w-max">
               ΚΛΕΙΣΕ ΣΥΝΕΔΡΙΑ
             </button>
           </div>
           {/* Image half */}
           <div className="w-full xl:w-1/2 bg-gray-300 relative flex items-center justify-center p-8 order-1 xl:order-2">
             <span className="font-black text-3xl text-gray-500 uppercase tracking-widest text-center">PHOTO<br/>PLACEHOLDER</span>
           </div>
        </div>
      </section>
    </>
  )
}
