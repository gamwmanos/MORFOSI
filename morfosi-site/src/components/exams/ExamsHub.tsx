"use client"

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, FileText, BookOpen, Layers, CheckCircle } from 'lucide-react';

// Interface matching the Server Page GROQ Query
export interface ExamType {
  _id: string;
  title: string;
  date?: string;
  examCategory?: 'panellinies' | 'oefe' | 'morfosi';
  tracks?: string[];
  classDropdown?: string;
  subject?: string;
  questionsUrl?: string;
  answersUrl?: string;
}

const TRACK_LABELS: Record<string, string> = {
  humanities: "Ανθρωπιστικών Σπουδών",
  positive: "Θετικών Σπουδών",
  health: "Σπουδών Υγείας",
  econ: "Σπουδών Οικονομίας & Πληροφορικής",
};

export default function ExamsHub({ initialExams }: { initialExams: ExamType[] }) {
  const [activeTab, setActiveTab] = useState<'panellinies' | 'oefe' | 'morfosi'>('panellinies');
  const [activeTrack, setActiveTrack] = useState<string>('positive');
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback Data if Sanity is empty so UI still looks impressive
  const examsList = initialExams.length > 0 ? initialExams : [
    { _id: 'e1', title: 'Μαθηματικά Προσανατολισμού', examCategory: 'panellinies', tracks: ['positive'], classDropdown: 'Γ Λυκείου', subject: 'Μαθηματικά', date: '2023-06-08' },
    { _id: 'e2', title: 'Φυσική Προσανατολισμού', examCategory: 'panellinies', tracks: ['positive', 'health'], classDropdown: 'Γ Λυκείου', subject: 'Φυσική', date: '2023-06-12' },
    { _id: 'e3', title: 'Χημεία Προσανατολισμού', examCategory: 'oefe', tracks: ['positive', 'health'], classDropdown: 'Γ Λυκείου', subject: 'Χημεία', date: '2024-01-20' },
    { _id: 'e4', title: 'Eκθεση (Νεοελληνική Γλώσσα)', examCategory: 'morfosi', tracks: ['general', 'positive', 'humanities', 'health', 'econ'], classDropdown: 'Γ Λυκείου', subject: 'Έκθεση', date: '2024-03-05' },
    { _id: 'e5', title: 'Αρχαία Ελληνικά', examCategory: 'panellinies', tracks: ['humanities'], classDropdown: 'Γ Λυκείου', subject: 'Αρχαία', date: '2023-06-09' },
    { _id: 'e6', title: 'Βιολογία Προσανατολισμού', examCategory: 'oefe', tracks: ['health'], classDropdown: 'Γ Λυκείου', subject: 'Βιολογία', date: '2024-01-22' },
  ] as ExamType[];

  // Debugging: Log the exams to see what data we're actually getting
  useEffect(() => {
    console.log("Initial Exams from Sanity:", initialExams);
  }, [initialExams]);

  // Helper to infer tracks if not set in Sanity
  const inferTracks = (subject?: string, title?: string): string[] => {
    const s = (subject || title || "").toUpperCase();

    const allTracks = ['humanities', 'positive', 'health', 'econ'];

    if (s.includes("ΕΚΘΕΣΗ") || s.includes("ΓΛΩΣΣΑ")) {
      return allTracks;
    }
    if (s.includes("ΜΑΘΗΜΑΤΙΚΑ")) {
      return ['positive', 'econ'];
    }
    if (s.includes("ΦΥΣΙΚΗ") || s.includes("ΧΗΜΕΙΑ") || s.includes("ΒΙΟΛΟΓΙΑ")) {
      return ['positive', 'health'];
    }
    if (s.includes("ΑΡΧΑΙΑ") || s.includes("ΛΑΤΙΝΙΚΑ") || s.includes("ΙΣΤΟΡΙΑ")) {
      return ['humanities'];
    }
    if (s.includes("ΠΛΗΡΟΦΟΡΙΚΗ") || s.includes("ΑΕΠΠ")) {
      return ['econ'];
    }

    return allTracks;
  };

  // Grouped and Filtered Exams
  const filteredData = useMemo(() => {
    // 1. Filter by Category and Search
    const prelimFiltered = examsList.filter(exam => {
      const category = exam.examCategory || 'panellinies';
      if (category !== activeTab) return false;

      const searchTerms = searchQuery.toLowerCase();
      return !searchTerms ||
        (exam.title?.toLowerCase().includes(searchTerms) || false) ||
        (exam.subject?.toLowerCase().includes(searchTerms) || false);
    });

    // 2. Filter by Active Track and Sort by Date Descending
    const finalExams = prelimFiltered.filter(exam => {
      const tracks = (exam.tracks && exam.tracks.length > 0)
        ? exam.tracks
        : inferTracks(exam.subject, exam.title);
      return tracks.includes(activeTrack);
    }).sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

    // 3. Group by Subject within the track
    const subjectGroups: Record<string, ExamType[]> = {};
    finalExams.forEach(exam => {
      const sub = exam.subject || "Λοιπά";
      if (!subjectGroups[sub]) subjectGroups[sub] = [];
      subjectGroups[sub].push(exam);
    });

    return {
      exams: finalExams,
      groups: subjectGroups,
      totalCount: finalExams.length
    };
  }, [examsList, activeTab, activeTrack, searchQuery]);

  return (
    <div className="w-full flex-1 flex flex-col bg-brand-teal-dark relative overflow-hidden">

      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none z-0"
        style={{
          backgroundImage: "linear-gradient(#ffffff 2px, transparent 2px), linear-gradient(90deg, #ffffff 2px, transparent 2px)",
          backgroundSize: "60px 60px"
        }}
      />

      {/* Massive Header Section */}
      <section className="relative z-10 pt-24 pb-8 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">

          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-brand-orange border-[3px] border-black px-4 py-2 mb-6 shadow-[4px_4px_0px_#000] rotate-1">
              <BookOpen size={20} className="text-white" />
              <span className="font-black text-white text-sm tracking-widest uppercase">Βαση Δεδομενων</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.8] uppercase tracking-tighter drop-shadow-lg">
              ΘΕΜΑΤΑ & <br /><span className="text-brand-orange bg-black px-3 py-1 inline-block mt-2 shadow-[8px_8px_0px_#f97316]">ΛΥΣΕΙΣ</span>
            </h1>
          </div>

          <div className="w-full md:w-1/3">
            <p className="text-white font-bold text-lg border-l-4 border-brand-orange pl-4">
              Πρόσβαση σε εκατοντάδες διαγωνίσματα, από παλαιότερα θέματα Πανελληνίων, της ΟΕΦΕ και τα δικά μας εσωτερικά τέστ, όλα σε μορφή PDF.
            </p>
          </div>
        </div>

        {/* Category Tabs & Search Row */}
        <div className="flex flex-col lg:flex-row items-center gap-6 mt-16 p-4 bg-white border-[6px] border-black shadow-[12px_12px_0px_#000]">

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row w-full lg:w-auto p-1 gap-2 border-[4px] border-black bg-gray-100">
            <TabButton
              active={activeTab === 'panellinies'}
              onClick={() => setActiveTab('panellinies')}
              title="ΠΑΝΕΛΛΗΝΙΕΣ"
              color="bg-brand-teal"
            />
            <TabButton
              active={activeTab === 'oefe'}
              onClick={() => setActiveTab('oefe')}
              title="Ο.Ε.Φ.Ε."
              color="bg-brand-purple"
            />
            <TabButton
              active={activeTab === 'morfosi'}
              onClick={() => setActiveTab('morfosi')}
              title="ΜΟΡΦΩΣΗ"
              color="bg-brand-orange"
            />
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 w-full border-[4px] border-black h-[4.5rem]">
            <input
              type="text"
              placeholder="Αναζήτηση με βάση μάθημα ή τίτλο..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full bg-white px-6 py-4 font-bold text-gray-900 border-none outline-none text-lg uppercase tracking-wide placeholder-gray-400"
            />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-black flex items-center justify-center border-l-4 border-black group">
              <Search className="text-white group-hover:scale-125 transition-transform" size={24} strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Secondary Track Tabs */}
        <div className="flex flex-wrap gap-3 mt-8">
          {Object.entries(TRACK_LABELS).map(([trackId, label]) => (
            <button
              key={trackId}
              onClick={() => setActiveTrack(trackId)}
              className={`px-5 py-3 font-black uppercase text-xs tracking-widest border-[4px] border-black transition-all shadow-[4px_4px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none ${activeTrack === trackId
                  ? 'bg-brand-orange text-white'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid Content Section */}
      <section className="relative z-10 flex-1 px-6 lg:px-12 pb-32 max-w-7xl mx-auto w-full">
        <div className="bg-white border-[8px] border-black shadow-[20px_20px_0px_#000] p-6 lg:p-12 min-h-[500px]">

          {filteredData.totalCount === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-gray-100 border-[4px] border-black rounded-full flex items-center justify-center mb-6">
                <Search size={48} className="text-gray-400" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight uppercase mb-2">Δεν βρεθηκαν σετ</h3>
              <p className="font-bold text-gray-500 max-w-md">Δοκίμασε να αλλάξεις τους όρους αναζήτησης ή επέλεξε άλλη κατηγορία/κατεύθυνση.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {Object.entries(filteredData.groups).map(([subject, exams]) => (
                <div key={subject} className="space-y-8">
                  <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter border-l-8 border-brand-teal pl-4 py-1">
                      {subject}
                    </h2>
                    <div className="h-1 flex-1 bg-gray-100 border-y-2 border-black"></div>
                  </div>

                  <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                  >
                    <AnimatePresence>
                      {exams.map((exam) => (
                        <ExamCard key={`${activeTrack}-${exam._id}`} exam={exam} />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

    </div>
  );
}

// ------ Helper Components ------

function TabButton({ active, onClick, title, color }: { active: boolean, onClick: () => void, title: string, color: string }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-6 py-4 font-black uppercase tracking-widest text-sm transition-all overflow-hidden ${active ? `${color} text-white` : 'bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-200'
        }`}
    >
      <span className="relative z-10">{title}</span>
      {active && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute inset-0 border-b-[6px] border-black z-0 pointer-events-none"
          initial={false}
          transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
        />
      )}
    </button>
  );
}

function ExamCard({ exam }: { exam: ExamType }) {

  // Format Date safely
  let dateFormatted = "ΑΓΝΩΣΤΗ ΗΜ/ΝΙΑ";
  if (exam.date) {
    const d = new Date(exam.date);
    dateFormatted = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      className="bg-white border-[4px] border-black p-6 group hover:-translate-y-2 hover:shadow-[12px_12px_0px_#000] transition-all flex flex-col justify-between min-h-[22rem]"
    >
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="bg-gray-100 border-2 border-black px-3 py-1 font-black text-xs uppercase tracking-widest text-gray-600">
            {exam.classDropdown || 'Γ Λυκείου'}
          </div>
          {exam.subject && (
            <div className="bg-brand-orange border-2 border-black px-3 py-1 font-black text-xs uppercase tracking-widest text-white shadow-[2px_2px_0px_#000] rotate-2">
              {exam.subject}
            </div>
          )}
        </div>

        <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-tight line-clamp-3 mb-4 group-hover:text-brand-orange transition-colors">
          {exam.title}
        </h3>

        <div className="flex items-center gap-2 mb-8">
          <Layers size={16} className="text-brand-teal" />
          <span className="font-bold text-xs text-gray-500 uppercase tracking-widest">
            {dateFormatted}
          </span>
        </div>
      </div>

      {/* Download Buttons Area */}
      <div className="mt-auto space-y-3">
        <div className="w-full h-1 bg-gray-200 mb-4"></div>

        {exam.questionsUrl ? (
          <a href={exam.questionsUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-brand-teal text-white border-[3px] border-black p-3 hover:bg-brand-teal-dark hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#000] transition-all flex items-center justify-between font-black uppercase text-sm group/btn">
            <span>Εκφωνησεις</span>
            <FileText size={20} className="group-hover/btn:scale-110 transition-transform" />
          </a>
        ) : (
          <div className="w-full bg-gray-100 text-gray-400 border-[3px] border-gray-300 p-3 flex items-center justify-between font-black uppercase text-sm cursor-not-allowed">
            <span>Μη Διαθεσιμο</span>
            <FileText size={20} />
          </div>
        )}

        {exam.answersUrl ? (
          <a href={exam.answersUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-black text-white border-[3px] border-black p-3 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--color-brand-orange)] transition-all flex items-center justify-between font-black uppercase text-sm group/btn">
            <span>Απαντησεις</span>
            <CheckCircle size={20} className="text-brand-orange group-hover/btn:text-white transition-colors" />
          </a>
        ) : (
          <div className="w-full bg-gray-100 text-gray-400 border-[3px] border-gray-300 p-3 flex items-center justify-between font-black uppercase text-sm cursor-not-allowed">
            <span>Χωρις Απαντησεις</span>
            <CheckCircle size={20} />
          </div>
        )}
      </div>

    </motion.div>
  );
}
