// src/app/schedule/page.tsx  — Server Component (data fetching only)
import { client } from "@/sanity/client";
import ScheduleClient from "./ScheduleClient";

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

// ─── Demo data when Sanity is empty ────────────────────────────────────────────
const DEMO_CLASSES = [
  {
    _id: "demo-gym-a1",
    className: "ΓΑ1",
    schoolYear: "A_GYMNASIOU",
    trackType: "GENIKO",
    description: "Τμήμα Α΄ Γυμνασίου — μέγιστο 12 μαθητές",
    maxStudents: 12,
    currentStudents: 7,
    color: "#8e4585",
    isFull: false,
    schedule: [
      { day: "monday", startTime: "15:00", endTime: "17:00", subject: "Μαθηματικά", teacher: "Παπαδόπουλος Γ.", room: "Αίθουσα 1" },
      { day: "wednesday", startTime: "15:00", endTime: "17:00", subject: "Αρχαία Ελληνικά", teacher: "Κωνσταντίνου Μ.", room: "Αίθουσα 2" },
      { day: "friday", startTime: "15:00", endTime: "17:00", subject: "Αγγλικά", teacher: "Σμιθ Τ.", room: "Αίθουσα 3" },
    ],
  },
  {
    _id: "demo-gym-b1",
    className: "ΓΒ1",
    schoolYear: "B_GYMNASIOU",
    trackType: "GENIKO",
    description: "Τμήμα Β΄ Γυμνασίου — μέγιστο 12 μαθητές",
    maxStudents: 12,
    currentStudents: 9,
    color: "#00a651",
    isFull: false,
    schedule: [
      { day: "tuesday", startTime: "15:00", endTime: "17:00", subject: "Μαθηματικά", teacher: "Παπαδόπουλος Γ.", room: "Αίθουσα 1" },
      { day: "thursday", startTime: "15:00", endTime: "17:00", subject: "Φυσική", teacher: "Νικολάου Α.", room: "Αίθουσα 2" },
    ],
  },
  {
    _id: "demo-gym-c1",
    className: "ΓΓ1",
    schoolYear: "C_GYMNASIOU",
    trackType: "GENIKO",
    description: "Τμήμα Γ΄ Γυμνασίου — Προετοιμασία για Λύκειο",
    maxStudents: 10,
    currentStudents: 10,
    color: "#e31837",
    isFull: true,
    schedule: [
      { day: "monday", startTime: "17:00", endTime: "19:00", subject: "Μαθηματικά", teacher: "Παπαδόπουλος Γ.", room: "Αίθουσα 1" },
      { day: "wednesday", startTime: "17:00", endTime: "19:00", subject: "Έκθεση", teacher: "Κωνσταντίνου Μ.", room: "Αίθουσα 1" },
      { day: "friday", startTime: "17:00", endTime: "19:00", subject: "Αγγλικά", teacher: "Σμιθ Τ.", room: "Αίθουσα 3" },
    ],
  },
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

export const metadata = {
  title: "Πρόγραμμα Τμημάτων | Φροντιστήριο Μόρφωση",
  description:
    "Δείτε το εβδομαδιαίο πρόγραμμα τμημάτων Γυμνασίου και Λυκείου του Φροντιστηρίου Μόρφωση. Εγγραφείτε άμεσα.",
};

export default async function SchedulePage() {
  let classes: typeof DEMO_CLASSES = [];
  try {
    classes = await client.fetch(SCHEDULE_QUERY);
  } catch {
    classes = [];
  }

  const displayClasses = classes.length > 0 ? classes : DEMO_CLASSES;

  return <ScheduleClient displayClasses={displayClasses} />;
}
