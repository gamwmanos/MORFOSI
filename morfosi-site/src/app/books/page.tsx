import { client } from "@/sanity/client";
import Header from "@/components/Header";
import Link from "next/link";
import { BookOpen } from "lucide-react";

// Server Component GROQ Query
const ALL_BOOKS_QUERY = `*[_type == "book"] | order(orderPriority asc) {
  _id,
  title,
  category,
  subject,
  orderPriority,
  "coverUrl": coverImage.asset->url,
  "pdfUrl": pdfFile.asset->url,
  externalUrl
}`;

export default async function BooksPage() {
  const books = await client.fetch(ALL_BOOKS_QUERY);

  // Fallback testing
  const displayBooks = books.length > 0 ? books : [
    { _id: 'b1', title: 'Μαθηματικά Προσανατολισμού', category: 'Γ_ΛΥΚΕΙΟΥ', subject: 'Μαθηματικά', orderPriority: 1 },
    { _id: 'b2', title: 'Νεοελληνική Γλώσσα', category: 'Γ_ΛΥΚΕΙΟΥ', subject: 'Γλώσσα', orderPriority: 2 },
    { _id: 'b3', title: 'Φυσική', category: 'Β_ΛΥΚΕΙΟΥ', subject: 'Φυσική', orderPriority: 1 },
  ];

  // Map user-friendly category titles
  const categoryTitles: Record<string, string> = {
    'Γ_ΛΥΚΕΙΟΥ': "Γ' Λυκείου",
    'Β_ΛΥΚΕΙΟΥ': "Β' Λυκείου",
    'Α_ΛΥΚΕΙΟΥ': "Α' Λυκείου",
    'ΓΥΜΝΑΣΙΟ': "Γυμνάσιο",
    'ΓΕΝΙΚΟ': "Γενικό Αναγνωστήριο",
  };

  // Group books by category
  const groupedBooks = displayBooks.reduce((acc: any, book: any) => {
    const cat = book.category || 'ΓΕΝΙΚΟ';
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(book);
    return acc;
  }, {});

  // For establishing consistent rendering order of categories
  const categoryOrder = ['Γ_ΛΥΚΕΙΟΥ', 'Β_ΛΥΚΕΙΟΥ', 'Α_ΛΥΚΕΙΟΥ', 'ΓΥΜΝΑΣΙΟ', 'ΓΕΝΙΚΟ'];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-brand-teal selection:text-white">
      <Header />
      
      <main className="pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center md:text-left mb-24 border-b-[6px] border-brand-teal pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
               <h1 className="text-5xl lg:text-7xl font-black text-gray-900 uppercase tracking-tighter mb-4">
                 ΕΚΔΟΣΕΙΣ <span className="text-brand-orange">ΜΟΡΦΩΣΗ</span>
               </h1>
               <p className="text-xl text-gray-500 font-bold uppercase tracking-widest">Ο δρόμος για την κορυφή περνάει από τα βιβλία μας.</p>
            </div>
            <BookOpen size={80} className="text-gray-200" strokeWidth={1} />
          </div>

          <div className="flex flex-col gap-24">
             {categoryOrder.map((catKey) => {
                const categoryBooks = groupedBooks[catKey];
                if (!categoryBooks || categoryBooks.length === 0) return null;

                return (
                   <section key={catKey} className="w-full">
                      <div className="flex items-center gap-6 mb-12">
                         <h2 className="text-3xl font-black text-brand-teal uppercase tracking-tighter border-l-8 border-brand-orange pl-4 leading-none">
                           {categoryTitles[catKey] || catKey}
                         </h2>
                         <div className="flex-1 h-px bg-gray-300"></div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-10 gap-6">
                         {categoryBooks.map((item: any) => (
                           <Link href={item.pdfUrl || item.externalUrl || '#'} target="_blank" rel="noopener noreferrer" key={item._id} className="bg-white aspect-[3/4] flex flex-col items-center justify-center p-0 border-b-[8px] border-brand-teal text-center hover:-translate-y-2 transition-transform shadow-lg relative group overflow-hidden h-full">
                              {item.coverUrl ? (
                                 <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              ) : (
                                 <div className="p-6 flex flex-col items-center justify-center w-full h-full bg-gray-100">
                                    <span className="text-brand-teal-dark font-black text-lg lg:text-xl mb-2 block leading-snug">{item.title}</span>
                                    {item.subject && <span className="text-brand-orange font-black uppercase text-xs tracking-widest">{item.subject}</span>}
                                 </div>
                              )}
                              
                              <div className="absolute top-4 right-4 bg-gray-900 text-white px-3 py-1 flex items-center justify-center rounded-sm font-black text-[10px] opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                                Priority: {item.orderPriority || '-'}
                              </div>
                           </Link>
                         ))}
                      </div>
                   </section>
                );
             })}
          </div>

        </div>
      </main>
    </div>
  );
}
