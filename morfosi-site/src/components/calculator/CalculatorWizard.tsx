"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Award, BookOpen, Calculator, BarChart3, TrendingUp, CheckCircle2, RotateCcw, Download, Search, MapPin, Building2, Eye, X, Info, HelpCircle } from "lucide-react";
import { FACULTIES, Faculty } from "@/data/schoolsData";

// --- Types & Interfaces ---
type FieldId = 1 | 2 | 3 | 4 | null;

interface Subject {
  id: string;
  name: string;
  color: string;
}

interface FieldSettings {
  id: FieldId;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  subjects: Subject[];
}

// --- Data Definitions ---
const FIELDS: FieldSettings[] = [
  {
    id: 1,
    name: "1ο Πεδίο (Ανθρωπιστικών)",
    description: "Νομική, Ψυχολογία, Φιλολογία, Παιδαγωγικά κ.ά.",
    icon: BookOpen,
    color: "bg-amber-400",
    subjects: [
      { id: "s1", name: "Νεοελληνική Γλώσσα", color: "text-blue-700" },
      { id: "s2", name: "Αρχαία Ελληνικά", color: "text-amber-700" },
      { id: "s3", name: "Ιστορία", color: "text-red-600" },
      { id: "s4", name: "Λατινικά", color: "text-emerald-700" },
    ],
  },
  {
    id: 2,
    name: "2ο Πεδίο (Θετικών/Τεχνολογικών)",
    description: "Πολυτεχνείο, Φυσικό, Μαθηματικό, Χημικό κ.ά.",
    icon: Calculator,
    color: "bg-blue-400",
    subjects: [
      { id: "s1", name: "Νεοελληνική Γλώσσα", color: "text-blue-700" },
      { id: "s2", name: "Φυσική", color: "text-indigo-700" },
      { id: "s3", name: "Χημεία", color: "text-pink-600" },
      { id: "s4", name: "Μαθηματικά", color: "text-cyan-700" },
    ],
  },
  {
    id: 3,
    name: "3ο Πεδίο (Υγείας & Ζωής)",
    description: "Ιατρική, Οδοντιατρική, Φαρμακευτική, Νοσηλευτική κ.ά.",
    icon: Award,
    color: "bg-emerald-400",
    subjects: [
      { id: "s1", name: "Νεοελληνική Γλώσσα", color: "text-blue-700" },
      { id: "s2", name: "Φυσική", color: "text-indigo-700" },
      { id: "s3", name: "Χημεία", color: "text-pink-600" },
      { id: "s4", name: "Βιολογία", color: "text-emerald-600" },
    ],
  },
  {
    id: 4,
    name: "4ο Πεδίο (Οικονομίας/Πληρ.)",
    description: "Οικονομικά, Πληροφορική, Στρατιωτικές σχολές κ.ά.",
    icon: BarChart3,
    color: "bg-brand-orange",
    subjects: [
      { id: "s1", name: "Νεοελληνική Γλώσσα", color: "text-blue-700" },
      { id: "s2", name: "Μαθηματικά", color: "text-cyan-700" },
      { id: "s3", name: "Πληροφορική", color: "text-slate-800" },
      { id: "s4", name: "Α.Ο.Θ.", color: "text-yellow-700" },
    ],
  },
];

const SPECIAL_SUBJECTS = [
  { id: "sp1", name: "Αγγλικά", multiplier: 100, maxBonus: 2000, color: "bg-blue-500" },
  { id: "sp2", name: "Ελεύθερο Σχέδιο", multiplier: 100, maxBonus: 2000, color: "bg-stone-500" },
  { id: "sp3", name: "Γραμμικό Σχέδιο", multiplier: 100, maxBonus: 2000, color: "bg-stone-700" },
  { id: "sp4", name: "Αγωνίσματα (ΤΕΦΑΑ)", multiplier: 200, maxBonus: 4000, color: "bg-brand-orange" },
];

// --- Helpers ---
const parseGradeInput = (val: string): number => {
  if (!val) return 0;
  let sanitized = val.replace(/,/g, ".");
  const parsed = parseFloat(sanitized);
  if (isNaN(parsed)) return 0;
  if (parsed < 0) return 0;
  if (parsed > 20) return 20;
  return parsed;
};

const calculatePoints = (grades: { [key: string]: number }, fieldId: FieldId, specials: { [key: string]: number }) => {
  if (!fieldId) return { min: 0, avg: 0, max: 0 };
  
  const mainGrades = [grades['s1'] || 0, grades['s2'] || 0, grades['s3'] || 0, grades['s4'] || 0];
  const sumGrades = mainGrades.reduce((a, b) => a + b, 0);
  const avgPoints = sumGrades * 250; 

  const sortedGrades = [...mainGrades].sort((a, b) => b - a); 
  const maxBase = sortedGrades[0] * 400 + sortedGrades[1] * 200 + sortedGrades[2] * 200 + sortedGrades[3] * 200;
  const minBase = sortedGrades[3] * 400 + sortedGrades[2] * 200 + sortedGrades[1] * 200 + sortedGrades[0] * 200;

  let specialBonus = 0;
  SPECIAL_SUBJECTS.forEach((sp) => {
    if (specials[sp.id]) specialBonus += (specials[sp.id] * sp.multiplier);
  });

  return {
    min: Math.round(minBase + specialBonus),
    avg: Math.round(avgPoints + specialBonus),
    max: Math.round(maxBase + specialBonus)
  };
};

const calculateExactPointsForFaculty = (grades: { [key: string]: number }, specials: { [key: string]: number }, faculty: Faculty) => {
    let pts = 0;
    pts += (grades['s1'] || 0) * faculty.coeffs.s1;
    pts += (grades['s2'] || 0) * faculty.coeffs.s2;
    pts += (grades['s3'] || 0) * faculty.coeffs.s3;
    pts += (grades['s4'] || 0) * faculty.coeffs.s4;
    pts = pts * 1000;

    // Simulate special bonuses if requested by faculty (simplified)
    if (faculty.specialRequirements && faculty.specialRequirements.length > 0) {
        SPECIAL_SUBJECTS.forEach(sp => {
           if (faculty.specialRequirements?.includes(sp.name) && specials[sp.id]) {
               pts += specials[sp.id] * sp.multiplier;
           }
        });
    }

    return Math.round(pts);
}

// --- Custom Animated Components ---
const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; 
    const increment = value / (duration / 16); 
    
    const animate = () => {
      start += increment;
      if (start < value) {
        setDisplayValue(Math.floor(start));
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <span>{displayValue.toLocaleString('el-GR')}</span>;
};

// --- Main Component ---
export default function CalculatorWizard() {
  const [step, setStep] = useState(1);
  const [field, setField] = useState<FieldId>(null);
  
  const [gradeInputs, setGradeInputs] = useState<{ [key: string]: string }>({});
  const [specialInputs, setSpecialInputs] = useState<{ [key: string]: string }>({});
  
  const [grades, setGrades] = useState<{ [key: string]: number }>({});
  const [specials, setSpecials] = useState<{ [key: string]: number }>({});
  
  const [activeSpecials, setActiveSpecials] = useState<{ [key: string]: boolean }>({});

  // School Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyPass, setShowOnlyPass] = useState(false);

  const handleFieldSelect = (id: FieldId) => {
    setField(id);
    setGradeInputs({});
    setGrades({});
    setTimeout(() => setStep(2), 200); 
  };

  const handleGradeChange = (id: string, rawVal: string) => {
    let val = rawVal;
    const numericStr = rawVal.replace(/,/g, ".");
    const numericVal = parseFloat(numericStr);
    
    if (!isNaN(numericVal) && numericVal > 20) {
      val = "20";
    }
    
    setGradeInputs((prev) => ({ ...prev, [id]: val }));
    setGrades((prev) => ({ ...prev, [id]: parseGradeInput(val) }));
  };

  const handleSpecialToggle = (id: string) => {
    setActiveSpecials((prev) => {
        const next = { ...prev, [id]: !prev[id] };
        if (!next[id]) {
            setSpecialInputs((p) => ({...p, [id]: ""}));
            setSpecials((p) => ({...p, [id]: 0}));
        }
        return next;
    });
  };

  const handleSpecialChange = (id: string, rawVal: string) => {
    let val = rawVal;
    const numericStr = rawVal.replace(/,/g, ".");
    const numericVal = parseFloat(numericStr);
    
    if (!isNaN(numericVal) && numericVal > 20) {
      val = "20";
    }
    
    setSpecialInputs((prev) => ({ ...prev, [id]: val }));
    setSpecials((prev) => ({ ...prev, [id]: parseGradeInput(val) }));
  };

  const nextStep = () => {
    if (step === 2) {
      const activeField = FIELDS.find(f => f.id === field);
      let isValid = true;
      activeField?.subjects.forEach(s => {
          if (!grades[s.id] || grades[s.id] <= 0) isValid = false;
      });
      if (!isValid) {
          alert("Παρακαλώ συμπληρώστε έγκυρους βαθμούς σε όλα τα μαθήματα (πάνω από 0).");
          return;
      }
    }
    setStep(prev => prev + 1);
  };

  const currentFieldParams = FIELDS.find(f => f.id === field);
  const results = calculatePoints(grades, field, specials);

  // Derived faculties data for Step 5
  const processedFaculties = useMemo(() => {
     if (!field) return [];
     let list = FACULTIES.filter(f => f.fieldId === field);
     
     return list.map(f => {
         const personalPoints = calculateExactPointsForFaculty(grades, specials, f);
         const passed = personalPoints >= f.base2023;
         const diff = personalPoints - f.base2023;
         return { ...f, personalPoints, passed, diff };
     });
  }, [field, grades, specials]);

  const filteredFaculties = useMemo(() => {
     let list = [...processedFaculties];
     if (searchQuery.trim() !== "") {
         list = list.filter(f => 
             f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             f.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
             f.institution.toLowerCase().includes(searchQuery.toLowerCase())
         );
     }
     if (showOnlyPass) {
         list = list.filter(f => f.passed);
     }
     list.sort((a, b) => b.diff - a.diff);
     return list;
  }, [processedFaculties, searchQuery, showOnlyPass]);

  return (
    <div className="w-full min-h-[90vh] bg-brand-teal relative overflow-hidden font-sans pb-24">
      {/* Background Graphic Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
        style={{ 
          backgroundImage: "linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)", 
          backgroundSize: "60px 60px" 
        }} 
      />

      {/* Brutalist Progress Bar Header */}
      <div className="w-full bg-white border-b-[4px] border-gray-900 sticky top-0 z-40 shadow-[0_4px_0px_rgba(0,0,0,1)] flex items-center justify-between px-6 md:px-12 py-4">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black flex items-center justify-center text-white font-black text-lg">M</div>
            <h2 className="text-gray-900 font-black tracking-tighter text-xl md:text-2xl uppercase">
              ΥΠΟΛΟΓΙΣΤΗΣ <span className="text-brand-orange bg-black px-2 mt-1 inline-block">ΜΟΡΙΩΝ</span>
            </h2>
         </div>
         <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-black text-sm border-[3px] border-gray-900 transition-colors ${s === step ? 'bg-brand-orange text-white' : s < step ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'}`}>
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
              
              {/* Left Column: Instructions (Neo-Brutalist Card) */}
              <div className="w-full lg:w-1/3 bg-white border-[4px] border-gray-900 p-8 shadow-[12px_12px_0px_rgba(0,0,0,1)] transform lg:-rotate-1 hover:rotate-0 transition-transform">
                <div className="flex items-center gap-3 mb-6 bg-brand-orange p-3 border-[3px] border-gray-900 w-fit">
                   <HelpCircle className="text-gray-900" size={28} strokeWidth={3} />
                   <h2 className="font-black text-xl text-gray-900 uppercase">ΟΔΗΓΙΕΣ ΧΡΗΣΗΣ</h2>
                </div>
                <h1 className="text-5xl font-black text-gray-900 uppercase leading-[0.9] tracking-tighter mb-8">
                  ΠΟΣΑ ΜΟΡΙΑ <br /><span className="text-brand-teal">ΕΒΓΑΛΕΣ;</span>
                </h1>
                <p className="font-extrabold text-gray-600 mb-6 text-lg border-l-[4px] border-brand-orange pl-4">
                  1. Επίλεξε το επιστημονικό σου πεδίο.
                </p>
                <p className="font-extrabold text-gray-600 mb-6 text-lg border-l-[4px] border-brand-orange pl-4">
                  2. Καταχώρησε τους βαθμούς σου.
                </p>
                <p className="font-extrabold text-gray-600 text-lg border-l-[4px] border-brand-orange pl-4">
                  3. Σύγκρινε με τις περσινές βάσεις με τους σωστούς συντελεστές βαρύτητας ανά σχολή!
                </p>
                <div className="mt-12 bg-black text-brand-orange p-4 border-[3px] border-brand-orange font-black uppercase text-sm flex items-center justify-center gap-3 w-fit mx-auto lg:w-full">
                   <Info size={20} />
                   Βάσεις του 2023.
                </div>
              </div>

              {/* Right Column: Grid of Fields */}
              <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                 {FIELDS.map(f => {
                   const Icon = f.icon;
                   const isActive = field === f.id;
                   return (
                     <div 
                       key={f.id} 
                       onClick={() => handleFieldSelect(f.id)}
                       className={`cursor-pointer bg-white border-[4px] border-gray-900 p-6 flex flex-col justify-between transition-all duration-200 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:-translate-x-2 ${isActive ? 'bg-gray-100 outline outline-[4px] outline-brand-orange outline-offset-4' : ''}`}
                     >
                       <div className="flex justify-between items-start mb-6">
                           <div className={`w-16 h-16 border-[3px] border-gray-900 flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] ${f.color}`}>
                              <Icon size={32} className="text-gray-900" strokeWidth={3} />
                           </div>
                           <div className="text-gray-900 font-black text-5xl opacity-20">0{f.id}</div>
                       </div>
                       
                       <div>
                           <h3 className="text-2xl font-black text-gray-900 uppercase leading-none tracking-tight mb-4">{f.name}</h3>
                           <p className="text-gray-600 font-bold text-sm h-10 line-clamp-2">{f.description}</p>
                       </div>
                     </div>
                   )
                 })}
              </div>

            </motion.div>
          )}

          {/* STEP 2: GRADES INPUT */}
          {step === 2 && currentFieldParams && (
            <motion.div key="step2" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="w-full max-w-5xl mx-auto">
              
              <div className="bg-white border-[4px] border-gray-900 shadow-[12px_12px_0px_rgba(0,0,0,1)] p-8 md:p-12">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b-[4px] border-gray-900 pb-8">
                   <div>
                      <span className="bg-black text-white px-3 py-1 font-black text-xs uppercase tracking-widest block w-fit mb-4">ΒΗΜΑ 2</span>
                      <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                        ΒΑΘΜΟΛΟΓΙΕΣ <br/><span className="text-brand-orange bg-black px-2 mt-2 inline-block">{currentFieldParams.name.split(' ')[0]}</span>
                      </h2>
                   </div>
                   <button onClick={() => setStep(1)} className="bg-gray-200 border-[3px] border-gray-900 text-gray-900 p-4 font-black uppercase hover:bg-brand-orange hover:text-white transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 active:translate-x-1">
                     <RotateCcw size={24} strokeWidth={3} />
                   </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
                    {currentFieldParams.subjects.map((sub, i) => (
                        <div key={sub.id} className="relative bg-gray-50 border-[3px] border-gray-900 p-6 flex flex-col justify-between group focus-within:bg-white focus-within:border-brand-orange transition-colors">
                           <div className="absolute -top-4 -right-4 w-10 h-10 bg-black text-white font-black text-xl flex items-center justify-center border-[3px] border-gray-900 shadow-[4px_4px_0px_rgba(249,115,22,1)] z-10">
                              {i + 1}
                           </div>
                           
                           <h3 className={`text-2xl font-black uppercase tracking-tight mb-6 ${sub.color}`}>{sub.name}</h3>
                           
                           <div className="flex flex-col gap-2">
                             <label className="text-xs font-black tracking-widest uppercase text-gray-500">Εισαγωγή 0-20</label>
                             <div className="relative">
                               <input 
                                 type="text" 
                                 inputMode="decimal"
                                 placeholder=" π.χ. 18,5"
                                 value={gradeInputs[sub.id] || ''}
                                 onChange={(e) => handleGradeChange(sub.id, e.target.value)}
                                 className="w-full text-5xl font-black bg-white border-[4px] border-gray-900 py-4 px-4 text-gray-900 focus:outline-none focus:border-brand-orange transition-colors shadow-[6px_6px_0px_rgba(0,0,0,1)]"
                               />
                             </div>
                           </div>
                        </div>
                    ))}
                 </div>

                 <button onClick={nextStep} className="w-full bg-brand-orange border-[4px] border-gray-900 text-gray-900 py-6 font-black text-2xl uppercase tracking-widest shadow-[8px_8px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-4 hover:bg-yellow-400 hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all active:shadow-none active:translate-y-2 active:translate-x-2">
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
                      Αν διαγωνίζεσαι σε κάποιο ειδικό μάθημα, πάτησε το κουτί δίπλα στο μάθημα για να εισάγεις τον βαθμό σου. Αλλιώς, πάτα κατευθείαν "Υπολογισμός".
                    </p>

                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 text-left">
                       {SPECIAL_SUBJECTS.map((sp) => {
                          const isActive = activeSpecials[sp.id];
                          return (
                             <div key={sp.id} className={`p-6 border-[4px] transition-colors shadow-[6px_6px_0px_rgba(0,0,0,1)] ${isActive ? 'border-gray-900 bg-brand-orange text-gray-900' : 'border-gray-900 bg-gray-50'}`}>
                                <div className="flex justify-between items-center bg-white p-2 border-[3px] border-gray-900 relative">
                                  <h3 className="font-black text-lg md:text-xl uppercase tracking-tighter pl-2">{sp.name}</h3>
                                  
                                  <div onClick={() => handleSpecialToggle(sp.id)} className={`w-12 h-12 flex items-center justify-center border-[3px] border-gray-900 cursor-pointer transition-colors ${isActive ? 'bg-black text-white' : 'bg-gray-200 text-gray-400 hover:bg-gray-300'}`}>
                                     {isActive ? <CheckCircle2 strokeWidth={4} /> : <div className="w-4 h-4 bg-gray-400 rounded-none"></div>}
                                  </div>
                                </div>

                                <AnimatePresence>
                                  {isActive && (
                                     <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-6">
                                       <label className="text-xs font-black tracking-widest uppercase text-gray-900 block mb-2">Βάθμος (0-20)</label>
                                       <input 
                                          type="text" 
                                          inputMode="decimal"
                                          placeholder="16,5"
                                          value={specialInputs[sp.id] || ''}
                                          onChange={(e) => handleSpecialChange(sp.id, e.target.value)}
                                          className="w-full text-4xl font-black bg-white border-[4px] border-gray-900 py-3 px-4 text-gray-900 focus:outline-none"
                                        />
                                     </motion.div>
                                  )}
                                </AnimatePresence>
                             </div>
                          )
                       })}
                    </div>

                    <div className="flex flex-col md:flex-row w-full gap-6">
                      <button onClick={() => setStep(2)} className="bg-white border-[4px] border-gray-900 text-gray-900 py-6 px-8 font-black uppercase shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:shadow-none active:translate-y-1 active:translate-x-1 transition-all flex items-center justify-center gap-2 lg:w-1/3">
                        <RotateCcw strokeWidth={3} /> ΠΙΣΩ
                      </button>
                      <button onClick={nextStep} className="bg-black text-brand-orange border-[4px] border-gray-900 py-6 px-8 font-black uppercase text-2xl shadow-[8px_8px_0px_rgba(249,115,22,1)] hover:text-yellow-400 hover:shadow-[12px_12px_0px_rgba(249,115,22,1)] hover:-translate-y-1 hover:-translate-x-1 active:shadow-none active:translate-y-2 active:translate-x-2 transition-all flex items-center justify-center gap-4 lg:w-2/3">
                        ΥΠΟΛΟΓΙΣΜΟΣ <TrendingUp strokeWidth={4} size={32} />
                      </button>
                    </div>
                 </div>
             </motion.div>
          )}

          {/* STEP 4: DASHBOARD RESULTS */}
          {step === 4 && currentFieldParams && (
             <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full">
                
                <div className="flex flex-col xl:flex-row gap-12 w-full mb-16 items-stretch">
                   {/* Left Column: The Big Metrics */}
                   <div className="w-full xl:w-2/3 flex flex-col gap-8 h-full">
                       
                       <div className="bg-white border-[6px] border-gray-900 p-8 md:p-14 shadow-[16px_16px_0px_rgba(0,0,0,1)] relative flex flex-col justify-between h-full bg-[radial-gradient(#e5e7eb_2px,transparent_2px)] [background-size:20px_20px] isolate">
                          
                          <div className="relative z-10">
                             <div className="flex items-center justify-between mb-8 pb-4 border-b-[4px] border-gray-900 bg-white p-4 font-black">
                                <div className="flex items-center gap-3">
                                   <Award size={36} className="text-gray-900" strokeWidth={3} />
                                   <h3 className="tracking-widest uppercase text-gray-900 text-xl mt-1">ΑΠΟΤΕΛΕΣΜΑΤΑ</h3>
                                </div>
                                <div className="bg-brand-orange text-gray-900 font-black px-4 py-2 text-[10px] sm:text-sm uppercase items-center flex border-[3px] border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] transform rotate-2">
                                   {currentFieldParams.name}
                                </div>
                             </div>
                             
                             <div className="bg-white border-[4px] border-gray-900 p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)] mb-8">
                               <p className="text-sm font-black uppercase tracking-widest text-brand-orange mb-2 border-b-[2px] border-gray-200 pb-2 inline-block">ΜΕΓΙΣΤΑ ΔΥΝΑΤΑ ΜΟΡΙΑ</p>
                               <div className="text-7xl sm:text-[100px] md:text-[120px] font-black tracking-tighter leading-none text-gray-900 break-words">
                                  <AnimatedNumber value={results.max} />
                               </div>
                             </div>
                             
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                               <div className="bg-gray-100 border-[4px] border-gray-900 p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] transform -rotate-1">
                                  <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 block border-b-[2px] border-gray-300 pb-2">ΜΕΣΟΣ ΟΡΟΣ</p>
                                  <p className="text-4xl lg:text-5xl font-black text-gray-900"><AnimatedNumber value={results.avg} /></p>
                               </div>
                               <div className="bg-black border-[4px] border-gray-900 p-6 shadow-[6px_6px_0px_rgba(249,115,22,1)] text-white transform rotate-1">
                                  <p className="text-xs font-black uppercase tracking-widest text-brand-teal mb-2 block border-b-[2px] border-gray-700 pb-2">ΕΛΑΧΙΣΤΑ ΜΟΡΙΑ</p>
                                  <p className="text-4xl lg:text-5xl font-black text-white"><AnimatedNumber value={results.min} /></p>
                               </div>
                             </div>
                          </div>
                       </div>
                   </div>

                   {/* Right Column: Grades Summary */}
                   <div className="w-full xl:w-1/3 flex flex-col gap-6">
                       <div className="bg-white border-[6px] border-gray-900 p-8 shadow-[12px_12px_0px_rgba(0,0,0,1)] flex-1">
                           <h3 className="font-black text-2xl uppercase tracking-tighter text-gray-900 mb-8 border-b-[4px] border-gray-900 pb-4">
                             ΟΙ ΒΑΘΜΟΙ ΣΟΥ
                           </h3>
                           
                           <div className="w-full flex flex-col gap-6">
                              {currentFieldParams.subjects.map((sub) => (
                                 <div key={sub.id} className="flex justify-between items-center group">
                                    <span className={`font-black uppercase tracking-widest text-xs md:text-sm ${sub.color}`}>{sub.name}</span>
                                    <span className="font-black text-2xl text-white bg-gray-900 border-[3px] border-gray-900 px-4 py-1 flex items-center justify-center min-w-[75px] shadow-[4px_4px_0px_rgba(249,115,22,1)] group-hover:-translate-y-1 transition-transform">
                                      {grades[sub.id]?.toFixed(1) || '0.0'}
                                    </span>
                                 </div>
                              ))}
                              
                              {SPECIAL_SUBJECTS.filter(s => activeSpecials[s.id]).map(s => (
                                 <div key={s.id} className="flex justify-between items-center bg-brand-orange border-[4px] border-gray-900 p-4 mt-6 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                                    <span className="font-black uppercase text-sm text-gray-900">+ {s.name}</span>
                                    <span className="font-black text-2xl text-gray-900 bg-white border-[3px] border-gray-900 px-4 py-1 flex items-center justify-center min-w-[75px]">
                                      {specials[s.id]?.toFixed(1) || '0.0'}
                                    </span>
                                 </div>
                              ))}
                           </div>
                       </div>

                       {/* Action Buttons */}
                       <div className="grid grid-cols-2 gap-6">
                          <button onClick={() => window.print()} className="bg-yellow-400 border-[4px] border-gray-900 text-gray-900 py-4 font-black text-xs md:text-sm tracking-widest uppercase hover:bg-black hover:text-yellow-400 shadow-[6px_6px_0px_rgba(0,0,0,1)] active:shadow-none active:-translate-y-0 active:translate-x-1 transition-all flex flex-col items-center justify-center gap-2 h-28">
                             <Download size={28} strokeWidth={3} /> PDF
                          </button>
                          <button onClick={() => {setStep(1); setGrades({}); setGradeInputs({}); setSpecialInputs({}); setActiveSpecials({});}} className="bg-white border-[4px] border-gray-900 text-gray-900 py-4 font-black text-xs md:text-sm tracking-widest uppercase hover:bg-brand-orange shadow-[6px_6px_0px_rgba(0,0,0,1)] active:shadow-none active:-translate-y-0 active:translate-x-1 transition-all flex flex-col items-center justify-center gap-2 h-28">
                             <RotateCcw size={28} strokeWidth={3} /> ΝΕΟΣ<br/>ΥΠΟΛΟΓΙΣΜΟΣ
                          </button>
                       </div>
                   </div>
                </div>

                {/* THE MASSIVE CTA TO STEP 5 */}
                <div className="w-full bg-brand-orange border-[8px] border-gray-900 p-10 md:p-16 shadow-[16px_16px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row items-center justify-between gap-12 group transition-all hover:bg-yellow-400 cursor-pointer hover:-translate-y-2 hover:shadow-[24px_24px_0px_rgba(0,0,0,1)]" onClick={() => setStep(5)}>
                   <div className="flex-1 text-center lg:text-left">
                     <h2 className="text-5xl sm:text-6xl md:text-[80px] font-black text-gray-900 tracking-tighter uppercase mb-6 leading-none">
                       ΣΕ ΠΟΙΕΣ ΣΧΟΛΕΣ <br /><span className="bg-black text-white px-4 py-2 mt-2 inline-block border-[4px] border-gray-900 shadow-[6px_6px_0px_rgba(255,255,255,1)] transform -rotate-1 group-hover:rotate-1 transition-transform">ΠΕΡΝΑΩ;</span>
                     </h2>
                     <p className="text-gray-900 text-lg md:text-xl font-bold max-w-2xl bg-white border-[4px] border-gray-900 p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                       Το σύστημα επανυπολογίζει τα μόρια σου βάσει των ειδικών συντελεστών κάθε σχολής, και σε συγκρίνει με τις βάσεις του 2023. Δες τα αποτελέσματα!
                     </p>
                   </div>
                   <div className="flex-shrink-0 mt-8 lg:mt-0">
                     <button className="bg-black text-brand-orange group-hover:text-yellow-400 p-8 border-[4px] border-gray-900 shadow-[12px_12px_0px_rgba(255,255,255,1)] group-hover:shadow-[16px_16px_0px_rgba(255,255,255,1)] transition-all flex items-center justify-center w-32 h-32 md:w-48 md:h-48 group-active:translate-y-2 group-active:translate-x-2 group-active:shadow-none">
                         <ChevronRight size={100} strokeWidth={4} className="ml-4" />
                     </button>
                   </div>
                </div>

             </motion.div>
          )}

          {/* STEP 5: THE SCHOOLS DATABASE */}
          {step === 5 && (
             <motion.div key="step5" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="w-full bg-white border-[6px] border-gray-900 shadow-[20px_20px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col h-[85vh]">
                
                {/* Header Block */}
                <div className="bg-gray-900 border-b-[6px] border-gray-900 p-8 md:p-10 flex flex-col lg:flex-row justify-between items-center gap-6 shrink-0 relative z-20">
                   <div className="text-center lg:text-left">
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase mb-4">
                        ΒΑΣΗ ΣΧΟΛΩΝ <span className="text-black bg-brand-orange px-3 mt-2 lg:mt-0 inline-block border-[4px] border-black transform rotate-1">2023</span>
                      </h2>
                      <p className="text-white font-black text-sm md:text-base uppercase tracking-widest bg-brand-teal inline-block px-4 py-2 border-[3px] border-black shadow-[4px_4px_0px_rgba(255,255,255,1)]">
                        Βρέθηκαν {filteredFaculties.length} σχολές • {currentFieldParams?.name}
                      </p>
                   </div>
                   <button onClick={() => setStep(4)} className="bg-brand-orange text-gray-900 border-[4px] border-gray-900 px-6 py-4 font-black uppercase text-sm md:text-base shadow-[6px_6px_0px_rgba(255,255,255,1)] hover:bg-yellow-400 active:translate-y-1 active:translate-x-1 active:shadow-[2px_2px_0px_rgba(255,255,255,1)] flex items-center gap-2 transition-all">
                      <X size={24} strokeWidth={4} /> ΚΛΕΙΣΙΜΟ
                   </button>
                </div>

                {/* Filters Bar */}
                <div className="p-6 md:p-8 border-b-[6px] border-gray-900 bg-brand-teal flex flex-col xl:flex-row gap-6 shrink-0 z-10 shadow-sm relative">
                   
                   {/* Search Box */}
                   <div className="relative w-full xl:w-1/2">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-900 font-black">
                         <Search size={28} strokeWidth={4} />
                      </div>
                      <input 
                         type="text"
                         placeholder="ΑΝΑΖΗΤΗΣΗ ΣΧΟΛΗΣ Η ΠΟΛΗΣ..."
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="w-full pl-16 pr-6 py-6 bg-white border-[4px] border-gray-900 font-black text-gray-900 focus:outline-none focus:bg-yellow-100 transition-colors uppercase text-xl placeholder-gray-400 shadow-[6px_6px_0px_rgba(0,0,0,1)]"
                      />
                   </div>

                   {/* Filter Toggles */}
                   <div className="flex flex-col sm:flex-row gap-6 w-full xl:w-auto">
                      <button 
                         onClick={() => setShowOnlyPass(false)}
                         className={`flex-1 xl:flex-none px-8 py-5 border-[4px] border-gray-900 font-black uppercase text-sm md:text-base tracking-widest transition-all ${!showOnlyPass ? 'bg-black text-white shadow-[8px_8px_0px_rgba(249,115,22,1)]' : 'bg-white text-gray-900 hover:bg-gray-200 shadow-[6px_6px_0px_rgba(0,0,0,1)]'}`}
                      >
                         ΟΛΕΣ ΟΙ ΣΧΟΛΕΣ
                      </button>
                      <button 
                         onClick={() => setShowOnlyPass(true)}
                         className={`flex-1 xl:flex-none px-8 py-5 border-[4px] border-gray-900 font-black uppercase text-sm md:text-base tracking-widest transition-all ${showOnlyPass ? 'bg-emerald-500 text-gray-900 shadow-[8px_8px_0px_rgba(0,0,0,1)]' : 'bg-white text-emerald-600 hover:bg-emerald-50 shadow-[6px_6px_0px_rgba(0,0,0,1)]'}`}
                      >
                         ΜΟΝΟ ΟΣΕΣ ΠΕΡΝΑΩ
                      </button>
                   </div>
                </div>

                {/* The Huge List View */}
                <div className="p-6 md:p-10 bg-gray-100 flex-1 overflow-y-auto">
                   
                   {filteredFaculties.length === 0 ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                         <div className="w-32 h-32 border-[6px] border-gray-300 flex items-center justify-center mb-6 rotate-12 bg-white shadow-[8px_8px_0px_rgba(0,0,0,0.1)]">
                            <Search size={64} strokeWidth={4} className="text-gray-300" />
                         </div>
                         <h3 className="text-4xl font-black uppercase tracking-tight text-gray-400 mb-4 bg-white px-6 py-2 border-[4px] border-gray-300">ΑΔΕΙΟ</h3>
                         <p className="font-black text-xl text-center text-gray-500">Δεν βρέθηκαν σχολές με τα κριτήριά σου.</p>
                      </div>
                   ) : (
                      <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-12">
                         {filteredFaculties.map((faculty, idx) => (
                            <div 
                               key={faculty.id} 
                               className={`w-full bg-white border-[6px] border-gray-900 p-0 flex flex-col lg:flex-row transition-all shadow-[12px_12px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[16px_16px_0px_rgba(0,0,0,1)]`}
                            >
                               {/* Side Accent line */}
                               <div className={`w-full h-4 lg:w-6 lg:h-auto border-b-[6px] lg:border-b-0 lg:border-r-[6px] border-gray-900 shrink-0 ${faculty.passed ? 'bg-emerald-400' : 'bg-red-500'}`}></div>
                               
                               {/* School Info */}
                               <div className="flex-1 p-6 lg:p-10">
                                  <div className="mb-6 flex">
                                     <span className={`px-4 py-2 font-black text-xs md:text-sm uppercase tracking-widest border-[4px] border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] ${faculty.passed ? 'bg-emerald-400 text-black' : 'bg-red-500 text-white'}`}>
                                        {faculty.passed ? 'ΕΠΙΤΥΧΙΑ! ΜΠΑΙΝΕΙΣ.' : 'ΑΠΕΤΥΧΕΣ / ΘΕΛΕΙ ΠΡΟΣΠΑΘΕΙΑ'}
                                     </span>
                                  </div>
                                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight uppercase leading-none mb-8 font-sans">
                                     {faculty.name}
                                  </h3>
                                  <div className="flex flex-wrap gap-4 text-gray-900 font-black text-xs md:text-sm uppercase tracking-widest">
                                     <div className="flex items-center gap-3 bg-yellow-100 px-4 py-3 border-[4px] border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                                        <Building2 size={20} strokeWidth={3} /> {faculty.institution}
                                     </div>
                                     <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 border-[4px] border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                                        <MapPin size={20} strokeWidth={3} /> {faculty.city}
                                     </div>
                                  </div>
                               </div>

                               {/* Calculation Box */}
                               <div className="flex flex-col sm:flex-row items-stretch lg:min-w-[480px] border-t-[6px] lg:border-t-0 lg:border-l-[6px] border-gray-900 shrink-0 bg-white">
                                  
                                  {/* User points for this faculty */}
                                  <div className={`flex-1 flex flex-col justify-center p-6 lg:p-8 border-b-[6px] sm:border-b-0 sm:border-r-[6px] border-gray-900 ${faculty.passed ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                                     <span className="text-xs lg:text-sm bg-black text-white px-3 py-2 border-[2px] border-black inline-block font-black uppercase tracking-widest mb-6 w-fit shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">ΤΑ ΜΟΡΙΑ ΣΟΥ</span>
                                     <span className={`text-5xl lg:text-6xl font-black tracking-tighter drop-shadow-md ${faculty.passed ? 'text-emerald-700' : 'text-gray-900'}`}>
                                        {faculty.personalPoints.toLocaleString('el-GR')}
                                     </span>
                                     <span className={`text-sm lg:text-base font-black mt-4 inline-flex items-center uppercase ${faculty.passed ? 'text-emerald-700' : 'text-red-600'}`}>
                                        {faculty.diff >= 0 ? '+' : ''}{faculty.diff.toLocaleString('el-GR')} ΑΠΟ ΤΗ ΒΑΣΗ
                                     </span>
                                  </div>

                                  {/* Base 2023 */}
                                  <div className="flex-1 flex flex-col justify-center p-6 lg:p-8 bg-white relative group/info">
                                     <span className="text-xs lg:text-sm bg-gray-200 text-gray-500 px-3 py-2 border-[2px] border-gray-300 inline-block font-black uppercase tracking-widest mb-6 w-fit">ΒΑΣΗ 2023</span>
                                     <span className="text-4xl lg:text-5xl font-black tracking-tighter text-gray-400 line-through decoration-[4px] decoration-gray-900 opacity-70">
                                        {faculty.base2023.toLocaleString('el-GR')}
                                     </span>
                                     
                                     <div className="mt-6">
                                        <button className="bg-white border-[3px] border-gray-900 text-xs md:text-sm font-black uppercase py-2 px-4 hover:bg-brand-orange transition-colors cursor-help flex items-center gap-2 shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none">
                                           <Info size={18} strokeWidth={3} /> ΣΥΝΤΕΛΕΣΤΕΣ
                                        </button>
                                        <div className="absolute top-1/2 -left-4 sm:left-auto sm:right-[110%] -translate-y-1/2 w-72 bg-white border-[6px] border-gray-900 shadow-[12px_12px_0px_rgba(0,0,0,1)] p-6 opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all text-gray-900 z-50 rounded-none pointer-events-none">
                                            <div className="text-xs font-black uppercase tracking-widest text-brand-orange mb-4 border-b-[4px] border-gray-900 pb-3">ΒΑΡΥΤΗΤΕΣ ΜΑΘΗΜΑΤΩΝ</div>
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-sm font-black truncate pr-3">{currentFieldParams?.subjects[0].name.split(' ')[0]}</span> 
                                                <span className="font-black text-brand-teal text-lg">{(faculty.coeffs.s1 * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-sm font-black truncate pr-3">{currentFieldParams?.subjects[1].name.split(' ')[0]}</span> 
                                                <span className="font-black text-brand-teal text-lg">{(faculty.coeffs.s2 * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-sm font-black truncate pr-3">{currentFieldParams?.subjects[2].name.split(' ')[0]}</span> 
                                                <span className="font-black text-brand-teal text-lg">{(faculty.coeffs.s3 * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="flex justify-between items-center border-t-[3px] border-gray-200 pt-3 mt-3">
                                                <span className="text-sm font-black truncate pr-3">{currentFieldParams?.subjects[3].name.split(' ')[0]}</span> 
                                                <span className="font-black text-brand-teal text-lg">{(faculty.coeffs.s4 * 100).toFixed(0)}%</span>
                                            </div>
                                        </div>
                                     </div>
                                  </div>

                               </div>
                            </div>
                         ))}
                      </div>
                   )}
                </div>

             </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
