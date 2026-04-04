/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
/**
 * parse-and-update-coefficients.js
 * 
 * Reads the scraped ΦΕΚ coefficient data, parses school entries,
 * and updates the bases-2025-field-X.json files with correct coefficients.
 * 
 * Structure of scraped data (content.md lines 367+):
 *   INSTITUTION
 *   CODE
 *   SCHOOL_NAME (optional)
 *   PCT% ... (4 per field the school participates in)
 *   ...next school...
 */

const fs = require("fs");
const path = require("path");

// ─── Paths ────────────────────────────────────────────────────────────────────
const CONTENT_PATH = "C:\\Users\\chron\\.gemini\\antigravity\\brain\\96dc1621-4a41-440f-ac47-9757eec59fcc\\.system_generated\\steps\\366\\content.md";
const DATA_DIR = path.join("D:", "MORFOSI", "morfosi-site", "public", "data");

const JSON_FILES = {
  1: path.join(DATA_DIR, "bases-2025-field-1.json"),
  2: path.join(DATA_DIR, "bases-2025-field-2.json"),
  3: path.join(DATA_DIR, "bases-2025-field-3.json"),
  4: path.join(DATA_DIR, "bases-2025-field-4.json"),
};

// ─── Institution name normalization map ──────────────────────────────────────
// Maps scraped abbreviations → JSON institution names (partial match ok)
const INST_MAP = {
  "ΑΕΝ": ["ΑΕΝ"],
  "ΑΕΑ ΑΘΗΝΑΣ": ["ΑΕΑ"],
  "ΑΠΘ": ["ΑΠΘ"],
  "ΑΣΚΤ": ["ΑΣΚΤ"],
  "ΑΣΠΑΙΤΕ": ["ΑΣΠΑΙΤΕ"],
  "ΑΣΤ. ΣΧΟΛΕΣ": ["ΑΣΤ"],
  "ΑΣΤΕ": ["ΑΣΤΕ"],
  "ΔΙ.ΠΑ.Ε.": ["ΔΙ.ΠΑ.Ε", "ΔΙΠΑΕ"],
  "ΔΠΘ": ["ΔΠΘ"],
  "ΕΚΠΑ": ["ΕΚΠΑ"],
  "ΕΛΜΕΠΑ": ["ΕΛΜΕΠΑ"],
  "ΕΜΠ": ["ΕΜΠ", "ΠΟΛΥΤΕΧΝΕΙΟ"],
  "ΙΟΝΙΟ ΠΑΝ.": ["ΙΟΝΙΟ"],
  "ΟΠΑ": ["ΟΠΑ", "ΟΙΚΟΝΟΜΙΚΟ ΑΘΗΝΩΝ"],
  "ΠΑΜΑΚ": ["ΠΑΜΑΚ"],
  "ΠΑΝΤΕΙΟ": ["ΠΑΝΤΕΙΟ"],
  "ΠΑΝ.ΑΙΓΑΙΟΥ": ["ΑΙΓΑΙΟΥ", "ΠΑΝ.ΑΙΓΑΙΟΥ"],
  "ΠΑΝ.ΔΥΤ.ΑΤΤΙΚΗΣ": ["ΔΥΤ.ΑΤΤΙΚΗΣ", "ΠΑΔΑ"],
  "ΠΑΝ.ΘΕΣΣΑΛΙΑΣ": ["ΘΕΣΣΑΛΙΑΣ"],
  "ΠΑΝ.ΙΩΑΝΝΙΝΩΝ": ["ΙΩΑΝ"],
  "ΠΑΝ.ΚΡΗΤΗΣ": ["ΚΡΗΤΗΣ"],
  "ΠΑΝ.ΜΑΚΕΔΟΝΙΑΣ": ["ΜΑΚΕΔΟΝΙΑΣ"],
  "ΠΑΝ.ΠΑΤΡΩΝ": ["ΠΑΤΡΩΝ"],
  "ΠΑΝ.ΠΕΛΟΠΟΝΝΗΣΟΥ": ["ΠΕΛΟΠΟΝΝΗΣΟΥ"],
  "ΠΑ.ΠΕΙ.": ["ΠΕΙΡΑΙΩΣ", "ΠΑ.ΠΕΙ"],
  "ΠΟΛΥΤΕΧΝΕΙΟ ΚΡΗΤΗΣ": ["ΠΟΛΥΤΕΧΝΕΙΟ ΚΡΗΤΗΣ"],
  "ΣΣΑΣ": ["ΣΣΑΣ"],
};

// ─── Known field assignment for school codes ──────────────────────────────────
// field order in ΦΕΚ: 1=Humanities, 2=Sciences/Tech, 3=Health, 4=Economics/IT
// When a school has N*4 percentages, the mapping depends on which fields it's in
// Most schools are in 1 field → easy
// Multi-field schools need special handling

const FIELD_ORDER = [1, 2, 3, 4];

// ─── Parse scraped content ────────────────────────────────────────────────────
function parsePct(str) {
  const n = parseFloat(str.replace("%", ""));
  return isNaN(n) ? null : n / 100;
}

function isInstitution(line) {
  // Institution lines: ALL CAPS, no digits, not a percentage
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (trimmed.includes("%")) return false;
  if (/^\d+$/.test(trimmed)) return false;
  // Known institutions
  const knownInsts = ["ΑΕΝ", "ΑΕΑ", "ΑΠΘ", "ΑΣΚΤ", "ΑΣΠΑΙΤΕ", "ΑΣΤ. ΣΧΟΛΕΣ", "ΑΣΤΕ",
    "ΔΙ.ΠΑ.Ε.", "ΔΠΘ", "ΕΚΠΑ", "ΕΛΜΕΠΑ", "ΕΜΠ", "ΙΟΝΙΟ", "ΙΟΝΙΟ ΠΑΝ.",
    "ΟΠΑ", "ΠΑΜΑΚ", "ΠΑΝΤΕΙΟ", "ΠΑΝ.ΑΙΓΑΙΟΥ", "ΠΑΝ.ΔΥΤ.ΑΤΤΙΚΗΣ",
    "ΠΑΝ.ΘΕΣΣΑΛΙΑΣ", "ΠΑΝ.ΙΩΑΝΝΙΝΩΝ", "ΠΑΝ.ΚΡΗΤΗΣ", "ΠΑΝ.ΜΑΚΕΔΟΝΙΑΣ",
    "ΠΑΝ.ΠΑΤΡΩΝ", "ΠΑΝ.ΠΕΛΟΠΟΝΝΗΣΟΥ", "ΠΑ.ΠΕΙ.", "ΠΟΛΥΤΕΧΝΕΙΟ ΚΡΗΤΗΣ",
    "ΣΣΑΣ", "ΕΛΕΛΣΝΛ", "ΣΣΑΣΑ", "ΣΠΑ", "ΣΤΕΦ", "ΤΕΙ", "ΑΣΕΙ", "ΑΣΣΥ"];
  return knownInsts.some(inst => trimmed.startsWith(inst) || trimmed === inst);
}

function isCode(line) {
  return /^\d{3,4}$/.test(line.trim());
}

function isPct(line) {
  return /^\d{1,3}%$/.test(line.trim());
}

function parseContent(content) {
  const lines = content.split("\n").map(l => l.trim()).filter(l => l);
  
  // Find "ΠΙΝΑΚΑΣ Β" start
  let startIdx = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("ΠΙΝΑΚΑΣ Β") || lines[i].includes("ΟΝΟΜΑ ΣΧΟΛΗΣ")) {
      startIdx = i + 1;
      break;
    }
  }

  const schools = [];
  let currentInst = "";
  let currentCode = "";
  let currentName = "";
  let currentPcts = [];
  let state = "INIT"; // INIT, IN_SCHOOL

  function flushSchool() {
    if (currentCode && currentPcts.length >= 4) {
      schools.push({
        institution: currentInst,
        code: currentCode,
        name: currentName,
        pcts: [...currentPcts],
      });
    }
    currentCode = "";
    currentName = "";
    currentPcts = [];
  }

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    
    if (!line || line.includes("ΕΦΗΜΕΡΙΔΑ") || line.includes("ΑριθμΦ") || 
        line.includes("ΚΥΒΕΡΝΗΣΕΩΣ") || line.match(/^\d{2}$/)) {
      continue;
    }
    
    // Skip header lines
    if (line.includes("ΙΔΡΥΜΑ") || line.includes("ΚΩΔ. ΣΧΟΛΗΣ") || 
        line.includes("ΟΝΟΜΑ ΣΧΟΛΗΣ") || line.includes("ΕΙΔΙΚΟ") || 
        line.includes("ΜΟΥΣΙΚΟ ΜΑΘΗΜΑ") || line.includes("ΠΡΑΚΤΙΚΕΣ ΔΟΚΙΜΑΣΙΕΣ") ||
        line.includes("ΑΝΘΡΩΠΙΣΤΙΚΕΣ") || line.includes("ΤΕΧΝΟΛΟΓΙΚΕΣ ΕΠΙΣΤΗΜΕΣ") ||
        line.includes("ΕΠΙΣΤΗΜΕΣ ΥΓΕΙΑΣ") || line.includes("ΕΠΙΣΤΗΜΕΣ ΟΙΚΟΝΟΜΙΑΣ") ||
        line.includes("ΖΩΗΣ") || line.includes("ΠΛΗΡΟΦΟΡΙΚΗΣ") ||
        line.includes("ΝΟΜΙΚΕΣ") || line.includes("ΚΟΙΝΩΝΙΚΕΣ") ||
        line.includes("ΕΠΙΣΤΗΜΟΝΙΚΟ ΠΕΔΙΟ")) {
      continue;
    }

    if (isInstitution(line)) {
      flushSchool();
      currentInst = line;
      continue;
    }

    if (isCode(line)) {
      if (currentCode) {
        flushSchool();
      }
      currentCode = line;
      currentName = "";
      currentPcts = [];
      continue;
    }

    if (isPct(line)) {
      currentPcts.push(parsePct(line));
      continue;
    }

    // Must be a name fragment
    if (currentCode && !isPct(line)) {
      currentName += (currentName ? " " : "") + line;
    }
  }
  flushSchool();

  return schools;
}

// ─── Normalize text for matching ──────────────────────────────────────────────
function normalize(str) {
  return str
    .toUpperCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^Α-ΩA-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Institution abbreviation matching ───────────────────────────────────────
function matchInstitution(scrapedInst, jsonInst) {
  const n1 = normalize(scrapedInst);
  const n2 = normalize(jsonInst);
  
  // Direct partial match
  if (n1.startsWith(n2) || n2.startsWith(n1)) return true;
  if (n1.includes(n2) || n2.includes(n1)) return true;
  
  // Check known mappings
  const mappedParts = INST_MAP[scrapedInst] || [];
  for (const part of mappedParts) {
    if (n2.includes(normalize(part))) return true;
  }
  
  return false;
}

// ─── School name matching ─────────────────────────────────────────────────────
function nameScore(scrapedName, jsonName) {
  if (!scrapedName) return 0;
  const n1 = normalize(scrapedName);
  const n2 = normalize(jsonName);
  
  if (!n1 || !n2) return 0;
  
  // Count common words
  const words1 = new Set(n1.split(" ").filter(w => w.length > 3));
  const words2 = new Set(n2.split(" ").filter(w => w.length > 3));
  
  let common = 0;
  for (const w of words1) {
    if (words2.has(w)) common++;
  }
  
  const total = new Set([...words1, ...words2]).size;
  return total > 0 ? common / total : 0;
}

// ─── Assign coefficients from percentages array ───────────────────────────────
// Given percentages array and the JSON entry's fieldId,
// determine which 4 percentages to use.
// Strategy: percentages are in field order 1→2→3→4 (only for fields school is in)
// Since we don't know exactly which fields, we use heuristic:
// - 4 pcts → directly use them
// - 8 pcts → school is in 2 adjacent fields; use based on JSON fieldId position
// - 12 pcts → 3 fields; similar
// - 16 pcts → all 4 fields; use index based on fieldId-1
function getCoeffsForField(pcts, fieldId) {
  const numFields = Math.floor(pcts.length / 4);
  
  if (numFields === 1) {
    // Single field - use all 4
    return { s1: pcts[0], s2: pcts[1], s3: pcts[2], s4: pcts[3] };
  }
  
  if (numFields === 4) {
    // All 4 fields - use fieldId-1 as index
    const idx = (fieldId - 1) * 4;
    return { s1: pcts[idx], s2: pcts[idx+1], s3: pcts[idx+2], s4: pcts[idx+3] };
  }
  
  // For 2 or 3 fields, we need to determine which fields are present
  // Heuristic: use the block closest to the fieldId position
  // For now, use the first block if fieldId <= 2, second if fieldId >= 3
  if (numFields === 2) {
    const idx = fieldId <= 2 ? 0 : 4;
    return { s1: pcts[idx], s2: pcts[idx+1], s3: pcts[idx+2], s4: pcts[idx+3] };
  }
  
  if (numFields === 3) {
    let idx = 0;
    if (fieldId === 2) idx = 4;
    else if (fieldId >= 3) idx = 8;
    return { s1: pcts[idx], s2: pcts[idx+1], s3: pcts[idx+2], s4: pcts[idx+3] };
  }
  
  return null;
}

// ─── Main ────────────────────────────────────────────────────────────────────
function main() {
  console.log("📖 Reading scraped content...");
  const content = fs.readFileSync(CONTENT_PATH, "utf8");
  
  console.log("🔍 Parsing school entries...");
  const schools = parseContent(content);
  console.log(`✅ Found ${schools.length} school entries in scraped data`);
  
  // Build lookup: code → school entry
  const byCode = {};
  for (const s of schools) {
    byCode[s.code] = s;
  }
  
  // Show sample
  console.log("\n📋 Sample parsed entries:");
  schools.slice(0, 10).forEach(s => {
    console.log(`  ${s.institution} | ${s.code} | ${s.name} | [${s.pcts.map(p => (p*100).toFixed(0)+"%").join(", ")}]`);
  });
  
  let totalUpdated = 0;
  let totalMissed = 0;
  
  // Process each JSON file
  for (const [fieldId, jsonPath] of Object.entries(JSON_FILES)) {
    const fid = parseInt(fieldId);
    console.log(`\n═══ Processing Field ${fid} ═══`);
    
    const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    let updatedCount = 0;
    let missedCount = 0;
    
    for (const entry of data) {
      // Try to match this JSON entry against scraped schools
      let bestMatch = null;
      let bestScore = 0;
      
      for (const school of schools) {
        // Check institution match
        if (!matchInstitution(school.institution, entry.institution)) continue;
        
        // Check name match
        const score = nameScore(school.name, entry.name);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = school;
        }
      }
      
      if (bestMatch && bestScore >= 0.4 && bestMatch.pcts.length >= 4) {
        const coeffs = getCoeffsForField(bestMatch.pcts, fid);
        if (coeffs) {
          // Check if it's actually different from current
          const isDiff = 
            Math.abs(coeffs.s1 - entry.coeffs.s1) > 0.001 ||
            Math.abs(coeffs.s2 - entry.coeffs.s2) > 0.001 ||
            Math.abs(coeffs.s3 - entry.coeffs.s3) > 0.001 ||
            Math.abs(coeffs.s4 - entry.coeffs.s4) > 0.001;
          
          if (isDiff) {
            console.log(`  ✏️  ${entry.institution} "${entry.name.slice(0,30)}" score=${bestScore.toFixed(2)}`);
            console.log(`     OLD: ${JSON.stringify(entry.coeffs)}`);
            console.log(`     NEW: ${JSON.stringify(coeffs)} (from code ${bestMatch.code})`);
            entry.coeffs = coeffs;
            updatedCount++;
          }
        }
      } else if (!bestMatch || bestScore < 0.4) {
        missedCount++;
        // console.log(`  ❓ No match: ${entry.institution} "${entry.name}"`);
      }
    }
    
    // Save updated JSON
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), "utf8");
    console.log(`  ✅ Updated ${updatedCount} entries, ${missedCount} unmatched`);
    totalUpdated += updatedCount;
    totalMissed += missedCount;
  }
  
  console.log(`\n🎉 DONE! Total updated: ${totalUpdated}, Total unmatched: ${totalMissed}`);
}

main();
