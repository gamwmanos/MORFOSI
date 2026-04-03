// src/app/schedule/page.tsx
import { client } from "@/sanity/client";
import Link from "next/link";
import { CalendarDays, Clock, User2, DoorOpen, Users2, ChevronRight, BookOpen } from "lucide-react";

// ─── GROQ Query ────────────────────────────────────────────────────────────────
const SCHEDULE_QUERY = `
  *[_type == "classSchedule" && isActive == true] | order(schoolYear asc, className asc) {
    _id,
    className,
    schoolYear,
    trackType,
    description,
    maxStudents,
    currentStudents,
    color,
    isFull,
    "schedule": schedule[] | order(day asc, startTime asc) {
      day,
      startTime,
      endTime,
      subject,
      teacher,
      room
    }
  }
`;

// ─── Helpers ────────────────────────────────────────────────────────────────────
const DAY_ORDER = ["monday","tuesday","wednesday","thursday","friday","saturday"];
const DAY_LABELS: Record<string, string> = {
  monday: "Δευτέρα",
  tuesday: "Τρίτη",
  wednesday: "Τετάρτη",
  thursday: "Πέμπτη",
  friday: "Παρασκευή",
  saturday: "Σάββατο",
};
const DAY_SHORT: Record<string, string> = {
  monday: "ΔΕΥ",
  tuesday: "ΤΡΙ",
  wednesday: "ΤΕΤ",
  thursday: "ΠΕΜ",
  friday: "ΠΑΡ",
  saturday: "ΣΑΒ",
};

const YEAR_LABELS: Record<string, string> = {
  A_LYKEIOU: "Α΄ Λυκείου",
  B_LYKEIOU: "Β΄ Λυκείου",
  C_LYKEIOU: "Γ΄ Λυκείου",
  A_GYMNASIOU: "Α΄ Γυμνασίου",
  B_GYMNASIOU: "Β΄ Γυμνασίου",
  C_GYMNASIOU: "Γ΄ Γυμνασίου",
};

const TRACK_LABELS: Record<string, string> = {
  THETIKES: "Θετικές Επιστήμες",
  ANTHROPISTIKES: "Ανθρωπιστικές Σπουδές",
  OIKONOMIAS: "Οικονομίας & Πληροφορικής",
  GENIKO: "Γενικό",
};

type LessonSlot = {
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacher?: string;
  room?: string;
};

type ClassGroup = {
  _id: string;
  className: string;
  schoolYear: string;
  trackType?: string;
  description?: string;
  maxStudents?: number;
  currentStudents?: number;
  color?: string;
  isFull: boolean;
  schedule?: LessonSlot[];
};

// ─── Demo data when Sanity is empty ────────────────────────────────────────────
const DEMO_CLASSES: ClassGroup[] = [
  {
    _id: "demo-a1",
    className: "Α1",
    schoolYear: "A_LYKEIOU",
    trackType: "GENIKO",
    description: "Πρωινό τμήμα Α΄ Λυκείου — μέγιστο 12 μαθητές",
    maxStudents: 12,
    currentStudents: 8,
    color: "#0c82a2",
    isFull: false,
    schedule: [
      { day: "monday", startTime: "16:00", endTime: "18:00", subject: "Μαθηματικά", teacher: "Παπαδόπουλος Γ.", room: "Αίθουσα 1" },
      { day: "tuesday", startTime: "17:00", endTime: "19:00", subject: "Φυσική", teacher: "Νικολάου Α.", room: "Αίθουσα 2" },
      { day: "wednesday", startTime: "16:00", endTime: "18:00", subject: "Έκθεση", teacher: "Κωνσταντίνου Μ.", room: "Αίθουσα 1" },
      { day: "friday", startTime: "17:00", endTime: "19:00", subject: "Αγγλικά", teacher: "Σμιθ Τ.", room: "Αίθουσα 3" },
    ],
  },
  {
    _id: "demo-b1",
    className: "Β1",
    schoolYear: "B_LYKEIOU",
    trackType: "THETIKES",
    description: "Απογευματινό τμήμα Β΄ Λυκείου Θετικής Κατεύθυνσης",
    maxStudents: 10,
    currentStudents: 10,
    color: "#f58220",
    isFull: true,
    schedule: [
      { day: "monday", startTime: "18:00", endTime: "20:00", subject: "Άλγεβρα", teacher: "Παπαδόπουλος Γ.", room: "Αίθουσα 1" },
      { day: "wednesday", startTime: "18:00", endTime: "20:00", subject: "Φυσική", teacher: "Νικολάου Α.", room: "Αίθουσα 2" },
      { day: "friday", startTime: "16:00", endTime: "18:00", subject: "Χημεία", teacher: "Αθανασίου Β.", room: "Αίθουσα 2" },
    ],
  },
  {
    _id: "demo-c1",
    className: "Γ1",
    schoolYear: "C_LYKEIOU",
    trackType: "THETIKES",
    description: "Εντατικό τμήμα Γ΄ Λυκείου — Προετοιμασία Πανελληνίων",
    maxStudents: 8,
    currentStudents: 6,
    color: "#095f77",
    isFull: false,
    schedule: [
      { day: "monday", startTime: "09:00", endTime: "11:00", subject: "Μαθηματικά", teacher: "Παπαδόπουλος Γ.", room: "Αίθουσα 1" },
      { day: "tuesday", startTime: "09:00", endTime: "11:00", subject: "Φυσική", teacher: "Νικολάου Α.", room: "Αίθουσα 2" },
      { day: "thursday", startTime: "09:00", endTime: "11:00", subject: "Χημεία", teacher: "Αθανασίου Β.", room: "Αίθουσα 2" },
      { day: "saturday", startTime: "10:00", endTime: "13:00", subject: "Επανάληψη", teacher: "Παπαδόπουλος Γ.", room: "Αίθουσα 1" },
    ],
  },
];

// ─── Card Component ─────────────────────────────────────────────────────────────
function ScheduleCard({ group }: { group: ClassGroup }) {
  const accentColor = group.color || "#0c82a2";

  // Group lessons by day
  const byDay: Record<string, LessonSlot[]> = {};
  (group.schedule || []).forEach((slot) => {
    if (!byDay[slot.day]) byDay[slot.day] = [];
    byDay[slot.day].push(slot);
  });

  const sortedDays = DAY_ORDER.filter((d) => byDay[d]);
  const occupancyPct =
    group.maxStudents && group.currentStudents != null
      ? Math.round((group.currentStudents / group.maxStudents) * 100)
      : null;

  return (
    <div className="bg-white border-2 border-gray-900 shadow-[6px_6px_0_0_rgba(0,0,0,0.9)] flex flex-col overflow-hidden group hover:shadow-[10px_10px_0_0_rgba(0,0,0,0.9)] transition-all duration-300 hover:-translate-y-1">
      
      {/* Card Header */}
      <div className="p-5 text-white relative overflow-hidden" style={{ backgroundColor: accentColor }}>
        {/* Big class name watermark */}
        <span className="absolute -right-4 -bottom-6 text-[80px] font-black opacity-10 leading-none select-none pointer-events-none">
          {group.className}
        </span>

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] opacity-80">
                {YEAR_LABELS[group.schoolYear] ?? group.schoolYear}
              </span>
              {group.trackType && (
                <p className="text-[11px] opacity-70 font-bold mt-0.5">
                  {TRACK_LABELS[group.trackType] ?? group.trackType}
                </p>
              )}
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 flex-shrink-0 ${
                group.isFull
                  ? "bg-red-600 text-white"
                  : "bg-white/20 text-white"
              }`}
            >
              {group.isFull ? "🔴 ΠΛΗΡΕΣ" : "🟢 ΕΛΕΎΘΕΡΕΣ ΘΕΣΕΙΣ"}
            </span>
          </div>
          <h2 className="text-4xl font-black tracking-tighter leading-none">
            Τμήμα {group.className}
          </h2>
          {group.description && (
            <p className="text-sm opacity-90 font-medium mt-2 leading-snug">
              {group.description}
            </p>
          )}
        </div>

        {/* Occupancy bar */}
        {occupancyPct !== null && (
          <div className="mt-4 relative z-10">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider opacity-80">
                Πληρότητα
              </span>
              <span className="text-[10px] font-black opacity-90">
                {group.currentStudents}/{group.maxStudents} μαθητές
              </span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${occupancyPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Schedule grid */}
      <div className="flex-1 p-4 space-y-1.5">
        {sortedDays.length === 0 ? (
          <p className="text-gray-400 text-sm font-bold text-center py-6">
            Δεν έχει οριστεί πρόγραμμα ακόμα.
          </p>
        ) : (
          sortedDays.map((day) => (
            <div key={day}>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[9px] font-black px-2 py-0.5 tracking-widest text-white uppercase"
                  style={{ backgroundColor: accentColor }}
                >
                  {DAY_SHORT[day]}
                </span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  {DAY_LABELS[day]}
                </span>
              </div>
              <div className="space-y-1 ml-9">
                {byDay[day].map((slot, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-2 border border-gray-100 bg-gray-50 hover:bg-white transition-colors rounded-sm"
                  >
                    <div className="flex-shrink-0 text-right min-w-[68px]">
                      <span className="text-xs font-black text-gray-900 block">
                        {slot.startTime}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold">
                        {slot.endTime}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm text-gray-900 leading-tight">
                        {slot.subject}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                        {slot.teacher && (
                          <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                            <User2 size={10} /> {slot.teacher}
                          </span>
                        )}
                        {slot.room && (
                          <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                            <DoorOpen size={10} /> {slot.room}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className="text-[10px] font-black px-1.5 py-0.5 text-white"
                        style={{ backgroundColor: accentColor + "cc" }}
                      >
                        {slot.endTime
                          ? (() => {
                              const [sh, sm] = slot.startTime.split(":").map(Number);
                              const [eh, em] = slot.endTime.split(":").map(Number);
                              return `${(eh * 60 + em) - (sh * 60 + sm)}'`;
                            })()
                          : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-4 pb-4 pt-2 border-t border-gray-100">
        {group.isFull ? (
          <p className="text-center text-xs font-black text-red-500 uppercase tracking-widest py-2">
            Δεν υπάρχουν ελεύθερες θέσεις
          </p>
        ) : (
          <Link
            href={`/contact?tmima=${group.className}`}
            className="w-full flex items-center justify-center gap-2 py-3 font-black text-xs uppercase tracking-widest text-white transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ backgroundColor: accentColor }}
          >
            ΕΓΓΡΑΦΗ ΣΕ ΑΥΤΟ ΤΟ ΤΜΗΜΑ
            <ChevronRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────
export default async function SchedulePage() {
  let classes: ClassGroup[] = [];
  try {
    classes = await client.fetch(SCHEDULE_QUERY);
  } catch {
    classes = [];
  }

  const displayClasses = classes.length > 0 ? classes : DEMO_CLASSES;

  // Group by school year for the tabs
  const grouped: Record<string, ClassGroup[]> = {};
  displayClasses.forEach((g) => {
    if (!grouped[g.schoolYear]) grouped[g.schoolYear] = [];
    grouped[g.schoolYear].push(g);
  });

  const yearOrder = [
    "A_GYMNASIOU","B_GYMNASIOU","C_GYMNASIOU",
    "A_LYKEIOU","B_LYKEIOU","C_LYKEIOU",
  ];

  const sortedYears = yearOrder.filter((y) => grouped[y]);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Banner */}
      <section className="bg-gray-900 pt-8 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(12,130,162,0.3)_0%,_transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-8">
            <Link href="/" className="hover:text-brand-orange transition-colors">Αρχική</Link>
            <span>→</span>
            <span className="text-gray-300">Πρόγραμμα Τμημάτων</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-orange text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 mb-4">
                <CalendarDays size={12} />
                ΣΧΟΛΙΚΗ ΧΡΟΝΙΑ 2025–26
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
                ΠΡΟΓΡΑΜΜΑ<br />
                <span className="text-brand-teal">ΤΜΗΜΑΤΩΝ</span>
              </h1>
              <p className="text-gray-400 font-bold text-base mt-4 max-w-xl leading-relaxed">
                Δείτε αναλυτικά το εβδομαδιαίο πρόγραμμα κάθε τμήματος. 
                Διαλέξτε το τμήμα που σας ταιριάζει και εγγραφείτε άμεσα.
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-6 flex-shrink-0">
              <div className="text-center">
                <span className="text-4xl font-black text-white block tracking-tighter">
                  {displayClasses.length}
                </span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Τμήματα
                </span>
              </div>
              <div className="text-center">
                <span className="text-4xl font-black text-brand-orange block tracking-tighter">
                  {displayClasses.filter(c => !c.isFull).length}
                </span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Με Θέσεις
                </span>
              </div>
              <div className="text-center">
                <span className="text-4xl font-black text-brand-teal block tracking-tighter">
                  {displayClasses.reduce((acc, c) => acc + (c.schedule?.length || 0), 0)}
                </span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Μαθήματα/εβδ.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info bar */}
      <div className="bg-brand-teal-dark text-white py-3">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-wrap items-center gap-6 text-xs font-bold">
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-brand-orange" />
            <span>Δευ–Παρ: 09:00–21:00</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-brand-orange" />
            <span>Σάββατο: 09:00–14:00</span>
          </div>
          <div className="flex items-center gap-2">
            <Users2 size={12} className="text-brand-orange" />
            <span>Μέγιστο 12 μαθητές ανά τμήμα</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen size={12} className="text-brand-orange" />
            <span>Μικρά τμήματα — εξατομικευμένη προσοχή</span>
          </div>
          <div className="ml-auto">
            <Link
              href="/contact"
              className="bg-brand-orange text-white px-4 py-1.5 font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-colors inline-flex items-center gap-1.5"
            >
              ΕΓΓΡΑΦΗ <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Classes grid — grouped by year */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16 space-y-20">
        {sortedYears.map((year) => (
          <section key={year}>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gray-200" />
              <h2 className="text-xs font-black uppercase tracking-[0.25em] text-gray-400 px-4 border border-gray-200 py-2 bg-white">
                {YEAR_LABELS[year] ?? year}
              </h2>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {grouped[year].map((group) => (
                <ScheduleCard key={group._id} group={group} />
              ))}
            </div>
          </section>
        ))}

        {/* Bottom CTA */}
        <section className="bg-gray-900 p-10 md:p-16 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
            Δεν βρήκες το κατάλληλο τμήμα;
          </h2>
          <p className="text-gray-400 font-bold mb-8 text-lg max-w-xl mx-auto">
            Καλέσε μας και θα βρούμε μαζί τον καλύτερο τρόπο να καλύψουμε τις ανάγκες σου.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="bg-brand-orange text-white px-10 py-4 font-black uppercase tracking-widest text-sm hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
            >
              ΕΓΓΡΑΨΟΥ ΤΩΡΑ <ChevronRight size={16} />
            </Link>
            <a
              href="tel:2105063610"
              className="border-2 border-white text-white px-10 py-4 font-black uppercase tracking-widest text-sm hover:bg-white hover:text-gray-900 transition-colors"
            >
              210 506 3610
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
