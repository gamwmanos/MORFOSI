/**
 * convert-bases.js
 * Converts the 4 txt files from d:\MORFOSI\baseis\ to JSON files
 * placed in d:\MORFOSI\morfosi-site\public\data\
 * 
 * Run with: node scripts/convert-bases.js
 */

const fs = require('fs');
const path = require('path');

const BASEIS_DIR = path.join(__dirname, '..', 'baseis');
const OUT_DIR = path.join(__dirname, '..', 'morfosi-site', 'public', 'data');

// Existing 2023 coefficients from schoolsData.ts — keyed by "name|institution" for lookup
// We keep them so the calculator can still do per-faculty weighting
// Format: coeffs: {s1, s2, s3, s4}  (sum = 1.0)
// Defaults per field if no specific match found:
const FIELD_DEFAULT_COEFFS = {
  1: { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 },
  2: { s1: 0.20, s2: 0.30, s3: 0.25, s4: 0.25 },
  3: { s1: 0.20, s2: 0.25, s3: 0.25, s4: 0.30 },
  4: { s1: 0.20, s2: 0.35, s3: 0.25, s4: 0.20 },
};

// Known coefficients overrides (name substring match)
// These are standard across Greece, set by each faculty
const KNOWN_COEFFS = {
  // Field 1 - Humanities
  'Νομικής': { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 },
  'Ψυχολογίας': { s1: 0.30, s2: 0.20, s3: 0.25, s4: 0.25 },
  'Ψυχολόγων': { s1: 0.30, s2: 0.20, s3: 0.25, s4: 0.25 },
  'Φιλολογίας': { s1: 0.20, s2: 0.30, s3: 0.20, s4: 0.30 },
  'Αγγλικής Γλώσσας': { s1: 0.30, s2: 0.20, s3: 0.20, s4: 0.30 },
  'Ιταλικής Γλώσσας': { s1: 0.30, s2: 0.20, s3: 0.20, s4: 0.30 },
  'Γαλλικής Γλώσσας': { s1: 0.30, s2: 0.20, s3: 0.20, s4: 0.30 },
  'Γερμανικής Γλώσσας': { s1: 0.30, s2: 0.20, s3: 0.20, s4: 0.30 },
  'Ισπανικής Γλώσσας': { s1: 0.30, s2: 0.20, s3: 0.20, s4: 0.30 },
  'Ιστορίας και Αρχαιολογίας': { s1: 0.25, s2: 0.25, s3: 0.30, s4: 0.20 },
  'Ιστορίας, Αρχαιολογίας': { s1: 0.25, s2: 0.25, s3: 0.30, s4: 0.20 },
  'Ιστορίας και Φιλοσοφίας': { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 },
  'Παιδαγωγικό Δημοτικής': { s1: 0.30, s2: 0.20, s3: 0.30, s4: 0.20 },
  'Παιδαγωγικό Νηπιαγωγών': { s1: 0.30, s2: 0.20, s3: 0.30, s4: 0.20 },
  'Παιδαγωγικό Ειδικής': { s1: 0.30, s2: 0.20, s3: 0.30, s4: 0.20 },
  'Παιδαγωγικό Προσχολικής': { s1: 0.30, s2: 0.20, s3: 0.30, s4: 0.20 },
  'Εκπαίδευσης και Αγωγής': { s1: 0.30, s2: 0.20, s3: 0.30, s4: 0.20 },
  'Επιστημών Εκπ': { s1: 0.30, s2: 0.20, s3: 0.30, s4: 0.20 },
  'Πολιτικής Επιστήμης': { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 },
  'Πολιτικών Επιστημών': { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 },
  'Κοινωνιολογίας': { s1: 0.30, s2: 0.20, s3: 0.25, s4: 0.25 },
  'Κοινωνικής Εργασίας': { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 },
  'Κοινωνικής Πολιτικής': { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 },
  'Κοινωνικής Ανθρωπολογίας': { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 },
  'Δημοσιογραφίας': { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 },
  'Επικοινωνίας': { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 },
  'Διεθνών': { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 },
  'Φιλοσοφίας': { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 },
  'Θεολογίας': { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 },
  'Θεατρικών': { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 },
  'Θεάτρου': { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 },
  'Μουσικής': { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 },
  'Μουσικών Σπουδών': { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 },
  'Δημόσιας Διοίκησης': { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 },
  'Επιστήμης Φυσικής Αγωγής': { s1: 0.20, s2: 0.20, s3: 0.30, s4: 0.30 },
  'Ξένων Γλωσσών': { s1: 0.30, s2: 0.20, s3: 0.20, s4: 0.30 },
  // Field 2 - Sciences/Tech
  'Ηλεκτρολόγων Μηχ': { s1: 0.20, s2: 0.25, s3: 0.20, s4: 0.35 },
  'Μηχανολόγων Μηχανικών': { s1: 0.20, s2: 0.30, s3: 0.20, s4: 0.30 },
  'Αρχιτεκτόνων': { s1: 0.25, s2: 0.25, s3: 0.20, s4: 0.30 },
  'Χημικών Μηχανικών': { s1: 0.20, s2: 0.25, s3: 0.35, s4: 0.20 },
  'Πολιτικών Μηχανικών': { s1: 0.20, s2: 0.30, s3: 0.20, s4: 0.30 },
  'Πληροφορικής και Τηλεπικοινωνιών': { s1: 0.20, s2: 0.25, s3: 0.20, s4: 0.35 },
  'Πληροφορικής': { s1: 0.20, s2: 0.25, s3: 0.20, s4: 0.35 },
  'Μηχανικών Πληροφ': { s1: 0.20, s2: 0.25, s3: 0.20, s4: 0.35 },
  'Εφαρμοσμένης Πληροφορικής': { s1: 0.20, s2: 0.25, s3: 0.20, s4: 0.35 },
  'Ψηφιακών Συστημάτων': { s1: 0.20, s2: 0.25, s3: 0.20, s4: 0.35 },
  'Φυσικής': { s1: 0.20, s2: 0.35, s3: 0.20, s4: 0.25 },
  'Μαθηματικών': { s1: 0.20, s2: 0.20, s3: 0.20, s4: 0.40 },
  'Χημείας': { s1: 0.20, s2: 0.20, s3: 0.40, s4: 0.20 },
  'Βιολογίας': { s1: 0.20, s2: 0.20, s3: 0.30, s4: 0.30 },
  'Βιοτεχνολογίας': { s1: 0.20, s2: 0.25, s3: 0.30, s4: 0.25 },
  'Βιοχημείας': { s1: 0.20, s2: 0.25, s3: 0.30, s4: 0.25 },
  'Γεωπονίας': { s1: 0.20, s2: 0.20, s3: 0.30, s4: 0.30 },
  'Ναυπηγών': { s1: 0.20, s2: 0.30, s3: 0.20, s4: 0.30 },
  'Γεωλογίας': { s1: 0.20, s2: 0.25, s3: 0.30, s4: 0.25 },
  'Μεταλλειολόγων': { s1: 0.20, s2: 0.25, s3: 0.25, s4: 0.30 },
  'Τοπογράφων': { s1: 0.20, s2: 0.30, s3: 0.20, s4: 0.30 },
  // Field 3 - Health
  'Ιατρικής': { s1: 0.20, s2: 0.25, s3: 0.25, s4: 0.30 },
  'Ιατρικό': { s1: 0.20, s2: 0.25, s3: 0.25, s4: 0.30 },
  'Οδοντιατρικής': { s1: 0.20, s2: 0.25, s3: 0.25, s4: 0.30 },
  'Φαρμακευτικής': { s1: 0.20, s2: 0.20, s3: 0.35, s4: 0.25 },
  'Κτηνιατρικής': { s1: 0.20, s2: 0.20, s3: 0.30, s4: 0.30 },
  'Νοσηλευτικής': { s1: 0.25, s2: 0.20, s3: 0.25, s4: 0.30 },
  'Φυσικοθεραπείας': { s1: 0.25, s2: 0.20, s3: 0.25, s4: 0.30 },
  'Εργοθεραπείας': { s1: 0.25, s2: 0.20, s3: 0.25, s4: 0.30 },
  'Λογοθεραπείας': { s1: 0.25, s2: 0.20, s3: 0.25, s4: 0.30 },
  'Μαιευτικής': { s1: 0.25, s2: 0.20, s3: 0.25, s4: 0.30 },
  'Διαιτολογίας': { s1: 0.25, s2: 0.20, s3: 0.25, s4: 0.30 },
  'Επιστήμης Διαιτολογίας': { s1: 0.25, s2: 0.20, s3: 0.25, s4: 0.30 },
  // Field 4 - Economics/IT
  'Οικονομικής Επιστήμης': { s1: 0.20, s2: 0.25, s3: 0.20, s4: 0.35 },
  'Οικονομικών Επιστημών': { s1: 0.20, s2: 0.25, s3: 0.20, s4: 0.35 },
  'Οργάνωσης και Διοίκησης': { s1: 0.20, s2: 0.30, s3: 0.20, s4: 0.30 },
  'Διοίκησης Επιχειρήσεων': { s1: 0.20, s2: 0.30, s3: 0.20, s4: 0.30 },
  'Λογιστικής': { s1: 0.20, s2: 0.30, s3: 0.20, s4: 0.30 },
  'Μάρκετινγκ': { s1: 0.25, s2: 0.25, s3: 0.20, s4: 0.30 },
  'Ναυτιλιακών': { s1: 0.25, s2: 0.20, s3: 0.25, s4: 0.30 },
  'Τουριστικών': { s1: 0.25, s2: 0.20, s3: 0.25, s4: 0.30 },
  'Τουρισμού': { s1: 0.25, s2: 0.20, s3: 0.25, s4: 0.30 },
  'Στατιστικής': { s1: 0.20, s2: 0.35, s3: 0.25, s4: 0.20 },
};

// Special requirements detection from EBE string
function parseEBE(ebeStr) {
  if (!ebeStr) return { mainEbe: 8.4, specialReqs: [] };
  
  // Remove multiple EBE values (take only the main one)
  // Format examples:
  //   "13,22 / Ξ.Γ.: 14,70"    → main: 13.22, special: [{type: 'ΞΓ', value: 14.70}]
  //   "8,55 / ΑΓΩΝ.: 7,73"     → main: 8.55, special: [{type: 'ΑΓΩΝ', value: 7.73}]
  //   "13,38"                   → main: 13.38, specials: []
  //   "13,18 - 15,81 - 12,18"  → Αρχιτεκτονική (3 parts: main, ελεύθ, γραμμ)
  
  const parts = ebeStr.split('/').map(s => s.trim());
  const mainPart = parts[0];
  
  // Try to parse the main EBE (handles "13,22" or "13,18 - 15,81 - 12,18")
  const mainDashParts = mainPart.split('-').map(s => s.trim());
  const mainEbeStr = mainDashParts[0].replace(',', '.');
  const mainEbe = parseFloat(mainEbeStr) || 8.4;
  
  const specialReqs = [];
  
  // Detect special subjects
  const fullStr = ebeStr.toUpperCase();
  if (fullStr.includes('ΑΓΩΝ') || fullStr.includes('ΑΓΩΝΙΣΜ')) {
    specialReqs.push('Αγωνίσματα (ΤΕΦΑΑ)');
  }
  if (fullStr.includes('ΑΓΓ') && (fullStr.includes('ΑΓΓ.:') || fullStr.includes('ΑΓΓΛ.'))) {
    specialReqs.push('Αγγλικά');
  }
  if (fullStr.includes('ΞΕΝ') || fullStr.includes('Ξ.Γ.') || (fullStr.includes('ΞΓ'))) {
    specialReqs.push('Ξένη Γλώσσα');
  }
  if (fullStr.includes('ΕΛΕΥΘ') || fullStr.includes('ΕΛΕΎΘ')) {
    specialReqs.push('Ελεύθερο Σχέδιο');
  }
  if (fullStr.includes('ΓΡΑΜΜ')) {
    specialReqs.push('Γραμμικό Σχέδιο');
  }
  if (fullStr.includes('ΙΤΑΛ')) {
    specialReqs.push('Ιταλικά');
  }
  if (fullStr.includes('ΓΑΛΛ')) {
    specialReqs.push('Γαλλικά');
  }
  if (fullStr.includes('ΓΕΡΜ')) {
    specialReqs.push('Γερμανικά');
  }
  if (fullStr.includes('ΙΣΠ')) {
    specialReqs.push('Ισπανικά');
  }
  if (fullStr.includes('ΘΕΩΡΙΑ') || fullStr.includes('ΕΚΤΕΛΕΣΗ')) {
    specialReqs.push('Μουσική (Θεωρία/Εκτέλεση)');
  }
  
  return { mainEbe, specialReqs };
}

// Parse institution from "Τμήμα (Ίδρυμα)" format
function parseNameAndInstitution(raw) {
  // Handle "Τμήμα (ΕΚΠΑ)" or "Τμήμα (ΑΠΘ)" etc.
  const match = raw.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (match) {
    return {
      name: match[1].trim(),
      institution: match[2].trim(),
    };
  }
  // No parentheses - use as-is
  return { name: raw.trim(), institution: 'Άγνωστο' };
}

// Find best coefficients match
function findCoeffs(name, fieldId) {
  // Try longest match first
  const sortedKeys = Object.keys(KNOWN_COEFFS).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (name.includes(key)) {
      return KNOWN_COEFFS[key];
    }
  }
  return FIELD_DEFAULT_COEFFS[fieldId];
}

// Extract city from institution abbreviation
function getCityFromInstitution(inst) {
  const cityMap = {
    'ΕΚΠΑ': 'Αθήνα', 'ΕΜΠ': 'Αθήνα', 'ΟΠΑ': 'Αθήνα', 'ΠΑΝΤΕΙΟ': 'Αθήνα',
    'ΠΑ.ΔΑ': 'Αθήνα', 'ΠΑ.Δ.Α.': 'Αθήνα', 'ΧΑΡΟΚΟΠΕΙΟ ΠΑΝ.': 'Αθήνα',
    'ΧΑΡΟΚΟΠΕΙΟ': 'Αθήνα', 'ΓΠΑ': 'Αθήνα', 'ΑΣΚΤ': 'Αθήνα',
    'ΑΣΠΑΙΤΕ': 'Αθήνα', 'ΠΑ.ΠΕΙ.': 'Πειραιάς', 'ΠΑΝ. ΠΕΙΡΑΙΑ': 'Πειραιάς',
    'ΑΠΘ': 'Θεσσαλονίκη', 'ΠΑΜΑΚ': 'Θεσσαλονίκη', 'ΔΙΠΑΕ': 'Θεσσαλονίκη',
    'ΠΑΝ. ΠΑΤΡΩΝ': 'Πάτρα', 'ΠΑΝ.ΠΑΤΡΩΝ': 'Πάτρα',
    'ΠΑΝ. ΙΩΑΝΝΙΝΩΝ': 'Ιωάννινα', 'ΠΑΝ.ΙΩΑΝ': 'Ιωάννινα',
    'ΠΑΝ. ΚΡΗΤΗΣ': 'Ηράκλειο', 'ΠΟΛΥΤΕΧΝΕΙΟ ΚΡΗΤΗΣ': 'Χανιά',
    'ΔΠΘ': 'Κομοτηνή', 'ΠΑΝ. ΘΕΣΣΑΛΙΑΣ': 'Λάρισα/Βόλος',
    'ΠΑΝ.ΘΕΣΣΑΛΙΑΣ': 'Λάρισα/Βόλος',
    'ΕΛΜΕΠΑ': 'Λευκωσία', 'ΙΟΝΙΟ ΠΑΝ.': 'Κέρκυρα',
    'ΠΑΝ. ΑΙΓΑΙΟΥ': 'Μυτιλήνη', 'ΠΑΝ. ΠΕΛΟΠ.': 'Κόρινθος',
    'ΠΑΝ. ΔΥΤ. ΜΑΚ.': 'Κοζάνη', 'ΠΑΝ.ΔΥΤ.ΜΑΚ.': 'Κοζάνη',
    'ΣΣΑΣ': 'Βάρη Αττικής',
  };
  
  // Exact match first
  if (cityMap[inst]) return cityMap[inst];
  
  // Partial match
  for (const [key, city] of Object.entries(cityMap)) {
    if (inst.includes(key)) return city;
  }
  
  return 'Αλλού';
}

// Parse a single line of TAB-separated format (fields 1, 2, 3)
function parseTabLine(line, fieldId, idCounter) {
  const parts = line.split('\t');
  if (parts.length < 2) return null;
  
  const rawName = parts[0].trim();
  const baseStr = parts[1]?.trim().replace('.', '').replace(',', '.') || '0';
  const ebeStr = parts[2]?.trim() || '';
  
  const base2025 = parseInt(baseStr, 10);
  if (isNaN(base2025) || base2025 === 0) return null;
  
  const { name, institution } = parseNameAndInstitution(rawName);
  const { mainEbe, specialReqs } = parseEBE(ebeStr);
  const coeffs = findCoeffs(name, fieldId);
  const city = getCityFromInstitution(institution);
  
  return {
    id: `f${fieldId}_${idCounter}`,
    name,
    institution,
    city,
    fieldId,
    base2025,
    ebe: mainEbe,
    coeffs,
    specialRequirements: specialReqs,
  };
}

// Parse a single line of PIPE-separated format (field 4)
function parsePipeLine(line, fieldId, idCounter) {
  const parts = line.split('|').map(s => s.trim());
  if (parts.length < 2) return null;
  
  const rawName = parts[0].trim();
  const baseStr = parts[1]?.trim().replace('.', '').replace(',', '.') || '0';
  const ebeStr = parts[2]?.trim() || '';
  
  // Skip header lines and lines with dash as base
  if (baseStr === '-' || rawName === 'Σχολή (Πανεπιστήμιο)' || rawName === 'Σχολή') return null;
  
  const base2025 = parseInt(baseStr, 10);
  if (isNaN(base2025) || base2025 === 0) return null;
  
  const { name, institution } = parseNameAndInstitution(rawName);
  const { mainEbe, specialReqs } = parseEBE(ebeStr);
  const coeffs = findCoeffs(name, fieldId);
  const city = getCityFromInstitution(institution);
  
  return {
    id: `f${fieldId}_${idCounter}`,
    name,
    institution,
    city,
    fieldId,
    base2025,
    ebe: mainEbe,
    coeffs,
    specialRequirements: specialReqs,
  };
}

const FILES = [
  { filename: '1ο πεδιο(ανθρωπιστικα).txt', fieldId: 1, format: 'tab', hasHeader: false },
  { filename: '2ο πεδιο(θετικη).txt', fieldId: 2, format: 'tab', hasHeader: true },
  { filename: '3ο πεδιο(υγειασ).txt', fieldId: 3, format: 'tab', hasHeader: false },
  { filename: '4ο πεδιο(οικονομικα).txt', fieldId: 4, format: 'pipe', hasHeader: true },
];

// Create output directory
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

let totalCount = 0;

for (const file of FILES) {
  const inputPath = path.join(BASEIS_DIR, file.filename);
  const outputPath = path.join(OUT_DIR, `bases-2025-field-${file.fieldId}.json`);
  
  const content = fs.readFileSync(inputPath, 'utf-8');
  const lines = content.split('\n').map(l => l.replace(/\r/g, '').trim()).filter(Boolean);
  
  const results = [];
  let idCounter = 1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip header lines
    if (file.hasHeader && i === 0) continue;
    // Skip repeated headers inside file 4
    if (line.startsWith('Σχολή (Πανεπιστήμιο)') || line.startsWith('Σχολή')) continue;
    
    let entry = null;
    if (file.format === 'tab') {
      entry = parseTabLine(line, file.fieldId, idCounter);
    } else {
      entry = parsePipeLine(line, file.fieldId, idCounter);
    }
    
    if (entry) {
      results.push(entry);
      idCounter++;
    }
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`✅ Field ${file.fieldId}: ${results.length} schools → ${outputPath}`);
  totalCount += results.length;
}

console.log(`\n🎉 Done! Total: ${totalCount} schools converted.`);
