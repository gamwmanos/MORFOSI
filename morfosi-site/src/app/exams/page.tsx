import { client } from "@/sanity/client";
import ExamsHub from "@/components/exams/ExamsHub";

// Server Component GROQ Query
const EXAMS_DATA_QUERY = `*[_type == "examMaterial"] | order(date desc) {
  _id,
  title,
  date,
  examCategory,
  classDropdown,
  subject,
  "questionsUrl": questionsFile.asset->url,
  "answersUrl": answersFile.asset->url
}`;

export const metadata = {
  title: 'Θέματα & Διαγωνίσματα | Μόρφωση',
  description: 'Λύσε θέματα Πανελληνίων, διαγωνίσματα ΟΕΦΕ και θέματα προσομοίωσης από το Φροντιστήριο Μόρφωση.',
}

export default async function ExamsPage() {
  // Fetching Data από το Sanity CMS
  const exams = await client.fetch(EXAMS_DATA_QUERY);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-brand-teal selection:text-white">
      <main className="flex-1 flex flex-col">
        {/* The Client Component where all the heavy lifting and UI interaction happens */}
        <ExamsHub initialExams={exams} />
      </main>
    </div>
  );
}
