import { client } from "@/sanity/client";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import System from "@/components/System";
import Stats from "@/components/Stats";
import Programs from "@/components/Programs";
import PromoStrips from "@/components/PromoStrips";
import Testimonials from "@/components/Testimonials";
import ScrollVideo from "@/components/ScrollVideo";
import BooksCarousel from "@/components/BooksCarousel";
import Link from "next/link";

// Server Component GROQ Query - Τραβάει τα πάντα από την Βάση
const PAGE_DATA_QUERY = `{
  "programs": *[_type == "program"] | order(_createdAt asc) {
    _id,
    title,
    description,
    "slug": slug.current,
    "iconUrl": icon.asset->url
  },
  "testimonials": *[_type == "studentSuccess"] | order(year desc)[0...4] {
    _id,
    studentName,
    year,
    university,
    quote,
    "photoUrl": photo.asset->url
  },
  "posts": *[_type == "post"] | order(publishedAt desc)[0...2] {
    _id,
    title,
    publishedAt,
    "slug": slug.current,
    "imageUrl": mainImage.asset->url,
    category
  },
  "books": *[_type == "book"] | order(_createdAt desc) {
    _id,
    title,
    category,
    "coverUrl": coverImage.asset->url,
    "pdfUrl": pdfFile.asset->url,
    externalUrl
  }
}`;

export default async function Home() {
  // Fetching Data από το Sanity CMS
  const data = await client.fetch(PAGE_DATA_QUERY);

  // Fallbacks: Αν η βάση στο Sanity είναι άδεια, βοηθάμε το Design να μη σπάσει, γεμίζοντας με Demo Data.
  const displayBooks = data.books?.length > 0 ? data.books : [
    { _id: 'b1', title: 'ΒΙΒΛΙΟ 1', category: 'Πρόσθεσε από το Studio' },
    { _id: 'b2', title: 'ΒΙΒΛΙΟ 2', category: 'Πρόσθεσε από το Studio' },
    { _id: 'b3', title: 'ΒΙΒΛΙΟ 3', category: 'Πρόσθεσε από το Studio' }
  ];

  const displayPosts = data.posts.length > 0 ? data.posts : [
    { _id: 'p1', title: 'Demo Ανακοίνωση 1 (Βάση Άδεια)', publishedAt: '2026-04-01T00:00:00Z' },
    { _id: 'p2', title: 'Demo Ανακοίνωση 2 (Βάση Άδεια)', publishedAt: '2026-11-01T00:00:00Z' }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-brand-teal selection:text-white">
      <Header />
      
      <main>
        {/* 1st Scroll: Split-Screen White Hero */}
        <Hero />
        
        {/* 2nd Scroll: Apple-style Scroll Video Scrubbing (Canvas) */}
        <ScrollVideo />

        {/* 3rd Scroll: System of Success */}
        <System />

        {/* 3rd Scroll: Massive Stats */}
        <Stats />

        {/* 4th Scroll: Programs Grid (ΣΥΝΔΕΘΗΚΕ ΜΕ CMS) */}
        <Programs programs={data.programs} />

        {/* 5th Scroll: Promo Strips */}
        <PromoStrips />

        {/* 6th Scroll: Testimonials (ΣΥΝΔΕΘΗΚΕ ΜΕ CMS) */}
        <Testimonials testimonials={data.testimonials} />

        {/* 7th Scroll: Εκδόσεις (Books) (ΣΥΝΔΕΘΗΚΕ ΜΕ CMS) */}
        <section className="bg-brand-teal-dark py-24 w-full">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/3 text-white">
              <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-tight mb-4">ΕΚΔΟΣΕΙΣ<br/><span className="text-brand-orange">ΜΟΡΦΩΣΗ</span></h2>
              <p className="font-bold text-sm tracking-wide opacity-90">Τα δικά μας συγγράμματα, σχεδιασμένα από την ακαδημαϊκή μας ομάδα, που οδηγούν στην κορυφή.</p>
              <Link href="/books" className="mt-8 border-4 border-white px-8 py-4 font-black uppercase tracking-widest text-xs hover:bg-white hover:text-brand-teal-dark transition-colors inline-block w-max">ΟΛΑ ΤΑ ΒΙΒΛΙΑ</Link>
            </div>
            
            <BooksCarousel books={displayBooks} />
          </div>
        </section>

        {/* 8th Scroll: Νέα & Ανακοινώσεις (ΣΥΝΔΕΘΗΚΕ ΜΕ CMS) */}
        <section className="bg-white py-32 w-full border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b-[6px] border-gray-900 pb-4 gap-6">
              <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-gray-900 leading-none">ΝΕΑ &<br/><span className="text-brand-orange">ΑΝΑΚΟΙΝΩΣΕΙΣ</span></h2>
              <button className="text-brand-teal font-black text-sm tracking-widest uppercase hover:text-gray-900 transition-colors">
                ΠΕΡΙΣΣΟΤΕРА {">"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
               {displayPosts.map((item: any) => {
                 const dateObj = new Date(item.publishedAt);
                 const day = dateObj.getDate().toString().padStart(2, '0');
                 const monthStr = dateObj.toLocaleDateString('el-GR', { month: 'short' }).toUpperCase();
                 const year = dateObj.getFullYear();
                 
                 return (
                 <div key={item._id} className="flex gap-8 group cursor-pointer border-b-2 md:border-b-0 border-gray-200 pb-8 md:pb-0">
                    <div className="text-brand-orange text-right flex-shrink-0">
                       <span className="text-6xl lg:text-7xl font-sans font-black leading-[0.8] block tracking-tighter group-hover:scale-110 transition-transform">{day}</span>
                       <span className="text-sm font-black uppercase tracking-widest mt-2 block">{monthStr} {year}</span>
                    </div>
                    <div className="pt-2">
                       <h3 className="text-2xl font-black text-gray-900 leading-snug mb-4 group-hover:text-brand-orange transition-colors tracking-tight line-clamp-2">
                         {item.title}
                       </h3>
                       <p className="text-gray-500 font-bold mb-4 line-clamp-2">
                         {item.category ? `Κατηγορία: ${item.category.toUpperCase()}` : 'Η θερινή προετοιμασία είναι το κλειδί για την επιτυχία...'}
                       </p>
                       <p className="text-brand-teal font-extrabold text-xs uppercase tracking-widest">ΔΙΑΒΑΣΤΕ ΠΕΡΙΣΣΟΤΕРА</p>
                    </div>
                 </div>
                 );
               })}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}