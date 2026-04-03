import Link from "next/link";

export default function System() {
  return (
    <section className="relative w-full py-24 bg-white overflow-hidden border-b-8 border-brand-teal min-h-[85vh] flex items-center">
      {/* Huge fading background text with billboard scroll animation - Left to Right */}
      <div className="absolute top-[20%] left-0 w-full overflow-hidden pointer-events-none z-0">
        <h2 className="text-[25vw] font-black text-gray-100 whitespace-nowrap select-none tracking-tighter animate-billboard inline-block uppercase">
          ΜΟΡΦΩΣΗ
        </h2>
      </div>

      <div className="w-full px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16 xl:max-w-[1600px] mx-auto">
        
        {/* Left Side text */}
        <div className="lg:w-1/3">
          <span className="text-sm font-black tracking-widest text-gray-900 uppercase mb-8 block">Εκπαιδευτικη Μεθοδος</span>
          <h3 className="text-4xl lg:text-5xl xl:text-6xl font-black text-brand-orange leading-[1.1] mb-10 tracking-tighter">
            Ανακάλυψε τη <br/> Φιλοσοφία της <br/> Μόρφωσης!
          </h3>
          <button className="text-gray-900 font-extrabold uppercase text-xs flex items-center gap-2 hover:text-brand-teal transition-colors group tracking-widest">
            Γνωριστε την Ομαδα μας
            <span className="text-brand-orange group-hover:translate-x-1 transition-transform">{">"}</span>
          </button>
        </div>

        {/* Right Side Image + Sharp Grid Box */}
        <div className="lg:w-2/3 relative bg-gray-200 min-h-[500px] lg:min-h-[700px] w-full border-l-[12px] border-brand-teal flex items-center justify-center">
           
           <span className="absolute text-5xl font-black text-white tracking-widest drop-shadow-md">
             PLACEHOLDER ΦΩΤΟ 
           </span>

           {/* The overlapping grid overlay - exactly like screenshot */}
           <div className="absolute -left-8 lg:-left-24 xl:-left-40 top-1/2 -translate-y-1/2 shadow-2xl p-0 w-[95%] max-w-[450px] grid grid-cols-2 gap-px bg-gray-300 border-l-[12px] border-brand-orange">
             <Link href="/teachers" className="bg-white p-6 lg:p-10 flex flex-col items-center justify-center text-center gap-4 hover:bg-gray-50 transition-colors h-[200px] group cursor-pointer">
               <div className="w-16 h-16 bg-gray-200 group-hover:scale-105 transition-transform" />
               <span className="font-extrabold text-sm text-gray-900 leading-tight group-hover:text-brand-orange transition-colors">Οι Καθηγητές<br/> Μας</span>
             </Link>
             <div className="bg-white p-6 lg:p-10 flex flex-col items-center justify-center text-center gap-4 hover:bg-gray-50 transition-colors h-[200px]">
               <div className="w-16 h-16 bg-gray-200" />
               <span className="font-extrabold text-sm text-gray-900 leading-tight">Μάθημα στο<br/> τραπέζι</span>
             </div>
             <div className="bg-white p-6 lg:p-10 flex flex-col items-center justify-center text-center gap-4 hover:bg-gray-50 transition-colors h-[200px]">
               <div className="w-16 h-16 bg-gray-200" />
               <span className="font-extrabold text-sm text-gray-900 leading-tight">Πραγματική<br/> προσομοίωση εξέτασης</span>
             </div>
             <div className="bg-white p-6 lg:p-10 flex flex-col items-center justify-center text-center gap-4 hover:bg-gray-50 transition-colors h-[200px]">
               <div className="w-16 h-16 bg-gray-200" />
               <span className="font-extrabold text-sm text-gray-900 leading-tight">Σύμβουλος<br/> Καθηγητής</span>
             </div>
           </div>
        </div>

      </div>
    </section>
  )
}
