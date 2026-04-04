'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { client } from '@/sanity/client';

// ─── Types ───────────────────────────────────────────────────────────────────
interface PlanFeature {
  icon: string;
  title: string;
  description: string;
}

interface PlanSubject {
  subjectName: string;
  hoursPerWeek: number;
  category: string;
}

interface PlanStat {
  value: string;
  label: string;
}

interface PlanData {
  _id: string;
  level: 'gymnasio' | 'lykeio' | 'epal';
  tagline?: string;
  heroDescription?: string;
  features?: PlanFeature[];
  subjects?: PlanSubject[];
  stats?: PlanStat[];
  callToAction?: string;
}

// ─── GROQ Query ──────────────────────────────────────────────────────────────
const PLANS_QUERY = `*[_type == "planPage"] | order(level asc) {
  _id,
  level,
  tagline,
  heroDescription,
  features[] { icon, title, description },
  subjects[] { subjectName, hoursPerWeek, category },
  stats[] { value, label },
  callToAction
}`;

// ─── Static Fallback Data ─────────────────────────────────────────────────────
const FALLBACK_PLANS: PlanData[] = [
  {
    _id: 'gymnasio',
    level: 'gymnasio',
    tagline: 'Χτίζουμε τη γνώση από την αρχή',
    heroDescription:
      'Στο Γυμνάσιο μαθαίνουμε να μαθαίνουμε. Η μεθοδολογία μας εστιάζει στην κατανόηση των εννοιών, την ανάπτυξη κριτικής σκέψης και την απόκτηση σταθερής βάσης για το Λύκειο. Μικρά τμήματα, εξατομικευμένη προσοχή, εβδομαδιαία διαγνωστικά τεστ.',
    features: [
      { icon: '📚', title: 'Μικρά Τμήματα', description: 'Μέγιστο 8 μαθητές ανά τμήμα για εξατομικευμένη προσοχή' },
      { icon: '📊', title: 'Εβδομαδιαία Αξιολόγηση', description: 'Διαγνωστικά τεστ κάθε εβδομάδα για παρακολούθηση της προόδου' },
      { icon: '🎯', title: 'Στοχευμένη Προετοιμασία', description: 'Εστίαση στα κρίσιμα κεφάλαια για τις τελικές εξετάσεις' },
      { icon: '👨‍👩‍👧', title: 'Ενημέρωση Γονέων', description: 'Μηνιαίες συναντήσεις με γονείς για ενημέρωση προόδου' },
    ],
    subjects: [
      { subjectName: 'Μαθηματικά', hoursPerWeek: 3, category: 'Θετικά' },
      { subjectName: 'Φυσική', hoursPerWeek: 2, category: 'Θετικά' },
      { subjectName: 'Χημεία', hoursPerWeek: 2, category: 'Θετικά' },
      { subjectName: 'Αρχαία Ελληνικά', hoursPerWeek: 2, category: 'Θεωρητικά' },
      { subjectName: 'Έκθεση', hoursPerWeek: 2, category: 'Θεωρητικά' },
      { subjectName: 'Ιστορία', hoursPerWeek: 2, category: 'Θεωρητικά' },
      { subjectName: 'Αγγλικά', hoursPerWeek: 2, category: 'Γλώσσες' },
    ],
    stats: [
      { value: '97%', label: 'Επιτυχία στις Εξετάσεις' },
      { value: '8', label: 'Μέγιστο Μαθητών/Τμήμα' },
      { value: '200+', label: 'Απόφοιτοι Ετησίως' },
    ],
    callToAction: 'Εγγράψου Τώρα',
  },
  {
    _id: 'lykeio',
    level: 'lykeio',
    tagline: 'Η πορεία προς τα Πανεπιστήμια ξεκινά εδώ',
    heroDescription:
      'Στο Λύκειο ο στόχος είναι κρυστάλλινος: να περάσεις στη σχολή που θέλεις. Η μέθοδός μας συνδυάζει εντατική εξάσκηση, πραγματικά θέματα Πανελληνίων και ατομική καθοδήγηση από εξειδικευμένους καθηγητές. Ποσοστό επιτυχίας 95% τα τελευταία 10 χρόνια.',
    features: [
      { icon: '🏆', title: '95% Επιτυχία', description: 'Το υψηλότερο ποσοστό επιτυχίας στις Πανελλήνιες στην περιοχή' },
      { icon: '📝', title: 'Θέματα Πανελληνίων', description: 'Εξάσκηση με πραγματικά θέματα από τα τελευταία 10 χρόνια' },
      { icon: '🔬', title: 'Εργαστήρια Επίλυσης', description: 'Εβδομαδιαία εργαστήρια με επίλυση δύσκολων θεμάτων' },
      { icon: '📱', title: 'Online Υποστήριξη', description: '24/7 πρόσβαση σε σημειώσεις και λυμένες ασκήσεις' },
    ],
    subjects: [
      { subjectName: 'Μαθηματικά', hoursPerWeek: 4, category: 'Θετικά' },
      { subjectName: 'Φυσική', hoursPerWeek: 3, category: 'Θετικά' },
      { subjectName: 'Χημεία', hoursPerWeek: 3, category: 'Θετικά' },
      { subjectName: 'Βιολογία', hoursPerWeek: 2, category: 'Θετικά' },
      { subjectName: 'Νεοελληνική Γλώσσα & Λογοτεχνία', hoursPerWeek: 3, category: 'Θεωρητικά' },
      { subjectName: 'Ιστορία', hoursPerWeek: 2, category: 'Θεωρητικά' },
      { subjectName: 'Λατινικά', hoursPerWeek: 2, category: 'Θεωρητικά' },
      { subjectName: 'Αρχαία Ελληνικά', hoursPerWeek: 3, category: 'Θεωρητικά' },
    ],
    stats: [
      { value: '95%', label: 'Επιτυχία Πανελληνίων' },
      { value: '1.200+', label: 'Επιτυχόντες Φοιτητές' },
      { value: '35+', label: 'Χρόνια Εμπειρίας' },
    ],
    callToAction: 'Κλείσε Δωρεάν Δοκιμαστικό',
  },
  {
    _id: 'epal',
    level: 'epal',
    tagline: 'Επαγγελματική Κατάρτιση & Πανεπιστήμιο',
    heroDescription:
      'Το ΕΠΑΛ ανοίγει μοναδικούς ορίζοντες: επαγγελματική κατάρτιση υψηλού επιπέδου και δρόμος προς ΤΕΙ & ΑΕΙ. Η Μόρφωση παρέχει εξειδικευμένη προετοιμασία για τις Πανελλαδικές Εξετάσεις ΕΠΑΛ, καλύπτοντας πλήρως τα ειδικά μαθήματα της κάθε ειδικότητας.',
    features: [
      { icon: '🔧', title: 'Ειδικά Μαθήματα', description: 'Πλήρης κάλυψη ειδικών μαθημάτων ανά ειδικότητα ΕΠΑΛ' },
      { icon: '🎓', title: 'Δρόμος ΑΕΙ/ΤΕΙ', description: 'Εξειδικευμένη προετοιμασία για πρόσβαση σε ανώτατη εκπαίδευση' },
      { icon: '💡', title: 'Πρακτική Εκπαίδευση', description: 'Συνδυασμός θεωρίας και πρακτικής εφαρμογής' },
      { icon: '🤝', title: 'Καθοδήγηση Καριέρας', description: 'Συμβουλευτική για επαγγελματική αποκατάσταση και σπουδές' },
    ],
    subjects: [
      { subjectName: 'Νεοελληνική Γλώσσα', hoursPerWeek: 2, category: 'Γενική Παιδεία' },
      { subjectName: 'Μαθηματικά', hoursPerWeek: 3, category: 'Γενική Παιδεία' },
      { subjectName: 'Φυσική', hoursPerWeek: 2, category: 'Γενική Παιδεία' },
      { subjectName: 'Τεχνολογία Ειδικότητας', hoursPerWeek: 4, category: 'Τεχνολογικά' },
      { subjectName: 'Εφαρμογές Ειδικότητας', hoursPerWeek: 4, category: 'Τεχνολογικά' },
      { subjectName: 'Αγγλικά', hoursPerWeek: 2, category: 'Γλώσσες' },
    ],
    stats: [
      { value: '92%', label: 'Επιτυχία ΕΠΑΛ' },
      { value: '15+', label: 'Ειδικότητες' },
      { value: '500+', label: 'Απόφοιτοι ΕΠΑΛ' },
    ],
    callToAction: 'Ξεκίνα Σήμερα',
  },
];

// ─── Config per level ─────────────────────────────────────────────────────────
const LEVEL_CONFIG = {
  gymnasio: {
    label: 'ΓΥΜΝΑΣΙΟ',
    sub: 'Α΄ — Γ΄ Γυμνασίου',
    emoji: '🏫',
    color: '#0c82a2',        // brand-teal
    colorDark: '#095f77',
    colorLight: '#e0f4fa',
    gradientFrom: '#095f77',
    gradientTo: '#031516',
    accent: '#0c82a2',
    badgeBg: '#e0f4fa',
    badgeText: '#095f77',
    tabBorder: 'border-brand-teal',
    categoryColors: {
      'Θετικά': '#0c82a2',
      'Θεωρητικά': '#8e4585',
      'Γλώσσες': '#00a651',
      'Τεχνολογικά': '#e31837',
      'Γενική Παιδεία': '#f58220',
    },
  },
  lykeio: {
    label: 'ΛΥΚΕΙΟ',
    sub: 'Α΄ — Γ΄ Λυκείου',
    emoji: '🎓',
    color: '#f58220',        // brand-orange
    colorDark: '#c96b10',
    colorLight: '#fff4e6',
    gradientFrom: '#c96b10',
    gradientTo: '#1a0a00',
    accent: '#f58220',
    badgeBg: '#fff4e6',
    badgeText: '#c96b10',
    tabBorder: 'border-brand-orange',
    categoryColors: {
      'Θετικά': '#0c82a2',
      'Θεωρητικά': '#8e4585',
      'Γλώσσες': '#00a651',
      'Τεχνολογικά': '#e31837',
      'Γενική Παιδεία': '#f58220',
    },
  },
  epal: {
    label: 'ΕΠΑΛ',
    sub: 'Επαγγελματικό Λύκειο',
    emoji: '🔧',
    color: '#e31837',        // brand-red
    colorDark: '#991020',
    colorLight: '#fde8ec',
    gradientFrom: '#991020',
    gradientTo: '#0d0305',
    accent: '#e31837',
    badgeBg: '#fde8ec',
    badgeText: '#991020',
    tabBorder: 'border-brand-red',
    categoryColors: {
      'Θετικά': '#0c82a2',
      'Θεωρητικά': '#8e4585',
      'Γλώσσες': '#00a651',
      'Τεχνολογικά': '#e31837',
      'Γενική Παιδεία': '#f58220',
    },
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroSection({ active, plans }: { active: string; plans: PlanData[] }) {
  const plan = plans.find((p) => p.level === active);
  const cfg = LEVEL_CONFIG[active as keyof typeof LEVEL_CONFIG];

  return (
    <div
      className="relative w-full overflow-hidden transition-all duration-700"
      style={{
        background: `linear-gradient(135deg, ${cfg.gradientFrom} 0%, ${cfg.gradientTo} 100%)`,
        minHeight: '420px',
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(${cfg.color} 1px, transparent 1px), linear-gradient(90deg, ${cfg.color} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
      {/* Glow blob */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-40"
        style={{ background: cfg.color }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-30"
        style={{ background: cfg.accent }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-16">
        {/* Text */}
        <div className="flex-1">
          <div
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest mb-6 border-2"
            style={{ borderColor: cfg.color, color: cfg.color, background: 'rgba(255,255,255,0.06)' }}
          >
            <span className="text-xl">{cfg.emoji}</span>
            {cfg.sub}
          </div>
          <h1 className="text-white text-[13vw] sm:text-[5.5rem] lg:text-[6.5rem] leading-[0.85] font-black tracking-tighter uppercase mb-6 drop-shadow-2xl">
            {cfg.label}
          </h1>
          {plan?.tagline && (
            <div
              className="inline-block px-6 py-3 font-black text-white text-lg md:text-xl uppercase tracking-wide border-4 border-black shadow-[6px_6px_0px_#000] mb-8"
              style={{ background: cfg.color }}
            >
              {plan.tagline}
            </div>
          )}
          <p className="text-white/80 font-semibold text-base md:text-lg max-w-2xl leading-relaxed">
            {plan?.heroDescription || 'Το πρόγραμμά μας σχεδιάστηκε για να σε οδηγεί στην επιτυχία.'}
          </p>
          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              href="/contact"
              className="px-8 py-4 font-black uppercase tracking-widest text-sm text-white border-4 border-black shadow-[6px_6px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all inline-block"
              style={{ background: cfg.color }}
            >
              {plan?.callToAction || 'ΚΛΕΙΣΕ ΔΩΡΕΑΝ ΔΟΚΙΜΑΣΤΙΚΟ'}
            </Link>
            <Link
              href="/calculator"
              className="px-8 py-4 font-black uppercase tracking-widest text-sm text-black bg-white border-4 border-black shadow-[6px_6px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all inline-block"
            >
              ΥΠΟΛΟΓΙΣΕ ΜΟΡΙΑ
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        {plan?.stats && plan.stats.length > 0 && (
          <div className="flex flex-col gap-4 w-full lg:w-auto">
            {plan.stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-md border-2 border-white/20 px-8 py-5 rounded-2xl flex items-center gap-5 min-w-[220px]"
              >
                <div
                  className="text-4xl font-black leading-none"
                  style={{ color: cfg.color }}
                >
                  {stat.value}
                </div>
                <div className="text-white/90 font-bold text-sm uppercase tracking-wider leading-snug">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TabBar({
  active,
  onChange,
}: {
  active: string;
  onChange: (v: string) => void;
}) {
  const levels = ['gymnasio', 'lykeio', 'epal'] as const;

  return (
    <div className="sticky top-0 z-50 w-full bg-white border-b-4 border-black shadow-lg">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex">
          {levels.map((level) => {
            const cfg = LEVEL_CONFIG[level];
            const isActive = active === level;
            return (
              <button
                key={level}
                onClick={() => onChange(level)}
                className={`flex-1 flex items-center justify-center gap-2 py-5 font-black text-xs sm:text-sm uppercase tracking-widest border-b-[6px] transition-all duration-300 ${
                  isActive ? 'text-white border-b-0' : 'text-gray-500 border-transparent hover:text-gray-800'
                }`}
                style={
                  isActive
                    ? { background: cfg.color, borderBottomColor: cfg.colorDark }
                    : { background: 'transparent' }
                }
              >
                <span className="text-lg">{cfg.emoji}</span>
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FeaturesGrid({ plan }: { plan: PlanData }) {
  const cfg = LEVEL_CONFIG[plan.level];
  if (!plan.features?.length) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-[6px] border-black pb-4">
          <div>
            <span
              className="text-xs font-black uppercase tracking-[0.3em] mb-2 block"
              style={{ color: cfg.color }}
            >
              Τι προσφέρουμε
            </span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 leading-tight">
              Γιατί να επιλέξεις<br />
              <span style={{ color: cfg.color }}>τη Μόρφωση</span>
            </h2>
          </div>
          <p className="text-gray-500 font-semibold text-base max-w-md leading-relaxed">
            Κάθε λεπτομέρεια του προγράμματος είναι σχεδιασμένη για τη μέγιστη πρόοδό σου.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plan.features.map((feature, i) => (
            <div
              key={i}
              className="group relative bg-white border-4 border-black p-7 shadow-[6px_6px_0px_#000] hover:-translate-y-2 hover:shadow-[6px_12px_0px_#000] transition-all duration-300 cursor-default overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                style={{ background: cfg.color }}
              />
              <div
                className="w-14 h-14 flex items-center justify-center text-2xl border-4 border-black mb-5 font-bold shadow-[3px_3px_0px_#000] group-hover:rotate-6 transition-transform duration-300"
                style={{ background: cfg.colorLight }}
              >
                {feature.icon}
              </div>
              <h3
                className="font-black text-gray-900 uppercase tracking-tight text-lg mb-3 group-hover:transition-colors"
              >
                {feature.title}
              </h3>
              <p className="text-gray-600 font-medium text-sm leading-relaxed">
                {feature.description}
              </p>
              <div
                className="absolute bottom-0 left-0 w-full h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{ background: cfg.color }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SubjectsSection({ plan }: { plan: PlanData }) {
  const cfg = LEVEL_CONFIG[plan.level];
  if (!plan.subjects?.length) return null;

  const categories = [...new Set(plan.subjects.map((s) => s.category))];
  const catColors = cfg.categoryColors as Record<string, string>;

  return (
    <section className="py-20" style={{ background: '#f8f8f8' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-12 text-center">
          <span
            className="text-xs font-black uppercase tracking-[0.3em] mb-2 block"
            style={{ color: cfg.color }}
          >
            Πρόγραμμα Μαθημάτων
          </span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900">
            ΤΙ <span style={{ color: cfg.color }}>ΔΙΔΑΣΚΟΥΜΕ</span>
          </h2>
        </div>

        {/* Category Legend */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {categories.map((cat) => (
            <span
              key={cat}
              className="px-4 py-2 text-xs font-black uppercase tracking-widest text-white rounded-full border-2 border-black"
              style={{ background: catColors[cat] || cfg.color }}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {plan.subjects.map((subject, i) => {
            const barColor = catColors[subject.category] || cfg.color;
            return (
              <div
                key={i}
                className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all group"
              >
                <div
                  className="h-1.5 mb-4 rounded-full"
                  style={{ background: barColor }}
                />
                <div className="font-black text-gray-900 text-base mb-3 leading-tight uppercase tracking-tight">
                  {subject.subjectName}
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-black uppercase tracking-widest px-2 py-1 rounded-full text-white"
                    style={{ background: barColor }}
                  >
                    {subject.category}
                  </span>
                  <span className="text-gray-500 font-black text-xs">
                    {subject.hoursPerWeek}h/εβδ.
                  </span>
                </div>

                {/* Hours indicator */}
                <div className="mt-4">
                  <div className="flex gap-1">
                    {Array.from({ length: 6 }).map((_, dotIdx) => (
                      <div
                        key={dotIdx}
                        className="flex-1 h-2 rounded-sm transition-all"
                        style={{
                          background:
                            dotIdx < subject.hoursPerWeek
                              ? barColor
                              : '#e5e7eb',
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold mt-1 block">
                    {subject.hoursPerWeek} ώρες εβδομαδιαίως
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MethodologyBanner({ plan }: { plan: PlanData }) {
  const cfg = LEVEL_CONFIG[plan.level];
  const steps = [
    { num: '01', title: 'Αρχική Αξιολόγηση', desc: 'Κάνουμε διαγνωστικό τεστ για να εντοπίσουμε τα δυνατά και αδύνατα σημεία σου.' },
    { num: '02', title: 'Εξατομικευμένο Πλάνο', desc: 'Φτιάχνουμε αναλυτικό ατομικό πρόγραμμα με βάση τους στόχους σου.' },
    { num: '03', title: 'Εντατική Προετοιμασία', desc: 'Εφαρμόζουμε το πλάνο με συνεχή αξιολόγηση και προσαρμογή.' },
    { num: '04', title: 'Επιτυχία', desc: 'Φτάνεις στον στόχο σου — στα μόρια, στη σχολή, στο επόμενο βήμα.' },
  ];

  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${cfg.gradientFrom} 0%, ${cfg.gradientTo} 100%)`,
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(${cfg.color} 1px, transparent 1px), linear-gradient(90deg, ${cfg.color} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-14 text-center">
          <span
            className="text-xs font-black uppercase tracking-[0.3em] mb-2 block"
            style={{ color: cfg.color }}
          >
            Η διαδικασία μας
          </span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
            ΠΩΣ <span style={{ color: cfg.color }}>ΔΟΥΛΕΥΟΥΜΕ</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-8 left-[calc(100%+0.75rem)] w-6 h-0.5 z-10"
                  style={{ background: cfg.color, opacity: 0.5 }}
                />
              )}
              <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 p-6 rounded-2xl hover:bg-white/15 transition-all group">
                <div
                  className="text-5xl font-black mb-4 leading-none"
                  style={{ color: cfg.color, opacity: 0.4 }}
                >
                  {step.num}
                </div>
                <h3 className="text-white font-black text-lg uppercase tracking-tight mb-3">
                  {step.title}
                </h3>
                <p className="text-white/70 font-medium text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ plan }: { plan: PlanData }) {
  const cfg = LEVEL_CONFIG[plan.level];

  return (
    <section className="py-24 bg-white border-t-[8px] border-black">
      <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
        <div
          className="inline-block text-5xl mb-6"
        >
          {cfg.emoji}
        </div>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-gray-900 leading-tight mb-6">
          ΕΤΟΙΜΟΣ ΝΑ<br />
          <span style={{ color: cfg.color }}>ΞΕΚΙΝΗΣΕΙΣ;</span>
        </h2>
        <p className="text-gray-500 font-semibold text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
          Κλείσε το δωρεάν δοκιμαστικό σου μάθημα σήμερα και γνώρισε τη μέθοδό μας από κοντά. Μηδέν υποχρεώσεις.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/contact"
            className="px-10 py-5 font-black uppercase tracking-widest text-base text-white border-4 border-black shadow-[8px_8px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[6px] hover:translate-y-[6px] transition-all inline-block"
            style={{ background: cfg.color }}
          >
            {plan.callToAction || 'ΚΛΕΙΣΕ ΔΩΡΕΑΝ ΔΟΚΙΜΑΣΤΙΚΟ'}
          </Link>
          <Link
            href="/"
            className="px-10 py-5 font-black uppercase tracking-widest text-base text-gray-900 bg-white border-4 border-black shadow-[8px_8px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[6px] hover:translate-y-[6px] transition-all inline-block"
          >
            ΕΛΑ ΠΙΣΩ
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PlanoPage() {
  const [activeLevel, setActiveLevel] = useState<string>('gymnasio');
  const [plans, setPlans] = useState<PlanData[]>(FALLBACK_PLANS);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Read level preference from session (set via Hero select dropdown)
    const storedLevel = sessionStorage.getItem('planoLevel');
    if (storedLevel && ['gymnasio', 'lykeio', 'epal'].includes(storedLevel)) {
      setActiveLevel(storedLevel);
      sessionStorage.removeItem('planoLevel'); // consume it
    }

    client
      .fetch<PlanData[]>(PLANS_QUERY)
      .then((data) => {
        if (data && data.length > 0) setPlans(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleTabChange = (level: string) => {
    setActiveLevel(level);
    // Scroll to content smoothly
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const activePlan = plans.find((p) => p.level === activeLevel) || plans[0];

  return (
    <div className="min-h-screen bg-white">
      {/* ── Page Header ──────────────────────────────── */}
      <div className="bg-gray-950 text-white py-6 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-1">
              Φροντιστήριο Μόρφωση
            </p>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
              ΤΟ <span className="text-brand-orange">ΠΛΑΝΟ</span> ΜΑΣ
            </h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {(['gymnasio', 'lykeio', 'epal'] as const).map((level) => {
              const cfg = LEVEL_CONFIG[level];
              return (
                <button
                  key={level}
                  onClick={() => handleTabChange(level)}
                  className={`px-4 py-2 font-black text-xs uppercase tracking-widest border-2 transition-all ${
                    activeLevel === level
                      ? 'text-white border-transparent'
                      : 'text-gray-400 border-gray-700 hover:border-gray-400 hover:text-white'
                  }`}
                  style={activeLevel === level ? { background: cfg.color, borderColor: cfg.color } : {}}
                >
                  {cfg.emoji} {cfg.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── TAB BAR ──────────────────────────────────── */}
      <TabBar active={activeLevel} onChange={handleTabChange} />

      {/* ── CONTENT ──────────────────────────────────── */}
      <div ref={contentRef}>
        {loading ? (
          <div className="flex items-center justify-center py-40">
            <div
              className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: LEVEL_CONFIG[activeLevel as keyof typeof LEVEL_CONFIG].color, borderTopColor: 'transparent' }}
            />
          </div>
        ) : (
          activePlan && (
            <div key={activeLevel} className="animate-fade-in">
              <HeroSection active={activeLevel} plans={plans} />
              <FeaturesGrid plan={activePlan} />
              <SubjectsSection plan={activePlan} />
              <MethodologyBanner plan={activePlan} />
              <CTASection plan={activePlan} />
            </div>
          )
        )}
      </div>
    </div>
  );
}
