"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, Award, BookOpen, Calculator, BarChart3, TrendingUp,
  TrendingDown, CheckCircle2, RotateCcw, Search, MapPin, Building2,
  X, Info, HelpCircle, AlertTriangle, Loader2, Download
} from "lucide-react";

// ─────────────────────────────────────────────
//  DYNAMIC YEAR LOGIC
// ─────────────────────────────────────────────
const now = new Date();
const currentYear = now.getFullYear(); // 2026
const prevYear = currentYear - 1; // 2025

// --- Types ---
export interface Faculty {
  id: string;
  name: string;
  institution: string;
  city: string;
  fieldId: number;
  basePrev: number;
  ebe: number;
  coeffs: { s1: number; s2: number; s3: number; s4: number };
  specialRequirements: string[];
}

type FieldId = 1 | 2 | 3 | 4 | null;

interface Subject { id: string; name: string; color: string }
interface FieldSettings {
  id: FieldId; name: string; description: string;
  icon: React.ElementType; color: string; subjects: Subject[];
}

// --- Field Data ---
const FIELDS: FieldSettings[] = [
  {
    id: 1, name: "1ο Πεδίο (Ανθρωπιστικών)",
    description: "Νομική, Ψυχολογία, Φιλολογία, Παιδαγωγικά κ.ά.",
    icon: BookOpen, color: "bg-amber-400",
    subjects: [
      { id: "s1", name: "Νεοελληνική Γλώσσα", color: "text-blue-700" },
      { id: "s2", name: "Αρχαία Ελληνικά", color: "text-amber-700" },
      { id: "s3", name: "Ιστορία", color: "text-red-600" },
      { id: "s4", name: "Λατινικά", color: "text-emerald-700" },
    ],
  },
  {
    id: 2, name: "2ο Πεδίο (Θετικών/Τεχνολογικών)",
    description: "Πολυτεχνείο, Φυσικό, Μαθηματικό, Χημικό κ.ά.",
    icon: Calculator, color: "bg-blue-400",
    subjects: [
      { id: "s1", name: "Νεοελληνική Γλώσσα", color: "text-blue-700" },
      { id: "s2", name: "Φυσική", color: "text-indigo-700" },
      { id: "s3", name: "Χημεία", color: "text-pink-600" },
      { id: "s4", name: "Μαθηματικά", color: "text-cyan-700" },
    ],
  },
  {
    id: 3, name: "3ο Πεδίο (Υγείας & Ζωής)",
    description: "Ιατρική, Οδοντιατρική, Φαρμακευτική, Νοσηλευτική κ.ά.",
    icon: Award, color: "bg-emerald-400",
    subjects: [
      { id: "s1", name: "Νεοελληνική Γλώσσα", color: "text-blue-700" },
      { id: "s2", name: "Φυσική", color: "text-indigo-700" },
      { id: "s3", name: "Χημεία", color: "text-pink-600" },
      { id: "s4", name: "Βιολογία", color: "text-emerald-600" },
    ],
  },
  {
    id: 4, name: "4ο Πεδίο (Οικονομίας/Πληρ.)",
    description: "Οικονομικά, Πληροφορική, Στρατιωτικές σχολές κ.ά.",
    icon: BarChart3, color: "bg-brand-orange",
    subjects: [
      { id: "s1", name: "Νεοελληνική Γλώσσα", color: "text-blue-700" },
      { id: "s2", name: "Μαθηματικά", color: "text-cyan-700" },
      { id: "s3", name: "Πληροφορική", color: "text-slate-800" },
      { id: "s4", name: "Α.Ο.Θ.", color: "text-yellow-700" },
    ],
  },
];

const SPECIAL_SUBJECTS = [
  { id: "sp1", name: "Αγγλικά / Ξένη Γλώσσα", multiplier: 100, maxBonus: 2000, color: "bg-blue-500" },
  { id: "sp2", name: "Ελεύθερο Σχέδιο", multiplier: 100, maxBonus: 2000, color: "bg-stone-500" },
  { id: "sp3", name: "Γραμμικό Σχέδιο", multiplier: 100, maxBonus: 2000, color: "bg-stone-700" },
  { id: "sp4", name: "Αγωνίσματα (ΤΕΦΑΑ)", multiplier: 200, maxBonus: 4000, color: "bg-brand-orange" },
];

// --- Helpers ---
const parseGradeInput = (val: string): number => {
  if (!val) return 0;
  const parsed = parseFloat(val.replace(/,/g, "."));
  if (isNaN(parsed)) return 0;
  return Math.min(Math.max(parsed, 0), 20);
};

const calcPointsForFaculty = (
  grades: Record<string, number>,
  specials: Record<string, number>,
  faculty: Faculty
): number => {
  let pts =
    (grades.s1 || 0) * faculty.coeffs.s1 +
    (grades.s2 || 0) * faculty.coeffs.s2 +
    (grades.s3 || 0) * faculty.coeffs.s3 +
    (grades.s4 || 0) * faculty.coeffs.s4;
  pts *= 1000;

  SPECIAL_SUBJECTS.forEach((sp) => {
    if (specials[sp.id]) pts += specials[sp.id] * sp.multiplier;
  });
  return Math.round(pts);
};

const calcAvgPoints = (grades: Record<string, number>, specials: Record<string, number>): number => {
  const sum = (grades.s1 || 0) + (grades.s2 || 0) + (grades.s3 || 0) + (grades.s4 || 0);
  let bonus = 0;
  SPECIAL_SUBJECTS.forEach((sp) => { if (specials[sp.id]) bonus += specials[sp.id] * sp.multiplier; });
  return Math.round(sum * 250 + bonus);
};

// EBE badge
const EbeBadge = ({ grade, ebe, label }: { grade: number; ebe: number; label: string }) => {
  const ok = grade >= ebe;
  return (
    <div className={`flex items-center justify-between px-3 py-1.5 border-[2px] border-gray-900 text-xs font-black uppercase ${ok ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
      <span>{label}</span>
      <span>{ok ? `✓ ${grade.toFixed(1)} ≥ ${ebe}` : `✗ ${grade.toFixed(1)} < ${ebe}`}</span>
    </div>
  );
};

// --- Main Component ---
export default function CalculatorWizard({ contactPhone = "210 506 3610" }: { contactPhone?: string }) {
  const [step, setStep] = useState(1);
  const [field, setField] = useState<FieldId>(null);
  const [gradeInputs, setGradeInputs] = useState<Record<string, string>>({});
  const [grades, setGrades] = useState<Record<string, number>>({});
  const [specialInputs, setSpecialInputs] = useState<Record<string, string>>({});
  const [specials, setSpecials] = useState<Record<string, number>>({});
  const [activeSpecials, setActiveSpecials] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyPass, setShowOnlyPass] = useState(false);
  const [cityFilter, setCityFilter] = useState("all");

  // JSON data loading
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!field) return;
    const load = async () => {
      setLoading(true);
      setLoadError(false);
      setFaculties([]);
      try {
        const r = await fetch(`/data/bases-${prevYear}-field-${field}.json`);
        if (!r.ok) throw new Error();
        const data = await r.json();
        const mapped = data.map((d: Record<string, unknown>) => ({
          ...d,
          basePrev: d[`base${prevYear}`] || d.base2025 || 0
        }));
        setFaculties(mapped);
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [field]);

  const handleFieldSelect = (id: FieldId) => {
    setField(id);
    setGradeInputs({});
    setGrades({});
    setSpecials({});
    setSpecialInputs({});
    setActiveSpecials({});
    setTimeout(() => setStep(2), 200);
  };

  const handleGradeChange = (id: string, raw: string) => {
    let val = raw;
    const n = parseFloat(raw.replace(/,/g, "."));
    if (!isNaN(n) && n > 20) val = "20";
    setGradeInputs((p) => ({ ...p, [id]: val }));
    setGrades((p) => ({ ...p, [id]: parseGradeInput(val) }));
  };

  const handleSpecialToggle = (id: string) => {
    setActiveSpecials((p) => {
      const next = { ...p, [id]: !p[id] };
      if (!next[id]) {
        setSpecialInputs((x) => ({ ...x, [id]: "" }));
        setSpecials((x) => ({ ...x, [id]: 0 }));
      }
      return next;
    });
  };

  const handleSpecialChange = (id: string, raw: string) => {
    let val = raw;
    const n = parseFloat(raw.replace(/,/g, "."));
    if (!isNaN(n) && n > 20) val = "20";
    setSpecialInputs((p) => ({ ...p, [id]: val }));
    setSpecials((p) => ({ ...p, [id]: parseGradeInput(val) }));
  };

  const nextStep = () => {
    if (step === 2) {
      const activeField = FIELDS.find((f) => f.id === field);
      const invalid = activeField?.subjects.some((s) => !grades[s.id] || grades[s.id] <= 0);
      if (invalid) { alert("Παρακαλώ συμπληρώστε έγκυρους βαθμούς σε όλα τα μαθήματα (πάνω από 0)."); return; }
    }
    setStep((p) => p + 1);
  };

  const currentField = FIELDS.find((f) => f.id === field);
  const avgPoints = calcAvgPoints(grades, specials);

  // Processed faculties for Step 5
  const processed = useMemo(() => {
    if (!field || faculties.length === 0) return [];
    return faculties.map((f) => {
      const personalPoints = calcPointsForFaculty(grades, specials, f);
      const passed = personalPoints >= f.basePrev;
      const diff = personalPoints - f.basePrev;
      // EBE check: average of grades must meet EBE
      const avgGrade = ((grades.s1 || 0) + (grades.s2 || 0) + (grades.s3 || 0) + (grades.s4 || 0)) / 4;
      const ebeOk = f.ebe ? avgGrade >= f.ebe : true;
      return { ...f, personalPoints, passed, diff, ebeOk };
    });
  }, [field, faculties, grades, specials]);

  const cities = useMemo(() => {
    const set = new Set(processed.map((f) => f.city));
    return ["all", ...Array.from(set).sort()];
  }, [processed]);

  const passCount = processed.filter((f) => f.passed && f.ebeOk).length;
  const bestPass = processed.filter((f) => f.passed && f.ebeOk).sort((a, b) => b.basePrev - a.basePrev)[0];
  const closestSuccess = processed.filter((f) => f.passed && f.ebeOk).sort((a, b) => a.diff - b.diff)[0];

  const filtered = useMemo(() => {
    let list = [...processed];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((f) =>
        f.name.toLowerCase().includes(q) ||
        f.institution.toLowerCase().includes(q) ||
        f.city.toLowerCase().includes(q)
      );
    }
    if (showOnlyPass) list = list.filter((f) => f.passed && f.ebeOk);
    if (cityFilter !== "all") list = list.filter((f) => f.city === cityFilter);
    return list.sort((a, b) => b.basePrev - a.basePrev);
  }, [processed, searchQuery, showOnlyPass, cityFilter]);

  const resetAll = () => {
    setStep(1); setField(null); setGrades({}); setGradeInputs({});
    setSpecials({}); setSpecialInputs({}); setActiveSpecials({});
    setSearchQuery(""); setShowOnlyPass(false); setCityFilter("all");
  };

  const generatePDF = () => {
    const fieldName = currentField?.name || "";
    const passingSchools = filtered.filter(f => f.passed && f.ebeOk);

    const schoolRows = passingSchools.map(fac => {
      const status = fac.passed && fac.ebeOk
        ? `<span class="badge pass">✓ ΠΕΡΝΑΩ</span>`
        : `<span class="badge fail">✗ ΔΕΝ ΠΕΡΝΩ</span>`;
      const diffStr = fac.diff >= 0 ? `+${fac.diff.toLocaleString("el-GR")}` : fac.diff.toLocaleString("el-GR");
      return `
        <tr class="${fac.passed && fac.ebeOk ? "row-pass" : "row-fail"}">
          <td>${fac.name}</td>
          <td>${fac.institution}</td>
          <td class="num">${fac.basePrev.toLocaleString("el-GR")}</td>
          <td class="num bold ${fac.passed ? "green" : "red"}">${fac.personalPoints.toLocaleString("el-GR")}</td>
          <td class="num diff">${diffStr}</td>
          <td>${status}</td>
        </tr>`;
    }).join("");

    const html = `<!DOCTYPE html>
<html lang="el">
<head>
  <meta charset="UTF-8">
  <title>ΜΟΡΦΩΣΗ – Αποτελέσματα Μορίων</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', Arial, sans-serif; font-size: 11px; color: #111; background: #fff; position: relative; }

    /* WATERMARK */
    body::before {
      content: 'ΜΟΡΦΩΣΗ';
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-35deg);
      font-size: 120px;
      font-weight: 900;
      color: rgba(249,115,22,0.07);
      pointer-events: none;
      white-space: nowrap;
      z-index: 0;
      letter-spacing: -4px;
    }

    /* HEADER */
    .header { background: #f97316; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1; }
    .header-left h1 { font-size: 32px; font-weight: 900; color: #fff; letter-spacing: -1px; }
    .header-left p { font-size: 10px; color: rgba(255,255,255,0.85); margin-top: 4px; font-weight: 600; }
    .header-badge { background: #fff; padding: 10px 16px; text-align: center; border-left: 4px solid #000; }
    .header-badge .badge-title { font-size: 8px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: #666; }
    .header-badge .badge-sub { font-size: 12px; font-weight: 900; color: #111; }
    .black-bar { background: #000; height: 4px; }

    /* INFO BLOCK */
    .info-block { display: flex; gap: 0; margin: 16px 20px; border: 2px solid #111; position: relative; z-index: 1; }
    .info-left { flex: 1; padding: 14px 18px; border-right: 2px solid #111; }
    .info-label { font-size: 8px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 4px; }
    .info-value { font-size: 12px; font-weight: 700; color: #111; margin-bottom: 10px; }
    .grades-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 20px; }
    .grade-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding: 3px 0; }
    .grade-name { font-size: 9px; color: #555; }
    .grade-val { font-size: 13px; font-weight: 900; color: #111; }
    .info-right { background: #f97316; padding: 14px 20px; min-width: 140px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
    .total-label { font-size: 8px; font-weight: 900; color: rgba(255,255,255,0.85); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
    .total-value { font-size: 36px; font-weight: 900; color: #fff; line-height: 1; }
    .total-pass { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.9); margin-top: 6px; }

    /* SECTION TITLE */
    .section-title { margin: 16px 20px 8px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #888; border-bottom: 2px solid #f97316; padding-bottom: 4px; position: relative; z-index: 1; }

    /* TABLE */
    table { width: calc(100% - 40px); margin: 0 20px; border-collapse: collapse; font-size: 9.5px; position: relative; z-index: 1; }
    thead tr { background: #111; color: #fff; }
    thead th { padding: 6px 8px; text-align: left; font-weight: 900; font-size: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    tbody tr { border-bottom: 1px solid #e5e7eb; background: #f0fdf4; }
    tbody tr:nth-child(even) { background: #dcfce7; }
    td { padding: 5px 8px; vertical-align: middle; word-break: break-word; }
    .num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
    .bold { font-weight: 900; }
    .green { color: #166534; }
    .diff { font-weight: 700; color: #166534; }
    .badge { display: inline-block; padding: 2px 6px; font-size: 8px; font-weight: 900; border-radius: 2px; background: #15803d; color: #fff; }

    /* FOOTER */
    .footer { margin-top: 20px; background: #111; color: #fff; padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1; }
    .footer-left h2 { font-size: 18px; font-weight: 900; color: #f97316; }
    .footer-left p { font-size: 9px; color: #aaa; margin-top: 2px; }
    .footer-right { font-size: 9px; color: #aaa; text-align: right; }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      @page { margin: 8mm; size: A4; }
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="header-left">
      <h1>ΜΟΡΦΩΣΗ</h1>
      <p>ΦΡΟΝΤΙΣΤΗΡΙΟ &nbsp;|&nbsp; 210 506 3610 &nbsp;|&nbsp; morfosi.edu.gr</p>
    </div>
    <div class="header-badge">
      <div class="badge-title">Αποτελέσματα — Επιτυχόντες</div>
      <div class="badge-sub">Υπολογιστής Μορίων ${prevYear}</div>
    </div>
  </div>
  <div class="black-bar"></div>

  <div class="info-block">
    <div class="info-left">
      <div class="info-label">Επιστημονικό Πεδίο</div>
      <div class="info-value">${fieldName}</div>
      <div class="info-label">Βαθμολογίες</div>
      <div class="grades-grid">
        ${(currentField?.subjects || []).map(sub => `
          <div class="grade-row">
            <span class="grade-name">${sub.name}</span>
            <span class="grade-val">${(grades[sub.id] || 0).toFixed(1)}</span>
          </div>
        `).join("")}
      </div>
    </div>
    <div class="info-right">
      <div class="total-label">Μόρια (μέσος)</div>
      <div class="total-value">${avgPoints.toLocaleString("el-GR")}</div>
      <div class="total-pass">${passCount} σχολές — ΕΠΙΤΥΧΙΑ ✓</div>
    </div>
  </div>

  <div class="section-title">Σχολές που ΠΕΡΝΑΩ — Βάσεις 2025 (${passingSchools.length} σχολές)</div>

  <table>
    <thead>
      <tr>
        <th style="width:36%">Σχολή</th>
        <th style="width:20%">Ίδρυμα</th>
        <th style="width:8%;text-align:right">Βάση 2025</th>
        <th style="width:10%;text-align:right">Τα Μόριά σου</th>
        <th style="width:8%;text-align:right">+Διαφορά</th>
        <th style="width:10%">Αποτέλεσμα</th>
      </tr>
    </thead>
    <tbody>${schoolRows}</tbody>
  </table>

  <div class="footer">
    <div class="footer-left">
      <h2>ΜΟΡΦΩΣΗ</h2>
      <p>Θέλεις να βελτιώσεις τα μόριά σου; Κάλεσέ μας!</p>
    </div>
      210 506 3610<br>morfosi.edu.gr<br>Εκπαιδευτικός Οργανισμός
    </div>
  </div>

  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  return (
    <div className="w-full min-h-[90svh] bg-brand-teal relative overflow-hidden font-sans pb-24">
      {/* Grid bg */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)", backgroundSize: "60px 60px" }} />

      {/* Progress Header */}
      <div className="w-full bg-white border-b-[4px] border-gray-900 sticky top-0 z-40 shadow-[0_4px_0px_rgba(0,0,0,1)] flex items-center justify-between px-6 md:px-12 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-black text-lg">M</div>
          <h2 className="text-gray-900 font-black tracking-tighter text-xl md:text-2xl uppercase">
            ΥΠΟΛΟΓΙΣΤΗΣ <span className="text-brand-orange bg-black px-2 mt-1 inline-block">ΜΟΡΙΩΝ</span>
          </h2>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-black text-sm border-[3px] border-gray-900 transition-colors ${s === step ? "bg-brand-orange text-white" : s < step ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-500"}`}>
              {s < step ? <CheckCircle2 size={16} strokeWidth={4} /> : s}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-20">
        <AnimatePresence mode="wait">

          {/* STEP 1: SELECT FIELD */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="flex flex-col lg:flex-row gap-12 items-start justify-center">
              <div className="w-full lg:w-1/3 bg-white border-[4px] border-gray-900 p-8 shadow-[12px_12px_0px_rgba(0,0,0,1)] transform lg:-rotate-1 hover:rotate-0 transition-transform">
                <div className="flex items-center gap-3 mb-6 bg-brand-orange p-3 border-[3px] border-gray-900 w-fit">
                  <HelpCircle className="text-gray-900" size={28} strokeWidth={3} />
                  <div className="font-black text-xl text-gray-900 uppercase">ΟΔΗΓΙΕΣ ΧΡΗΣΗΣ</div>
                </div>
                <h1 className="text-5xl font-black text-gray-900 uppercase leading-[0.9] tracking-tighter mb-8">ΠΟΣΑ ΜΟΡΙΑ <br /><span className="text-brand-teal">ΕΒΓΑΛΕΣ;</span></h1>
                <p className="font-extrabold text-gray-600 mb-6 text-lg border-l-[4px] border-brand-orange pl-4">1. Επίλεξε το επιστημονικό σου πεδίο.</p>
                <p className="font-extrabold text-gray-600 mb-6 text-lg border-l-[4px] border-brand-orange pl-4">2. Καταχώρησε τους βαθμούς σου.</p>
                <p className="font-extrabold text-gray-600 text-lg border-l-[4px] border-brand-orange pl-4">3. Σύγκρινε με τις βάσεις εισαγωγής με τους σωστούς συντελεστές ανά σχολή!</p>
                <div className="mt-8 bg-emerald-500 text-white p-4 border-[3px] border-gray-900 font-black uppercase text-sm flex items-center justify-center gap-3 w-fit mx-auto lg:w-full">
                  <CheckCircle2 size={20} /> Βάσεις {prevYear} — 669 Σχολές
                </div>
              </div>
              <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                {FIELDS.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.id} onClick={() => handleFieldSelect(f.id)}
                      className="cursor-pointer bg-white border-[4px] border-gray-900 p-6 flex flex-col justify-between transition-all duration-200 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:-translate-x-2">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-16 h-16 border-[3px] border-gray-900 flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] ${f.color}`}>
                          <Icon size={32} className="text-gray-900" strokeWidth={3} />
                        </div>
                        <div className="text-gray-900 font-black text-5xl opacity-20">0{f.id}</div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase leading-none tracking-tight mb-4">{f.name}</h2>
                        <p className="text-gray-600 font-bold text-sm h-10 line-clamp-2">{f.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2: GRADES INPUT */}
          {step === 2 && currentField && (
            <motion.div key="step2" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="w-full max-w-5xl mx-auto">
              <div className="bg-white border-[4px] border-gray-900 shadow-[12px_12px_0px_rgba(0,0,0,1)] p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b-[4px] border-gray-900 pb-8">
                  <div>
                    <span className="bg-black text-white px-3 py-1 font-black text-xs uppercase tracking-widest block w-fit mb-4">ΒΗΜΑ 2</span>
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                      ΒΑΘΜΟΛΟΓΙΕΣ <br /><span className="text-brand-orange bg-black px-2 mt-2 inline-block">{currentField.name.split(" ")[0]}</span>
                    </h2>
                  </div>
                  <button onClick={() => setStep(1)} className="bg-gray-200 border-[3px] border-gray-900 text-gray-900 p-4 font-black uppercase hover:bg-brand-orange hover:text-white transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    <RotateCcw size={24} strokeWidth={3} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
                  {currentField.subjects.map((sub, i) => (
                    <div key={sub.id} className="relative bg-gray-50 border-[3px] border-gray-900 p-6 flex flex-col justify-between group focus-within:bg-white focus-within:border-brand-orange transition-colors">
                      <div className="absolute -top-4 -right-4 w-10 h-10 bg-black text-white font-black text-xl flex items-center justify-center border-[3px] border-gray-900 shadow-[4px_4px_0px_rgba(249,115,22,1)] z-10">{i + 1}</div>
                      <h3 className={`text-2xl font-black uppercase tracking-tight mb-6 ${sub.color}`}>{sub.name}</h3>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black tracking-widest uppercase text-gray-500">Εισαγωγή 0-20</label>
                        <input type="text" inputMode="decimal" placeholder="π.χ. 18,5"
                          value={gradeInputs[sub.id] || ""}
                          onChange={(e) => handleGradeChange(sub.id, e.target.value)}
                          className="w-full text-5xl font-black bg-white border-[4px] border-gray-900 py-4 px-4 text-gray-900 focus:outline-none focus:border-brand-orange transition-colors shadow-[6px_6px_0px_rgba(0,0,0,1)]" />
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={nextStep} className="w-full bg-brand-orange border-[4px] border-gray-900 text-gray-900 py-6 font-black text-2xl uppercase tracking-widest shadow-[8px_8px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-4 hover:bg-yellow-400 hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all">
                  ΣΥΝΕΧΕΙΑ <ChevronRight strokeWidth={4} size={32} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SPECIAL SUBJECTS */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="w-full max-w-4xl mx-auto">
              <div className="bg-white border-[4px] border-gray-900 shadow-[12px_12px_0px_rgba(0,0,0,1)] p-8 md:p-12 text-center flex flex-col items-center">
                <span className="bg-black text-white px-3 py-1 font-black text-xs uppercase tracking-widest block w-fit mb-6">ΒΗΜΑ 3 - ΠΡΟΑΙΡΕΤΙΚΟ</span>
                <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-none mb-6">
                  ΕΙΔΙΚΑ <span className="text-brand-orange bg-black px-3 mt-2 inline-block">ΜΑΘΗΜΑΤΑ</span>
                </h2>
                <p className="text-gray-600 font-extrabold mb-12 text-xl max-w-2xl border-[4px] border-gray-900 p-6 bg-yellow-100 shadow-[4px_4px_0px_rgba(0,0,0,1)] transform rotate-1">
                  Αν διαγωνίζεσαι σε κάποιο ειδικό μάθημα, πάτησε για να εισάγεις τον βαθμό σου. Αλλιώς, πάτα κατευθείαν &quot;Υπολογισμός&quot;.
                </p>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 text-left">
                  {SPECIAL_SUBJECTS.map((sp) => {
                    const isActive = activeSpecials[sp.id];
                    return (
                      <div key={sp.id} className={`p-6 border-[4px] transition-colors shadow-[6px_6px_0px_rgba(0,0,0,1)] ${isActive ? "border-gray-900 bg-brand-orange" : "border-gray-900 bg-gray-50"}`}>
                        <div className="flex justify-between items-center bg-white p-2 border-[3px] border-gray-900">
                          <h3 className="font-black text-lg uppercase tracking-tighter pl-2">{sp.name}</h3>
                          <div onClick={() => handleSpecialToggle(sp.id)} className={`w-12 h-12 flex items-center justify-center border-[3px] border-gray-900 cursor-pointer transition-colors ${isActive ? "bg-black text-white" : "bg-gray-200 hover:bg-gray-300"}`}>
                            {isActive ? <CheckCircle2 strokeWidth={4} /> : <div className="w-4 h-4 bg-gray-400" />}
                          </div>
                        </div>
                        <AnimatePresence>
                          {isActive && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-6">
                              <label className="text-xs font-black tracking-widest uppercase block mb-2">Βαθμός (0-20)</label>
                              <input type="text" inputMode="decimal" placeholder="16,5"
                                value={specialInputs[sp.id] || ""}
                                onChange={(e) => handleSpecialChange(sp.id, e.target.value)}
                                className="w-full text-4xl font-black bg-white border-[4px] border-gray-900 py-3 px-4 text-gray-900 focus:outline-none" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-col md:flex-row w-full gap-6">
                  <button onClick={() => setStep(2)} className="bg-white border-[4px] border-gray-900 text-gray-900 py-6 px-8 font-black uppercase shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:bg-gray-100 transition-all flex items-center justify-center gap-2 lg:w-1/3">
                    <RotateCcw strokeWidth={3} /> ΠΙΣΩ
                  </button>
                  <button onClick={nextStep} className="bg-black text-brand-orange border-[4px] border-gray-900 py-6 px-8 font-black uppercase text-2xl shadow-[8px_8px_0px_rgba(249,115,22,1)] hover:text-yellow-400 transition-all flex items-center justify-center gap-4 lg:w-2/3">
                    ΥΠΟΛΟΓΙΣΜΟΣ <TrendingUp strokeWidth={4} size={32} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: DASHBOARD */}
          {step === 4 && currentField && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full">

              {/* Loading overlay */}
              {loading && (
                <div className="w-full bg-white border-[4px] border-gray-900 p-16 shadow-[12px_12px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center gap-6">
                  <Loader2 size={64} className="animate-spin text-brand-orange" strokeWidth={3} />
                  <p className="font-black text-2xl uppercase">Φορτώνουμε τις σχολές...</p>
                </div>
              )}

              {!loading && (
                <>
                  {/* Quick Stats Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white border-[4px] border-gray-900 p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                      <p className="text-xs font-black uppercase tracking-widest mb-2 text-gray-900 opacity-70">ΜΕΣΟΣ ΥΠΟΛΟΓΙΣΜΟΣ</p>
                      <p className="font-black text-4xl leading-none text-gray-900">{avgPoints.toLocaleString("el-GR")}</p>
                    </div>
                    <div className="bg-emerald-400 border-[4px] border-gray-900 p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                      <p className="text-xs font-black uppercase tracking-widest mb-2 text-gray-900 opacity-70">ΣΧΟΛΕΣ ΠΟΥ ΠΕΡΝΑΣ</p>
                      <p className="font-black text-4xl leading-none text-gray-900">{passCount}</p>
                    </div>
                    <div className="bg-brand-orange border-[4px] border-gray-900 p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] col-span-2 lg:col-span-1">
                      <p className="text-xs font-black uppercase tracking-widest mb-2 text-gray-900 opacity-70">ΚΑΛΥΤΕΡΗ ΣΧΟΛΗ</p>
                      <p className="font-black text-sm leading-tight text-gray-900 break-words">{bestPass ? bestPass.name : "—"}</p>
                    </div>
                    <div className="bg-black border-[4px] border-gray-900 p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                      <p className="text-xs font-black uppercase tracking-widest mb-2 text-white opacity-70">ΚΟΝΤΙΝOΤΕΡΗ ΕΠΙΤΥΧΙΑ</p>
                      <p className="font-black text-4xl leading-none text-white">{closestSuccess ? `+${closestSuccess.diff.toLocaleString("el-GR")}` : "—"}</p>
                      {closestSuccess && <p className="text-xs text-gray-400 font-bold mt-1 uppercase">μόρια πάνω από τη βάση</p>}
                    </div>
                  </div>

                  {/* Grades summary + CTA */}
                  <div className="flex flex-col xl:flex-row gap-10 mb-12">
                    {/* Grades */}
                    <div className="w-full xl:w-1/3 bg-white border-[6px] border-gray-900 p-8 shadow-[12px_12px_0px_rgba(0,0,0,1)]">
                      <h3 className="font-black text-2xl uppercase tracking-tighter text-gray-900 mb-8 border-b-[4px] border-gray-900 pb-4">ΟΙ ΒΑΘΜΟΙ ΣΟΥ</h3>
                      <div className="flex flex-col gap-5">
                        {currentField.subjects.map((sub) => (
                          <div key={sub.id} className="flex justify-between items-center">
                            <span className={`font-black uppercase tracking-widest text-xs ${sub.color}`}>{sub.name}</span>
                            <span className="font-black text-2xl text-white bg-gray-900 border-[3px] border-gray-900 px-4 py-1 min-w-[75px] text-center shadow-[4px_4px_0px_rgba(249,115,22,1)]">
                              {grades[sub.id]?.toFixed(1) || "0.0"}
                            </span>
                          </div>
                        ))}
                        {SPECIAL_SUBJECTS.filter((s) => activeSpecials[s.id]).map((s) => (
                          <div key={s.id} className="flex justify-between items-center bg-brand-orange border-[4px] border-gray-900 p-3">
                            <span className="font-black uppercase text-xs">+ {s.name}</span>
                            <span className="font-black text-xl bg-white border-[3px] border-gray-900 px-3 py-1">{specials[s.id]?.toFixed(1) || "0.0"}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 grid grid-cols-2 gap-4">
                        <button onClick={resetAll} className="bg-white border-[3px] border-gray-900 text-gray-900 py-3 font-black text-xs tracking-widest uppercase hover:bg-brand-orange shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-2">
                          <RotateCcw size={20} strokeWidth={3} /> ΝΕΟΣ
                        </button>
                        <button onClick={() => setStep(2)} className="bg-gray-900 text-white border-[3px] border-gray-900 py-3 font-black text-xs tracking-widest uppercase hover:bg-gray-700 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-2">
                          <RotateCcw size={20} strokeWidth={3} /> ΑΛΛΑΓΗ
                        </button>
                      </div>
                      <button
                        onClick={generatePDF}
                        className="mt-4 w-full bg-emerald-500 border-[3px] border-gray-900 text-white py-4 font-black text-sm tracking-widest uppercase shadow-[6px_6px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-3 hover:bg-emerald-400 hover:-translate-y-1 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        <Download size={22} strokeWidth={3} /> ΚΑΤΕΒΑΣΕ PDF
                      </button>
                    </div>


                    {/* Big CTA */}
                    <div className="flex-1 flex flex-col gap-6">
                      <div className="w-full bg-brand-orange border-[8px] border-gray-900 p-10 md:p-14 shadow-[16px_16px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row items-center justify-between gap-10 group hover:bg-yellow-400 cursor-pointer hover:-translate-y-2 hover:shadow-[24px_24px_0px_rgba(0,0,0,1)] transition-all" onClick={() => setStep(5)}>
                        <div>
                          <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none mb-4">
                            ΣΕ ΠΟΙΕΣ ΣΧΟΛΕΣ <br />
                            <span className="bg-black text-white px-4 py-2 mt-2 inline-block border-[4px] border-gray-900">ΠΕΡΝΑΩ;</span>
                          </h2>
                          <p className="text-gray-900 font-bold text-lg bg-white border-[4px] border-gray-900 p-4 shadow-[6px_6px_0px_rgba(0,0,0,1)] max-w-xl">
                            Υπολογισμός με <strong>πραγματικούς συντελεστές βαρύτητας</strong> ανά σχολή. Βάσεις εισαγωγής <strong>{prevYear}</strong> — 669 σχολές.
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="bg-black text-brand-orange p-8 border-[4px] border-gray-900 shadow-[12px_12px_0px_rgba(255,255,255,1)] w-28 h-28 md:w-36 md:h-36 flex items-center justify-center">
                            <ChevronRight size={80} strokeWidth={4} />
                          </div>
                        </div>
                      </div>

                      {/* Funnel CTA */}
                      <div className="w-full bg-[#031516] border-[6px] border-gray-900 p-8 shadow-[12px_12px_0px_rgba(249,115,22,1)] flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                          <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-3">
                            ΘΕΛΕΙΣ ΝΑ <span className="text-brand-orange">ΒΕΛΤΙΩΣΕΙΣ</span><br />ΤΟ ΑΠΟΤΕΛΕΣΜΑ;
                          </h3>
                          <p className="text-gray-400 font-bold text-lg">Μίλα με τον σύμβουλο σπουδών μας. Σχεδιάζουμε μαζί σου στρατηγική βελτίωσης.</p>
                        </div>
                        <div className="flex flex-col gap-4 flex-shrink-0 w-full md:w-auto">
                          <a href="/contact" className="bg-brand-orange text-white px-8 py-4 font-black uppercase tracking-widest text-sm border-4 border-black shadow-[6px_6px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all text-center">
                            ΕΓΓΡΑΨΟΥ ΤΩΡΑ
                          </a>
                          <a href={`tel:${contactPhone.replace(/\s+/g, "")}`} className="bg-white text-gray-900 px-8 py-4 font-black uppercase tracking-widest text-sm border-4 border-black shadow-[6px_6px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all text-center">
                            📞 {contactPhone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* STEP 5: SCHOOLS DATABASE */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-white border-[6px] border-gray-900 shadow-[20px_20px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col" style={{ minHeight: "80svh" }}>

              {/* Header */}
              <div className="bg-gray-900 border-b-[6px] border-gray-900 p-6 md:p-8 flex flex-col lg:flex-row justify-between items-center gap-4 shrink-0">
                <div>
                  <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-2">
                    ΒΑΣΗ ΣΧΟΛΩΝ <span className="text-black bg-brand-orange px-2 inline-block border-[3px] border-black">{prevYear}</span>
                  </h2>
                  <p className="text-white font-black text-xs uppercase tracking-widest bg-brand-teal inline-block px-3 py-1.5 border-[3px] border-black">
                    {filtered.length} από {processed.length} σχολές • {currentField?.name}
                  </p>
                </div>
                <button onClick={() => setStep(4)} className="bg-brand-orange text-gray-900 border-[3px] border-gray-900 px-4 py-3 font-black uppercase text-sm shadow-[4px_4px_0px_rgba(255,255,255,1)] hover:bg-yellow-400 flex items-center gap-2">
                  <X size={20} strokeWidth={4} /> ΠΙΣΩ
                </button>
              </div>



              {/* Filters */}
              <div className="p-4 md:p-6 border-b-[4px] border-gray-900 bg-brand-teal flex flex-col xl:flex-row gap-4 shrink-0">
                {/* Search */}
                <div className="relative w-full xl:w-2/5">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900" strokeWidth={4} />
                  <input type="text" placeholder="ΑΝΑΖΗΤΗΣΗ ΣΧΟΛΗΣ, ΠΟΛΗΣ..."
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border-[3px] border-gray-900 font-black text-gray-900 focus:outline-none uppercase text-base shadow-[4px_4px_0px_rgba(0,0,0,1)]" />
                </div>

                {/* City filter */}
                <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}
                  className="flex-1 py-4 px-4 bg-white border-[3px] border-gray-900 font-black text-gray-900 uppercase focus:outline-none shadow-[4px_4px_0px_rgba(0,0,0,1)] cursor-pointer">
                  <option value="all">ΟΛΕΣ ΟΙ ΠΟΛΕΙΣ</option>
                  {cities.filter((c) => c !== "all").map((c) => <option key={c} value={c}>{c}</option>)}
                </select>

                {/* Pass filter */}
                <div className="flex gap-3">
                  <button onClick={() => setShowOnlyPass(false)} className={`flex-1 xl:flex-none px-6 py-4 border-[3px] border-gray-900 font-black uppercase text-xs tracking-widest transition-all ${!showOnlyPass ? "bg-black text-white shadow-[4px_4px_0px_rgba(249,115,22,1)]" : "bg-white text-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)]"}`}>ΟΛΕΣ</button>
                  <button onClick={() => setShowOnlyPass(true)} className={`flex-1 xl:flex-none px-6 py-4 border-[3px] border-gray-900 font-black uppercase text-xs tracking-widest transition-all ${showOnlyPass ? "bg-emerald-500 text-gray-900 shadow-[6px_6px_0px_rgba(0,0,0,1)]" : "bg-white text-emerald-600 shadow-[4px_4px_0px_rgba(0,0,0,1)]"}`}>
                    ΜΟΝΟ ΟΣΕΣ ΠΕΡΝΑΩ ({passCount})
                  </button>
                </div>
              </div>

              {/* Loading inside step 5 */}
              {loading && (
                <div className="flex-1 flex items-center justify-center p-16">
                  <div className="flex flex-col items-center gap-6">
                    <Loader2 size={64} className="animate-spin text-brand-orange" strokeWidth={3} />
                    <p className="font-black text-2xl uppercase">Φορτώνουμε 669 σχολές...</p>
                  </div>
                </div>
              )}

              {loadError && (
                <div className="flex-1 flex items-center justify-center p-16">
                  <div className="bg-red-100 border-[4px] border-red-500 p-8 text-center max-w-md">
                    <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                    <p className="font-black text-xl uppercase text-red-700">Σφάλμα φόρτωσης δεδομένων</p>
                    <p className="text-red-600 font-bold mt-2">Ελέγξτε σύνδεση ή reload</p>
                  </div>
                </div>
              )}

              {/* List */}
              {!loading && !loadError && (
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100">
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                      <Search size={48} strokeWidth={4} className="mb-4" />
                      <p className="font-black text-2xl uppercase">Δεν βρέθηκαν σχολές</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 max-w-7xl mx-auto pb-8">
                      {filtered.map((faculty) => {
                        const avgGrade = ((grades.s1 || 0) + (grades.s2 || 0) + (grades.s3 || 0) + (grades.s4 || 0)) / 4;
                        const ebeWarning = faculty.ebe && avgGrade < faculty.ebe;
                        const statusColor = faculty.passed && !ebeWarning ? "bg-emerald-400" : ebeWarning ? "bg-yellow-400" : "bg-red-500";
                        const statusText = faculty.passed && !ebeWarning ? "ΕΠΙΤΥΧΙΑ! ΜΠΑΙΝΕΙΣ." : ebeWarning ? "ΕΛΕΓΞΕ ΕΒΕ" : "ΑΠΑΙΤΕΙΤΑΙ ΠΡΟΣΠΑΘΕΙΑ";

                        return (
                          <div key={faculty.id} className="w-full bg-white border-[4px] border-gray-900 flex flex-col lg:flex-row shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-[2px] hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all">
                            {/* Color strip */}
                            <div className={`w-full h-3 lg:w-4 lg:h-auto border-b-[4px] lg:border-b-0 lg:border-r-[4px] border-gray-900 shrink-0 ${statusColor}`} />

                            {/* Info */}
                            <div className="flex-1 p-4 lg:p-5">
                              <div className="mb-2">
                                <span className={`px-2 py-1 font-black text-[10px] md:text-xs uppercase tracking-widest border-[2px] border-gray-900 ${faculty.passed && !ebeWarning ? "bg-emerald-400 text-black" : ebeWarning ? "bg-yellow-400 text-black" : "bg-red-500 text-white"}`}>
                                  {statusText}
                                </span>
                              </div>
                              <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase leading-none mb-3">{faculty.name}</h3>
                              <div className="flex flex-wrap gap-2">
                                <div className="flex items-center gap-1.5 bg-yellow-400 text-gray-900 px-2 py-1.5 border-[2px] border-gray-900 text-[10px] font-black uppercase">
                                  <Building2 size={14} strokeWidth={3} /> {faculty.institution}
                                </div>
                                <div className="flex items-center gap-1.5 bg-gray-900 text-white px-2 py-1.5 border-[2px] border-gray-900 text-[10px] font-black uppercase">
                                  <MapPin size={14} strokeWidth={3} /> {faculty.city}
                                </div>
                                {faculty.specialRequirements.length > 0 && (
                                  <div className="flex items-center gap-1.5 bg-indigo-600 text-white px-2 py-1.5 border-[2px] border-gray-900 text-[10px] font-black uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                                    <AlertTriangle size={14} strokeWidth={3} /> {faculty.specialRequirements.join(", ")}
                                  </div>
                                )}
                              </div>

                              {/* EBE indicator */}
                              {faculty.ebe && (
                                <div className="mt-3">
                                  <EbeBadge grade={avgGrade} ebe={faculty.ebe} label={`ΕΒΕ: ${faculty.ebe}`} />
                                </div>
                              )}
                            </div>

                            {/* Points Box */}
                            <div className="flex flex-col sm:flex-row lg:min-w-[360px] border-t-[4px] lg:border-t-0 lg:border-l-[4px] border-gray-900 shrink-0">
                              {/* User points */}
                              <div className={`flex-1 flex flex-col justify-center p-4 lg:p-5 border-b-[4px] sm:border-b-0 sm:border-r-[4px] border-gray-900 ${faculty.passed ? "bg-emerald-100" : "bg-gray-100"}`}>
                                <span className="text-[10px] bg-black text-white px-2 py-1 font-black uppercase tracking-widest mb-2 w-fit">ΤΑ ΜΟΡΙΑ ΣΟΥ</span>
                                <span className={`text-3xl lg:text-4xl font-black tracking-tighter ${faculty.passed ? "text-emerald-700" : "text-gray-900"}`}>
                                  {faculty.personalPoints.toLocaleString("el-GR")}
                                </span>
                                <span className={`text-xs font-bold mt-1 flex items-center gap-1 uppercase ${faculty.passed ? "text-emerald-700" : "text-red-600"}`}>
                                  {faculty.diff >= 0
                                    ? <><TrendingUp size={12} /> +{faculty.diff.toLocaleString("el-GR")} από τη βάση</>
                                    : <><TrendingDown size={12} /> {faculty.diff.toLocaleString("el-GR")} από τη βάση</>}
                                </span>
                              </div>

                              {/* Base Prev */}
                              <div className="flex-1 flex flex-col justify-center p-4 lg:p-5 bg-white relative group/info">
                                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 font-black uppercase tracking-widest mb-2 w-fit border-[2px] border-gray-200">ΒΑΣΗ {prevYear}</span>
                                <span className="text-2xl lg:text-3xl font-black text-gray-900">{faculty.basePrev.toLocaleString("el-GR")}</span>

                                {/* Coefficients tooltip */}
                                <button className="mt-2 bg-white border-[2px] border-gray-900 text-[10px] font-black uppercase py-1 px-2 hover:bg-brand-orange text-gray-900 transition-colors flex items-center gap-1 shadow-[2px_2px_0px_rgba(0,0,0,1)] w-fit">
                                  <Info size={12} strokeWidth={3} /> ΣΥΝΤΕΛΕΣΤΕΣ
                                </button>
                                <div className="absolute top-1/2 right-[105%] -translate-y-1/2 w-56 bg-white border-[4px] border-gray-900 shadow-[8px_8px_0px_rgba(0,0,0,1)] p-4 opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all z-50 pointer-events-none">
                                  <div className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-2 border-b-[2px] border-gray-900 pb-1">ΒΑΡΥΤΗΤΕΣ</div>
                                  {currentField?.subjects.map((sub, i) => {
                                    const key = `s${i + 1}` as keyof typeof faculty.coeffs;
                                    return (
                                      <div key={i} className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-black truncate pr-2">{sub.name.split(" ")[0]}</span>
                                        <span className="font-black text-brand-teal">{((faculty.coeffs[key] || 0.25) * 100).toFixed(0)}%</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
