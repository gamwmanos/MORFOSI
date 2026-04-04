import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/client";

// Server component — fetches data at build/ISR time
async function getSystemData() {
  const query = `{
    "teacher": *[_type == "teacher" && defined(image)] | order(order asc)[0] {
      firstName, lastName, specialty,
      "imageUrl": image.asset->url
    },
    "facility": *[_type == "facilityPhoto"] | order(order asc)[0] {
      title,
      "photoUrl": photo.asset->url
    }
  }`;
  return client.fetch(query, {}, { next: { revalidate: 60 } });
}

export default async function System() {
  const data = await getSystemData();

  const teacherImg = data?.teacher?.imageUrl ?? null;
  const teacherName = data?.teacher
    ? `${data.teacher.firstName} ${data.teacher.lastName}`
    : "Οι Καθηγητές μας";
  const teacherSpecialty = data?.teacher?.specialty ?? "";

  const facilityImg = data?.facility?.photoUrl ?? null;

  return (
    <section className="relative w-full py-24 bg-white overflow-hidden border-b-8 border-brand-teal min-h-[85vh] flex items-center">
      {/* Billboard background text */}
      <div className="absolute top-[20%] left-0 w-full overflow-hidden pointer-events-none z-0">
        <h2 className="text-[25vw] font-black text-gray-100 whitespace-nowrap select-none tracking-tighter animate-billboard inline-block uppercase">
          ΜΟΡΦΩΣΗ
        </h2>
      </div>

      <div className="w-full px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16 xl:max-w-[1600px] mx-auto">

        {/* Left Side text */}
        <div className="lg:w-1/3">
          <span className="text-sm font-black tracking-widest text-gray-900 uppercase mb-8 block">Εκπαιδευτική Μέθοδος</span>
          <h3 className="text-4xl lg:text-5xl xl:text-6xl font-black text-brand-orange leading-[1.1] mb-10 tracking-tighter">
            Η Εκπαίδευση <br/> που Αξίζεις <br/> στη Μόρφωση!
          </h3>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-gray-900 font-extrabold uppercase text-xs hover:text-brand-teal transition-colors group tracking-widest"
          >
            Γνωρίστε την Ομάδα μας
            <span className="text-brand-orange group-hover:translate-x-1 transition-transform">{">"}</span>
          </Link>
          <Link
            href="/about"
            id="homepage-about-cta"
            className="mt-6 inline-flex items-center gap-3 bg-brand-teal text-white px-8 py-4 font-black text-xs uppercase tracking-widest border-4 border-gray-900 shadow-[6px_6px_0px_#111] hover:shadow-[2px_2px_0px_#111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all group"
          >
            Σχετικά με Εμάς
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-3 bg-brand-orange text-white px-8 py-4 font-black text-xs uppercase tracking-widest border-4 border-gray-900 shadow-[6px_6px_0px_#111] hover:shadow-[2px_2px_0px_#111] hover:translate-x-[4px] hover:translate-y-[4px] transition-all group"
          >
            Κλείσε Δωρεάν Δοκιμαστικό
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Right Side — Big photo + overlapping 4-tile grid */}
        <div className="lg:w-2/3 relative min-h-[500px] lg:min-h-[700px] w-full border-l-[12px] border-brand-teal overflow-hidden">

          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="/bigfront.jpg"
              alt="Φροντιστήριο Μόρφωση"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gray-900/30" />
          </div>

          {/* Overlapping 4-tile grid */}
          <div className="absolute -left-8 lg:-left-24 xl:-left-40 top-1/2 -translate-y-1/2 shadow-2xl w-[95%] max-w-[450px] grid grid-cols-2 gap-px bg-gray-300 border-l-[12px] border-brand-orange">

            {/* Tile 1 — Random teacher from Sanity */}
            <Link href="/teachers" className="bg-white p-0 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors h-[200px] group cursor-pointer relative overflow-hidden">
              {teacherImg ? (
                <>
                  <Image src={teacherImg} alt={teacherName} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                    <span className="font-black text-xs text-white leading-tight block">{teacherName}</span>
                    {teacherSpecialty && <span className="font-bold text-[10px] text-brand-orange block">{teacherSpecialty}</span>}
                  </div>
                  <div className="absolute top-3 right-3 bg-brand-teal text-white text-[9px] font-black uppercase tracking-widest px-2 py-1">
                    Η ΟΜΆΔΑ ΜΑΣ
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 p-6">
                  <div className="w-16 h-16 bg-gray-200 group-hover:scale-105 transition-transform rounded-full" />
                  <span className="font-extrabold text-sm text-gray-900 leading-tight group-hover:text-brand-orange transition-colors">Οι Καθηγητές<br/>Μας</span>
                </div>
              )}
            </Link>

            {/* Tile 2 — Facility photo from Sanity */}
            <Link href="/about" className="bg-white p-0 flex flex-col items-center justify-center text-center hover:bg-brand-teal transition-colors h-[200px] group cursor-pointer relative overflow-hidden">
              {facilityImg ? (
                <>
                  <Image src={facilityImg} alt="Χώρος Μόρφωσης" fill className="object-cover group-hover:scale-105 transition-transform duration-500 group-hover:opacity-70" />
                  <div className="absolute inset-0 bg-brand-teal/0 group-hover:bg-brand-teal/60 transition-colors" />
                  <span className="relative z-10 font-extrabold text-xs text-transparent group-hover:text-white leading-tight transition-colors px-3">
                    Οι Εγκαταστάσεις<br/>μας
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 p-6">
                  <div className="w-16 h-16 bg-gray-200 group-hover:bg-white/30 transition-colors" />
                  <span className="font-extrabold text-sm text-gray-900 group-hover:text-white leading-tight transition-colors">Οι Εγκαταστάσεις<br/>μας</span>
                </div>
              )}
            </Link>

            {/* Tile 3 — Exetasi foto (static) */}
            <Link href="/exams" className="bg-white p-0 flex flex-col items-center justify-center text-center hover:bg-brand-orange transition-colors h-[200px] group cursor-pointer relative overflow-hidden">
              <Image src="/exetasi.jpg" alt="Προσομοίωση Εξέτασης" fill className="object-cover group-hover:scale-105 transition-transform duration-500 group-hover:opacity-60" />
              <div className="absolute inset-0 bg-brand-orange/0 group-hover:bg-brand-orange/50 transition-colors" />
              <span className="relative z-10 font-extrabold text-xs text-white bg-gray-900/60 group-hover:bg-transparent px-2 py-1 leading-tight text-center transition-all">
                Προσομοιώσεις<br/>Εξετάσεων
              </span>
            </Link>

            {/* Tile 4 — Academic guidance */}
            <Link href="/contact" className="bg-white p-6 lg:p-10 flex flex-col items-center justify-center text-center gap-4 hover:bg-brand-teal-dark transition-colors h-[200px] group cursor-pointer">
              <div className="w-16 h-16 bg-brand-teal/20 border-2 border-brand-teal flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-teal group-hover:text-white transition-colors">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <div>
                <span className="font-extrabold text-sm text-gray-900 group-hover:text-white leading-tight transition-colors block">Ακαδημαϊκός<br/>Προσανατολισμός</span>
                <span className="text-[10px] text-gray-400 group-hover:text-white/70 font-bold uppercase tracking-wider mt-1 block transition-colors">Βρες τον σωστό δρόμο</span>
              </div>
            </Link>

          </div>
        </div>

      </div>
    </section>
  );
}
