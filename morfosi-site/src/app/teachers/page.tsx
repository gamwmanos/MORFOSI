import { client } from "@/sanity/client";
import Header from "@/components/Header";

const TEACHERS_QUERY = `*[_type == "teacher"] | order(lastName asc) {
  _id,
  firstName,
  lastName,
  specialty,
  "imageUrl": image.asset->url
}`;

export default async function TeachersPage() {
  const teachers = await client.fetch(TEACHERS_QUERY);

  // Fallbacks in case the CMS is empty
  const displayTeachers = teachers.length > 0 ? teachers : [
    { _id: 't1', firstName: 'ΠΡΟΣΘΕΣΕ ΚΑΘΗΓΗΤΕΣ', lastName: 'ΑΠΟ ΤΟ CMS', specialty: 'Sanity Studio' },
    { _id: 't2', firstName: 'ΠΡΟΣΘΕΣΕ ΚΑΘΗΓΗΤΕΣ', lastName: 'ΑΠΟ ΤΟ CMS', specialty: 'Sanity Studio' },
    { _id: 't3', firstName: 'ΠΡΟΣΘΕΣΕ ΚΑΘΗΓΗΤΕΣ', lastName: 'ΑΠΟ ΤΟ CMS', specialty: 'Sanity Studio' }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-brand-teal selection:text-white">
      <Header />
      
      <main className="pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="text-center md:text-left mb-24 border-b-[6px] border-brand-teal pb-8">
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 uppercase tracking-tighter mb-4">
              Οι Καθηγητές <span className="text-brand-orange">Μας</span>
            </h1>
            <p className="text-xl text-gray-500 font-bold uppercase tracking-widest">Η κινητήρια δύναμη πίσω από κάθε επιτυχία.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 lg:gap-16">
            {displayTeachers.map((teacher: any) => (
              <div key={teacher._id} className="group cursor-pointer">
                
                {/* Image Wrapper */}
                <div className="bg-gray-100 aspect-[3/4] w-full mb-6 overflow-hidden border-b-[8px] border-transparent group-hover:border-brand-orange transition-all duration-300 relative">
                  {teacher.imageUrl ? (
                     <img 
                       src={teacher.imageUrl} 
                       alt={`${teacher.firstName} ${teacher.lastName}`} 
                       className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100" 
                     />
                  ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 font-black uppercase text-xs tracking-widest">
                       ΦΩΤΟ.
                     </div>
                  )}
                  
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-brand-teal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-2xl font-black text-brand-teal-dark tracking-tight uppercase group-hover:text-brand-orange transition-colors">
                    {teacher.lastName} <br/><span className="text-gray-900 font-extrabold">{teacher.firstName}</span>
                  </h3>
                  <p className="mt-2 text-xs font-black uppercase text-gray-400 tracking-widest border-l-2 border-brand-teal pl-2">{teacher.specialty}</p>
                </div>

              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
