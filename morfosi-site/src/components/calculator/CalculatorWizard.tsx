"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Award, BookOpen, Calculator, BarChart3, TrendingUp, CheckCircle2, RotateCcw, Download, Search, MapPin, Building2, Eye, X } from "lucide-react";
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
    color: "bg-amber-600",
    subjects: [
      { id: "s1", name: "Νεοελληνική Γλώσσα", color: "text-blue-600" },
      { id: "s2", name: "Αρχαία Ελληνικά", color: "text-amber-600" },
      { id: "s3", name: "Ιστορία", color: "text-red-500" },
      { id: "s4", name: "Λατινικά", color: "text-emerald-600" },
    ],
  },
  {
    id: 2,
    name: "2ο Πεδίο (Θετικών/Τεχνολογικών)",
    description: "Πολυτεχνείο, Φυσικό, Μαθηματικό, Χημικό κ.ά.",
    icon: Calculator,
    color: "bg-blue-600",
    subjects: [
      { id: "s1", name: "Νεοελληνική Γλώσσα", color: "text-blue-600" },
      { id: "s2", name: "Φυσική", color: "text-indigo-600" },
      { id: "s3", name: "Χημεία", color: "text-pink-500" },
      { id: "s4", name: "Μαθηματικά", color: "text-cyan-600" },
    ],
  },
  {
    id: 3,
    name: "3ο Πεδίο (Υγείας & Ζωής)",
    description: "Ιατρική, Οδοντιατρική, Φαρμακευτική, Νοσηλευτική κ.ά.",
    icon: Award,
    color: "bg-emerald-500",
    subjects: [
      { id: "s1", name: "Νεοελληνική Γλώσσα", color: "text-blue-600" },
      { id: "s2", name: "Φυσική", color: "text-indigo-600" },
      { id: "s3", name: "Χημεία", color: "text-pink-500" },
      { id: "s4", name: "Βιολογία", color: "text-emerald-500" },
    ],
  },
  {
    id: 4,
    name: "4ο Πεδίο (Οικονομίας/Πληρ.)",
    description: "Οικονομικά, Πληροφορική, Στρατιωτικές σχολές κ.ά.",
    icon: BarChart3,
    color: "bg-brand-orange",
    subjects: [
      { id: "s1", name: "Νεοελληνική Γλώσσα", color: "text-blue-600" },
      { id: "s2", name: "Μαθηματικά", color: "text-cyan-600" },
      { id: "s3", name: "Πληροφορική", color: "text-slate-700" },
      { id: "s4", name: "Α.Ο.Θ.", color: "text-yellow-600" },
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

// --- Animations ---
const slideUp = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  exit: { y: -40, opacity: 0, transition: { duration: 0.3 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

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
    setGradeInputs((prev) => ({ ...prev, [id]: rawVal }));
    setGrades((prev) => ({ ...prev, [id]: parseGradeInput(rawVal) }));
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
    setSpecialInputs((prev) => ({ ...prev, [id]: rawVal }));
    setSpecials((prev) => ({ ...prev, [id]: parseGradeInput(rawVal) }));
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
     
     // Calculate unique point logic per faculty for this user
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
     
     // Sort by points difference descending (closest or highest overload first)
     list.sort((a, b) => b.diff - a.diff);
     return list;
  }, [processedFaculties, searchQuery, showOnlyPass]);

  const renderRadarChart = () => {
     if (!currentFieldParams) return null;
     const maxVal = 20;
     const cx = 150;
     const cy = 150;
     const r = 100;
     
     const points = currentFieldParams.subjects.map((sub, i) => {
        const grade = grades[sub.id] || 0;
        const ratio = grade / maxVal;
        const angle = (Math.PI * 2 * i) / 4 - Math.PI / 2;
        const px = cx + Math.cos(angle) * (r * ratio);
        const py = cy + Math.sin(angle) * (r * ratio);
        return `${px},${py}`;
     }).join(' ');

     return (
        <svg width="300" height="300" className="mx-auto overflow-visible z-10">
           {/* Background webs */}
           <polygon points="150,50 250,150 150,250 50,150" fill="transparent" stroke="#e5e7eb" strokeWidth="1" />
           <polygon points="150,100 200,150 150,200 100,150" fill="transparent" stroke="#f3f4f6" strokeWidth="1" />
           <line x1="150" y1="50" x2="150" y2="250" stroke="#e5e7eb" strokeWidth="1" />
           <line x1="50" y1="150" x2="250" y2="150" stroke="#e5e7eb" strokeWidth="1" />
           {/* Data Polygon */}
           <motion.polygon 
             initial={{ opacity: 0, scale: 0.5 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, delay: 0.5 }}
             points={points} 
             fill="rgba(249, 115, 22, 0.4)" 
             stroke="#f97316" 
             strokeWidth="3" 
             strokeLinejoin="round" 
           />
           {/* Labels */}
           <text x="150" y="30" textAnchor="middle" fill="#6b7280" fontSize="12" fontWeight="bold">{currentFieldParams.subjects[0].name.split(' ')[0]}</text>
           <text x="270" y="155" textAnchor="start" fill="#6b7280" fontSize="12" fontWeight="bold">{currentFieldParams.subjects[1].name.substring(0, 7)}</text>
           <text x="150" y="270" textAnchor="middle" fill="#6b7280" fontSize="12" fontWeight="bold">{currentFieldParams.subjects[2].name.substring(0, 10)}</text>
           <text x="30" y="155" textAnchor="end" fill="#6b7280" fontSize="12" fontWeight="bold">{currentFieldParams.subjects[3].name.substring(0, 8)}</text>
        </svg>
     );
  }

  return (
    <div className="w-full bg-white relative overflow-hidden font-sans border-t border-gray-100">
      
      {/* Progress Bar Header */}
      <div className="w-full bg-gray-50 py-4 px-6 md:px-12 flex items-center justify-between border-b border-gray-200 sticky top-0 z-50">
         <div className="flex items-center gap-2">
            <Calculator className="text-brand-orange hidden md:block" size={24} />
            <h2 className="text-brand-teal-dark font-black tracking-tight text-xl uppercase">Υπολογιστης<span className="text-brand-orange">Μοριων</span></h2>
         </div>
         <div className="flex flex-wrap items-center justify-end gap-1 md:gap-4 font-black tracking-widest uppercase text-gray-400 text-[10px] md:text-sm">
            <span className={step >= 1 ? "text-brand-teal-dark" : ""}>ΠΕΔΙΟ</span>
            <ChevronRight size={14} />
            <span className={step >= 2 ? "text-brand-teal-dark" : ""}>ΒΑΘΜΟΙ</span>
            <ChevronRight size={14} />
            <span className={step >= 3 ? "text-brand-teal-dark" : ""}>ΕΞΤΡΑ</span>
            <ChevronRight size={14} />
            <span className={step >= 4 ? "text-brand-orange" : ""}>ΜΟΡΙΑ</span>
            {step === 5 && (
               <>
                 <ChevronRight size={14} />
                 <span className="text-emerald-600">ΣΧΟΛΕΣ</span>
               </>
            )}
         </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 min-h-[70vh]">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: SELECT FIELD */}
          {step === 1 && (
            <motion.div key="step1" variants={slideUp} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tighter uppercase mb-4 text-center">
                Το Μελλον Σου, <span className="text-brand-teal">Τα Μορια Σου.</span>
              </h1>
              <p className="text-gray-500 font-bold mb-16 text-center max-w-2xl px-4 text-lg">
                Επίλεξε το επιστημονικό πεδίο στο οποίο διαγωνίζεσαι για να υπολογίσουμε τα μόριά σου με ακρίβεια χιλιοστού, χρησιμοποιώντας τους νέους συντελεστές βαρύτητας.
              </p>
              
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                 {FIELDS.map(f => {
                   const Icon = f.icon;
                   const isActive = field === f.id;
                   return (
                     <motion.div 
                       key={f.id} 
                       whileHover={{ scale: 1.02, y: -5 }}
                       whileTap={{ scale: 0.98 }}
                       onClick={() => handleFieldSelect(f.id)}
                       className={`relative cursor-pointer group p-8 bg-white border-2 rounded-3xl shadow-xl transition-all ${isActive ? 'border-brand-orange shadow-brand-orange/20' : 'border-gray-100 hover:border-brand-teal hover:shadow-brand-teal/10'}`}
                     >
                       <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg ${f.color}`}>
                          <Icon size={40} />
                       </div>
                       <h3 className="text-3xl font-black text-gray-900 tracking-tight uppercase mb-3 group-hover:text-brand-teal transition-colors">{f.name}</h3>
                       <p className="text-gray-500 font-semibold text-base h-12">{f.description}</p>
                       
                       <div className="mt-8 flex gap-2 flex-wrap">
                          {f.subjects.map((sub, i) => (
                             <span key={i} className="text-[11px] font-black uppercase tracking-widest bg-gray-100 px-4 py-2 rounded-full text-gray-600">
                               {sub.name.split(' ')[0]}
                             </span>
                          ))}
                       </div>

                       {isActive && (
                         <div className="absolute top-8 right-8 text-brand-orange">
                           <CheckCircle2 size={36} />
                         </div>
                       )}
                     </motion.div>
                   )
                 })}
              </motion.div>
            </motion.div>
          )}

          {/* STEP 2: GRADES INPUT */}
          {step === 2 && currentFieldParams && (
            <motion.div key="step2" variants={slideUp} initial="hidden" animate="visible" exit="exit" className="w-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                   <span className="text-brand-orange font-black text-sm tracking-widest uppercase mb-2 block">ΒΗΜΑ 2: ΒΑΘΜΟΛΟΓΙΕΣ</span>
                   <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                     Γραπτα στο <span className="text-brand-teal">{currentFieldParams.name.split(' ')[0]}</span>
                   </h2>
                </div>
                <button onClick={() => setStep(1)} className="text-gray-400 hover:text-brand-orange font-bold uppercase tracking-widest text-xs flex items-center gap-1 transition-colors">
                  <RotateCcw size={14} /> Αλλαγη Πεδιου
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full mb-16">
                 {currentFieldParams.subjects.map((sub, i) => {
                   return (
                     <div key={sub.id} className="relative bg-white border border-gray-200 shadow-xl rounded-3xl p-6 md:p-8 hover:shadow-2xl hover:border-brand-teal/30 transition-all flex flex-col justify-between overflow-hidden group">
                        <div className="absolute -right-6 -top-12 text-[150px] font-black text-gray-50 opacity-50 z-0 select-none group-hover:scale-110 transition-transform duration-700">
                           {i + 1}
                        </div>
                        <div className="relative z-10">
                           <h3 className={`text-3xl font-black uppercase tracking-tight mb-8 ${sub.color}`}>{sub.name}</h3>
                           
                           <div className="flex flex-col gap-2">
                             <label className="text-xs font-black tracking-widest uppercase text-gray-400">Βαθμος Γραπτου (0-20)</label>
                             <div className="relative">
                               <input 
                                 type="text" 
                                 inputMode="decimal"
                                 placeholder="18,5"
                                 value={gradeInputs[sub.id] || ''}
                                 onChange={(e) => handleGradeChange(sub.id, e.target.value)}
                                 className="w-full text-5xl md:text-7xl font-black bg-gray-50 border-2 border-gray-200 rounded-2xl py-6 px-8 text-gray-900 focus:outline-none focus:border-brand-orange focus:bg-white transition-all shadow-inner placeholder-gray-300"
                               />
                               {grades[sub.id] > 0 && grades[sub.id] <= 20 && (
                                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-8 top-1/2 -translate-y-1/2 text-brand-teal">
                                    <CheckCircle2 size={40} />
                                 </motion.div>
                               )}
                             </div>
                             
                             <div className="mt-6 w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                <motion.div 
                                   className="h-full bg-brand-orange shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                                   initial={{ width: 0 }}
                                   animate={{ width: `${(grades[sub.id] || 0) * 5}%` }}
                                   transition={{ ease: "easeOut", duration: 0.3 }}
                                />
                             </div>
                           </div>
                        </div>
                     </div>
                   )
                 })}
              </div>

              <div className="flex justify-end w-full border-t border-gray-100 pt-8 relative z-20">
                <button onClick={nextStep} className="bg-brand-teal text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:bg-brand-teal-dark transition-all flex items-center gap-3 text-lg md:text-xl">
                  Συνεχεια <ChevronRight strokeWidth={3} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SPECIAL SUBJECTS (OPTIONAL) */}
          {step === 3 && (
             <motion.div key="step3" variants={slideUp} initial="hidden" animate="visible" exit="exit" className="w-full flex flex-col items-center max-w-5xl mx-auto text-center">
                 <span className="text-gray-400 font-black text-sm tracking-widest uppercase mb-4 block">ΒΗΜΑ 3: ΠΡΟΑΙΡΕΤΙΚΟ</span>
                 <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-tight mb-6">
                   Ειδικα <span className="text-brand-orange">Μαθηματα</span>
                 </h2>
                 <p className="text-gray-500 font-bold mb-12 text-lg max-w-3xl">
                   Διαγωνίζεσαι σε κάποιο επιπλέον ειδικό μάθημα; Ενεργοποίησέ το για να το συνυπολογίσουμε στις τελικές βάσεις!
                 </p>

                 <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16 text-left">
                    {SPECIAL_SUBJECTS.map((sp) => {
                       const isActive = activeSpecials[sp.id];
                       return (
                          <div key={sp.id} className={`p-8 rounded-3xl border-2 transition-all shadow-md ${isActive ? 'border-brand-teal bg-brand-teal/5 shadow-brand-teal/20' : 'border-gray-200 hover:border-gray-300'}`}>
                             <div className="flex justify-between items-center mb-6">
                               <h3 className="font-black text-2xl text-gray-900 uppercase tracking-tight">{sp.name}</h3>
                               
                               <div onClick={() => handleSpecialToggle(sp.id)} className={`w-16 h-10 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isActive ? 'bg-brand-teal' : 'bg-gray-300'}`}>
                                  <motion.div 
                                    className="bg-white w-8 h-8 rounded-full shadow-md"
                                    animate={{ x: isActive ? 24 : 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                  />
                               </div>
                             </div>

                             <AnimatePresence>
                               {isActive && (
                                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <label className="text-xs font-black tracking-widest uppercase text-gray-500 block mb-3 mt-4">Βάθμος (0-20)</label>
                                    <input 
                                       type="text" 
                                       inputMode="decimal"
                                       placeholder="16,5"
                                       value={specialInputs[sp.id] || ''}
                                       onChange={(e) => handleSpecialChange(sp.id, e.target.value)}
                                       className="w-full text-4xl font-black bg-white border-2 border-brand-teal/30 rounded-2xl py-4 px-6 text-brand-teal-dark focus:outline-none focus:border-brand-teal transition-all shadow-inner placeholder-brand-teal/20"
                                     />
                                  </motion.div>
                               )}
                             </AnimatePresence>
                          </div>
                       )
                    })}
                 </div>

                 <div className="flex flex-col md:flex-row justify-between w-full border-t border-gray-200 pt-10 gap-6 mt-12">
                   <button onClick={() => setStep(2)} className="text-gray-500 font-black uppercase tracking-widest hover:text-gray-900 transition-colors py-4 px-8 rounded-2xl border-2 border-transparent hover:border-gray-200 flex items-center gap-2">
                     <RotateCcw size={18} /> ΠΙΣΩ ΣΤΟΥΣ ΒΑΘΜΟΥΣ
                   </button>
                   <button onClick={nextStep} className="bg-gray-900 text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:-translate-y-2 hover:shadow-brand-orange/30 hover:bg-brand-orange transition-all flex items-center justify-center gap-4 text-lg">
                     ΥΠΟΛΟΓΙΣΜΟΣ ΜΟΡΙΩΝ <TrendingUp size={24} />
                   </button>
                 </div>
             </motion.div>
          )}

          {/* STEP 4: DASHBOARD RESULTS */}
          {step === 4 && currentFieldParams && (
             <motion.div key="step4" variants={slideUp} initial="hidden" animate="visible" className="w-full">
                
                <div className="flex flex-col lg:flex-row gap-12 w-full mb-16">
                   {/* Left Column: The Big Metrics */}
                   <div className="w-full lg:w-3/5 flex flex-col gap-8">
                       
                       <div className="bg-brand-teal-dark text-white rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden group border-4 border-brand-teal/20">
                          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-teal blur-3xl opacity-20 rounded-full translate-x-1/3 -translate-y-1/3 group-hover:scale-125 transition-transform duration-1000"></div>
                          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-orange blur-3xl opacity-20 rounded-full -translate-x-1/3 translate-y-1/3 group-hover:scale-125 transition-transform duration-1000"></div>
                          
                          <div className="relative z-10">
                             <div className="flex items-center gap-3 mb-6 opacity-90 border-b border-brand-teal/30 pb-4 inline-flex">
                                <Award size={28} className="text-brand-orange" />
                                <span className="font-black tracking-widest uppercase md:text-lg">ΜΕΓΙΣΤΑ ΠΙΘΑΝΑ ΜΟΡΙΑ</span>
                             </div>
                             
                             <div className="text-7xl md:text-[140px] font-black tracking-tighter leading-none mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-brand-teal">
                                <AnimatedNumber value={results.max} />
                             </div>
                             
                             <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-8 justify-between">
                               <div>
                                  <p className="text-xs font-black uppercase tracking-widest text-brand-orange mb-2">ΜΕΣΟΣ ΟΡΟΣ ΠΑΝΕΛΛΑΔΙΚΑ</p>
                                  <p className="text-4xl md:text-5xl font-black"><AnimatedNumber value={results.avg} /></p>
                               </div>
                               <div>
                                  <p className="text-xs font-black uppercase tracking-widest text-brand-teal mb-2">ΕΛΑΧΙΣΤΑ (ΧΕΙΡΟΤΕΡΟ ΣΕΝΑΡΙΟ)</p>
                                  <p className="text-4xl md:text-5xl font-black text-brand-teal/80"><AnimatedNumber value={results.min} /></p>
                               </div>
                             </div>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-6">
                          <button onClick={() => window.print()} className="bg-white border-2 border-gray-200 text-gray-900 py-6 rounded-3xl font-black tracking-widest uppercase hover:border-brand-teal hover:text-brand-teal hover:shadow-xl transition-all flex items-center justify-center gap-3">
                             <Download size={20} /> ΑΠΟΘΗΚΕΥΣΗ PDF
                          </button>
                          <button onClick={() => {setStep(1); setGrades({}); setGradeInputs({}); setSpecialInputs({}); setActiveSpecials({});}} className="bg-white border-2 border-gray-200 text-gray-900 py-6 rounded-3xl font-black tracking-widest uppercase hover:border-brand-orange hover:text-brand-orange hover:shadow-xl transition-all flex items-center justify-center gap-3">
                             <RotateCcw size={20} /> ΝΕΟΣ ΥΠΟΛΟΓΙΣΜΟΣ
                          </button>
                       </div>
                   </div>

                   {/* Right Column: Radar Chart & Grades */}
                   <div className="w-full lg:w-2/5 bg-gray-50 rounded-[2.5rem] p-8 md:p-10 flex flex-col items-center border border-gray-100 shadow-lg relative overflow-hidden">
                       <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-brand-orange to-brand-teal"></div>
                       <h3 className="font-black text-2xl uppercase tracking-tighter text-gray-900 mb-10 w-full text-left border-b-2 border-gray-200 pb-6 border-dashed">
                         ΤΟ ΠΡΟΦΙΛ ΣΟΥ
                       </h3>

                       <div className="relative w-full flex justify-center mb-16">
                          {renderRadarChart()}
                       </div>

                       <div className="w-full flex flex-col gap-5 mt-auto">
                          {currentFieldParams.subjects.map((sub) => (
                             <div key={sub.id} className="flex justify-between items-center border-b border-gray-200 pb-3">
                                <span className={`font-black uppercase tracking-wider text-sm ${sub.color}`}>{sub.name}</span>
                                <span className="font-black text-3xl text-gray-900 bg-white px-4 py-1 rounded-xl shadow-sm border border-gray-100">
                                  {grades[sub.id]?.toFixed(1) || '0.0'}
                                </span>
                             </div>
                          ))}
                          
                          {SPECIAL_SUBJECTS.filter(s => activeSpecials[s.id]).map(s => (
                             <div key={s.id} className="flex justify-between items-center border-b border-brand-orange/20 pb-3 mt-4 bg-brand-orange/10 p-4 rounded-2xl">
                                <span className="font-black uppercase text-sm text-brand-orange">+ {s.name}</span>
                                <span className="font-black text-3xl text-brand-orange bg-white px-4 py-1 rounded-xl shadow-sm">
                                  {specials[s.id]?.toFixed(1) || '0.0'}
                                </span>
                             </div>
                          ))}
                       </div>
                   </div>
                </div>

                {/* THE MASSIVE CTA TO STEP 5 */}
                <div className="w-full bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-12 md:p-20 text-center shadow-2xl shadow-brand-orange/10 border border-gray-800 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-orange/20 via-transparent to-transparent opacity-50"></div>
                   
                   <div className="relative z-10 flex flex-col items-center">
                     <Award size={64} className="text-brand-orange mb-8 group-hover:scale-110 transition-transform duration-500" />
                     <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-6 drop-shadow-lg">
                       Που Περνάω;
                     </h2>
                     <p className="text-gray-400 text-lg md:text-xl font-bold max-w-3xl mb-12">
                       Το σύστημα έχει επανυπολογίσει αυτόματα τα μόριά σου βάσει των ειδικών συντελεστών βαρύτητας κάθε σχολής. Συγκρίνουμε τις επιδόσεις σου με τις βάσεις του 2023 για να δεις σε ποιες σχολές έχεις ελπίδα εισαγωγής.
                     </p>
                     <button onClick={() => setStep(5)} className="bg-brand-orange text-white px-16 py-8 rounded-[2rem] font-black uppercase tracking-widest shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:-translate-y-2 hover:shadow-[0_0_60px_rgba(249,115,22,0.6)] transition-all flex items-center justify-center gap-4 text-2xl group-hover:bg-orange-500">
                       <Eye size={32} /> ΔΕΣ ΟΛΕΣ ΤΙΣ ΣΧΟΛΕΣ ΣΟΥ
                     </button>
                   </div>
                </div>

             </motion.div>
          )}

          {/* STEP 5: THE SCHOOLS DATABASE (MASSIVE COMPONENT) */}
          {step === 5 && (
             <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }} className="w-full bg-white rounded-[3rem] shadow-2xl border-2 border-gray-100 overflow-hidden relative">
                
                {/* Dashboard Header */}
                <div className="bg-brand-teal-dark p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
                   <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-brand-teal/40 via-transparent to-transparent"></div>
                   <div className="relative z-10">
                      <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-2">
                        Βαση Σχολων <span className="text-brand-orange">2023-2024</span>
                      </h2>
                      <p className="text-brand-teal-light font-bold text-lg">Βρέθηκαν {filteredFaculties.length} σχολές στο πεδίο σου, υπολογισμένες ακριβώς στα δικά σου μέτρα.</p>
                   </div>
                   <button onClick={() => setStep(4)} className="relative z-10 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md transition-all self-start md:self-center">
                      <X size={32} />
                   </button>
                </div>

                {/* Filters Bar */}
                <div className="p-8 md:p-10 border-b-2 border-gray-100 bg-gray-50 flex flex-col xl:flex-row gap-6 justify-between items-center z-20 relative">
                   
                   {/* Search Box */}
                   <div className="relative w-full xl:w-1/2">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                         <Search size={24} />
                      </div>
                      <input 
                         type="text"
                         placeholder="Αναζήτηση σχολής, ιδρύματος ή πόλης..."
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="w-full pl-16 pr-6 py-6 bg-white border-2 border-gray-200 rounded-2xl font-bold text-gray-900 focus:outline-none focus:border-brand-teal shadow-inner text-lg transition-all"
                      />
                   </div>

                   {/* Filter Toggles */}
                   <div className="flex gap-4 w-full xl:w-auto">
                      <button 
                         onClick={() => setShowOnlyPass(false)}
                         className={`flex-1 xl:flex-none px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all border-2 ${!showOnlyPass ? 'bg-gray-900 text-white border-gray-900 shadow-xl' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                      >
                         ΟΛΕΣ ΟΙ ΣΧΟΛΕΣ
                      </button>
                      <button 
                         onClick={() => setShowOnlyPass(true)}
                         className={`flex-1 xl:flex-none px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all border-2 flex items-center justify-center gap-2 ${showOnlyPass ? 'bg-emerald-500 text-white border-emerald-500 shadow-xl shadow-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:border-emerald-300'}`}
                      >
                         <CheckCircle2 size={18} className={showOnlyPass ? 'text-white' : 'text-emerald-500'} /> ΜΟΝΟ ΟΣΕΣ ΠΕΡΝΑΩ
                      </button>
                   </div>
                </div>

                {/* The Huge List View */}
                <div className="p-6 md:p-10 bg-gray-100/50 min-h-[60vh] max-h-[1000px] overflow-y-auto">
                   
                   {filteredFaculties.length === 0 ? (
                      <div className="w-full py-20 flex flex-col items-center justify-center text-gray-400">
                         <Search size={64} className="mb-6 opacity-50" />
                         <h3 className="text-3xl font-black uppercase tracking-tight text-gray-500 mb-2">ΔΕΝ ΒΡΕΘΗΚΑΝ ΣΧΟΛΕΣ</h3>
                         <p className="font-bold text-lg text-center">Δοκίμασε να αλλάξεις τους όρους αναζήτησης ή τα φίλτρα σου.</p>
                      </div>
                   ) : (
                      <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
                         {filteredFaculties.map((faculty, idx) => (
                            <motion.div 
                               initial={{ opacity: 0, y: 20 }}
                               animate={{ opacity: 1, y: 0 }}
                               transition={{ delay: idx * 0.05 }}
                               key={faculty.id} 
                               className={`w-full bg-white rounded-3xl p-6 md:p-8 border-l-[12px] shadow-lg flex flex-col lg:flex-row justify-between gap-8 transition-all hover:shadow-2xl hover:-translate-y-1 ${faculty.passed ? 'border-emerald-500' : 'border-red-500/80 hover:border-red-500'}`}
                            >
                               {/* School Info */}
                               <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-4">
                                     <span className={`px-4 py-1 rounded-lg font-black text-xs uppercase tracking-widest ${faculty.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                        {faculty.passed ? 'ΣΥΓΧΑΡΗΤΗΡΙΑ! ΠΕΡΝΑΣ.' : 'ΘΕΛΕΙΣ ΛΙΓΗ ΠΡΟΣΠΑΘΕΙΑ ΑΚΟΜΑ'}
                                     </span>
                                  </div>
                                  <h3 className="text-3xl font-black text-gray-900 tracking-tight uppercase leading-none mb-4">
                                     {faculty.name}
                                  </h3>
                                  <div className="flex flex-wrap gap-4 text-gray-500 font-bold text-sm">
                                     <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                                        <Building2 size={16} /> {faculty.institution}
                                     </div>
                                     <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-lg">
                                        <MapPin size={16} /> {faculty.city}
                                     </div>
                                  </div>
                               </div>

                               {/* Calculation Box */}
                               <div className="flex flex-col sm:flex-row gap-6 lg:gap-12 lg:items-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                  
                                  {/* User points for this faculty */}
                                  <div className="flex flex-col">
                                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">ΤΑ ΜΟΡΙΑ ΣΟΥ (ΣΤΗ ΣΧΟΛΗ ΕΔΩ)</span>
                                     <span className={`text-4xl font-black tracking-tighter ${faculty.passed ? 'text-emerald-500' : 'text-gray-900'}`}>
                                        {faculty.personalPoints.toLocaleString('el-GR')}
                                     </span>
                                     <span className={`text-sm font-black mt-2 inline-flex items-center gap-1 ${faculty.passed ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {faculty.diff >= 0 ? '+' : ''}{faculty.diff.toLocaleString('el-GR')} μόρια από τη βάση
                                     </span>
                                  </div>

                                  {/* Base 2023 */}
                                  <div className="flex flex-col border-l-2 border-gray-200 pl-6 lg:pl-12">
                                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">ΠΕΡΣΙΝΗ ΒΑΣΗ (2023)</span>
                                     <span className="text-3xl font-black tracking-tighter text-gray-400">
                                        {faculty.base2023.toLocaleString('el-GR')}
                                     </span>
                                     <div className="relative group self-start mt-2">
                                        <button className="text-xs font-bold uppercase text-brand-teal hover:underline cursor-help">
                                           ΔΕΣ ΣΥΝΤΕΛΕΣΤΕΣ
                                        </button>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white rounded-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-50 shadow-2xl scale-95 group-hover:scale-100 origin-bottom">
                                            <div className="text-[10px] font-black uppercase text-gray-400 mb-2 border-b border-gray-700 pb-1 text-center">Βαρυτητες Μαθηματων</div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold truncate pr-2" title={currentFieldParams?.subjects[0].name}>{currentFieldParams?.subjects[0].name.split(' ')[0]}</span> 
                                                <span className="font-black text-brand-orange">{(faculty.coeffs.s1 * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold truncate pr-2" title={currentFieldParams?.subjects[1].name}>{currentFieldParams?.subjects[1].name.split(' ')[0]}</span> 
                                                <span className="font-black text-brand-orange">{(faculty.coeffs.s2 * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold truncate pr-2" title={currentFieldParams?.subjects[2].name}>{currentFieldParams?.subjects[2].name.split(' ')[0]}</span> 
                                                <span className="font-black text-brand-orange">{(faculty.coeffs.s3 * 100).toFixed(0)}%</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold truncate pr-2" title={currentFieldParams?.subjects[3].name}>{currentFieldParams?.subjects[3].name.split(' ')[0]}</span> 
                                                <span className="font-black text-brand-orange">{(faculty.coeffs.s4 * 100).toFixed(0)}%</span>
                                            </div>
                                            {/* Tooltip arrow */}
                                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45"></div>
                                        </div>
                                     </div>
                                  </div>

                               </div>
                            </motion.div>
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
