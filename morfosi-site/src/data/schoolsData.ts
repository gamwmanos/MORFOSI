export interface Faculty {
  id: string;
  name: string;
  institution: string;
  city: string;
  fieldId: number;
  base2023: number;
  coeffs: {
    s1: number;
    s2: number;
    s3: number;
    s4: number;
  };
  specialRequirements?: string[];
}

export const FACULTIES: Faculty[] = [
  // --- 1Ο ΠΕΔΙΟ (ΑΝΘΡΩΠΙΣΤΙΚΩΝ) ---
  { id: "101", name: "Νομικής", institution: "ΕΚΠΑ", city: "Αθήνα", fieldId: 1, base2023: 18125, coeffs: { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 } },
  { id: "102", name: "Νομικής", institution: "ΑΠΘ", city: "Θεσσαλονίκη", fieldId: 1, base2023: 17650, coeffs: { s1: 0.22, s2: 0.28, s3: 0.25, s4: 0.25 } },
  { id: "103", name: "Νομικής", institution: "ΔΠΘ", city: "Κομοτηνή", fieldId: 1, base2023: 16900, coeffs: { s1: 0.20, s2: 0.30, s3: 0.20, s4: 0.30 } },
  { id: "104", name: "Ψυχολογίας", institution: "ΕΚΠΑ", city: "Αθήνα", fieldId: 1, base2023: 17850, coeffs: { s1: 0.30, s2: 0.20, s3: 0.30, s4: 0.20 } },
  { id: "105", name: "Ψυχολογίας", institution: "Πάντειο", city: "Αθήνα", fieldId: 1, base2023: 17230, coeffs: { s1: 0.30, s2: 0.20, s3: 0.30, s4: 0.20 } },
  { id: "106", name: "Ψυχολογίας", institution: "ΑΠΘ", city: "Θεσσαλονίκη", fieldId: 1, base2023: 17100, coeffs: { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 } },
  { id: "107", name: "Ψυχολογίας", institution: "Παν. Ιωαννίνων", city: "Ιωάννινα", fieldId: 1, base2023: 16800, coeffs: { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 } },
  { id: "108", name: "Ψυχολογίας", institution: "Παν. Κρήτης", city: "Ρέθυμνο", fieldId: 1, base2023: 16500, coeffs: { s1: 0.30, s2: 0.20, s3: 0.25, s4: 0.25 } },
  { id: "109", name: "Φιλολογίας", institution: "ΕΚΠΑ", city: "Αθήνα", fieldId: 1, base2023: 13900, coeffs: { s1: 0.20, s2: 0.30, s3: 0.20, s4: 0.30 } },
  { id: "110", name: "Φιλολογίας", institution: "ΑΠΘ", city: "Θεσσαλονίκη", fieldId: 1, base2023: 13100, coeffs: { s1: 0.20, s2: 0.30, s3: 0.20, s4: 0.30 } },
  { id: "111", name: "Φιλολογίας", institution: "Παν. Κρήτης", city: "Ρέθυμνο", fieldId: 1, base2023: 11500, coeffs: { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 } },
  { id: "112", name: "Φιλολογίας", institution: "Παν. Πειραιά", city: "Πειραιάς", fieldId: 1, base2023: 14200, coeffs: { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 } },
  { id: "113", name: "Αγγλικής Γλώσσας και Φιλολογίας", institution: "ΕΚΠΑ", city: "Αθήνα", fieldId: 1, base2023: 17800, coeffs: { s1: 0.30, s2: 0.20, s3: 0.20, s4: 0.30 }, specialRequirements: ["Αγγλικά"] },
  { id: "114", name: "Αγγλικής Γλώσσας και Φιλολογίας", institution: "ΑΠΘ", city: "Θεσσαλονίκη", fieldId: 1, base2023: 17100, coeffs: { s1: 0.30, s2: 0.20, s3: 0.20, s4: 0.30 }, specialRequirements: ["Αγγλικά"] },
  { id: "115", name: "Ιστορίας και Αρχαιολογίας", institution: "ΕΚΠΑ", city: "Αθήνα", fieldId: 1, base2023: 12850, coeffs: { s1: 0.25, s2: 0.25, s3: 0.30, s4: 0.20 } },
  { id: "116", name: "Ιστορίας και Αρχαιολογίας", institution: "ΑΠΘ", city: "Θεσσαλονίκη", fieldId: 1, base2023: 12200, coeffs: { s1: 0.25, s2: 0.25, s3: 0.30, s4: 0.20 } },
  { id: "117", name: "Παιδαγωγικό Δημοτικής Εκπαίδευσης", institution: "ΕΚΠΑ", city: "Αθήνα", fieldId: 1, base2023: 16100, coeffs: { s1: 0.30, s2: 0.20, s3: 0.30, s4: 0.20 } },
  { id: "118", name: "Παιδαγωγικό Δημοτικής Εκπαίδευσης", institution: "ΑΠΘ", city: "Θεσσαλονίκη", fieldId: 1, base2023: 15400, coeffs: { s1: 0.30, s2: 0.25, s3: 0.25, s4: 0.20 } },
  
  // --- 2Ο ΠΕΔΙΟ (ΘΕΤΙΚΩΝ & ΤΕΧΝΟΛΟΓΙΚΩΝ) ---
  { id: "201", name: "Ηλεκτρολόγων Μηχανικών & Μηχ. Υπολογιστών", institution: "ΕΜΠ", city: "Αθήνα", fieldId: 2, base2023: 18820, coeffs: { s1: 0.20, s2: 0.25, s3: 0.20, s4: 0.35 } },
  { id: "202", name: "Ηλεκτρολόγων Μηχανικών & Μηχ. Υπολογιστών", institution: "ΑΠΘ", city: "Θεσσαλονίκη", fieldId: 2, base2023: 17950, coeffs: { s1: 0.20, s2: 0.25, s3: 0.20, s4: 0.35 } },
  { id: "203", name: "Μηχανολόγων Μηχανικών", institution: "ΕΜΠ", city: "Αθήνα", fieldId: 2, base2023: 18450, coeffs: { s1: 0.20, s2: 0.30, s3: 0.20, s4: 0.30 } },
  { id: "204", name: "Μηχανολόγων Μηχανικών", institution: "ΑΠΘ", city: "Θεσσαλονίκη", fieldId: 2, base2023: 17300, coeffs: { s1: 0.20, s2: 0.30, s3: 0.20, s4: 0.30 } },
  { id: "205", name: "Αρχιτεκτόνων Μηχανικών", institution: "ΕΜΠ", city: "Αθήνα", fieldId: 2, base2023: 19950, coeffs: { s1: 0.25, s2: 0.25, s3: 0.20, s4: 0.30 }, specialRequirements: ["Ελεύθερο Σχέδιο", "Γραμμικό Σχέδιο"] },
  { id: "206", name: "Χημικών Μηχανικών", institution: "ΕΜΠ", city: "Αθήνα", fieldId: 2, base2023: 17750, coeffs: { s1: 0.20, s2: 0.25, s3: 0.35, s4: 0.20 } },
  { id: "207", name: "Πολιτικών Μηχανικών", institution: "ΕΜΠ", city: "Αθήνα", fieldId: 2, base2023: 16800, coeffs: { s1: 0.20, s2: 0.30, s3: 0.20, s4: 0.30 } },
  { id: "208", name: "Πληροφορικής & Τηλεπικοινωνιών", institution: "ΕΚΠΑ", city: "Αθήνα", fieldId: 2, base2023: 17600, coeffs: { s1: 0.20, s2: 0.25, s3: 0.20, s4: 0.35 } },
  { id: "209", name: "Πληροφορικής", institution: "ΑΠΘ", city: "Θεσσαλονίκη", fieldId: 2, base2023: 16900, coeffs: { s1: 0.20, s2: 0.25, s3: 0.20, s4: 0.35 } },
  { id: "210", name: "Φυσικής", institution: "ΕΚΠΑ", city: "Αθήνα", fieldId: 2, base2023: 15400, coeffs: { s1: 0.20, s2: 0.35, s3: 0.20, s4: 0.25 } },
  { id: "211", name: "Φυσικής", institution: "ΑΠΘ", city: "Θεσσαλονίκη", fieldId: 2, base2023: 14700, coeffs: { s1: 0.20, s2: 0.35, s3: 0.20, s4: 0.25 } },
  { id: "212", name: "Μαθηματικών", institution: "ΕΚΠΑ", city: "Αθήνα", fieldId: 2, base2023: 14100, coeffs: { s1: 0.20, s2: 0.20, s3: 0.20, s4: 0.40 } },
  { id: "213", name: "Μαθηματικών", institution: "ΑΠΘ", city: "Θεσσαλονίκη", fieldId: 2, base2023: 13500, coeffs: { s1: 0.20, s2: 0.20, s3: 0.20, s4: 0.40 } },
  { id: "214", name: "Χημείας", institution: "ΕΚΠΑ", city: "Αθήνα", fieldId: 2, base2023: 16300, coeffs: { s1: 0.20, s2: 0.20, s3: 0.40, s4: 0.20 } },
  
  // --- 3Ο ΠΕΔΙΟ (ΕΠΙΣΤΗΜΩΝ ΥΓΕΙΑΣ) ---
  { id: "301", name: "Ιατρικής", institution: "ΕΚΠΑ", city: "Αθήνα", fieldId: 3, base2023: 19000, coeffs: { s1: 0.20, s2: 0.25, s3: 0.25, s4: 0.30 } },
  { id: "302", name: "Ιατρικής", institution: "ΑΠΘ", city: "Θεσσαλονίκη", fieldId: 3, base2023: 18750, coeffs: { s1: 0.20, s2: 0.25, s3: 0.25, s4: 0.30 } },
  { id: "303", name: "Ιατρικής", institution: "Παν. Πατρών", city: "Πάτρα", fieldId: 3, base2023: 18550, coeffs: { s1: 0.20, s2: 0.25, s3: 0.25, s4: 0.30 } },
  { id: "304", name: "Ιατρικής", institution: "Παν. Ιωαννίνων", city: "Ιωάννινα", fieldId: 3, base2023: 18450, coeffs: { s1: 0.20, s2: 0.25, s3: 0.25, s4: 0.30 } },
  { id: "305", name: "Ιατρικής", institution: "Παν. Κρήτης", city: "Ηράκλειο", fieldId: 3, base2023: 18400, coeffs: { s1: 0.20, s2: 0.25, s3: 0.25, s4: 0.30 } },
  { id: "306", name: "Οδοντιατρικής", institution: "ΕΚΠΑ", city: "Αθήνα", fieldId: 3, base2023: 18200, coeffs: { s1: 0.20, s2: 0.25, s3: 0.25, s4: 0.30 } },
  { id: "307", name: "Οδοντιατρικής", institution: "ΑΠΘ", city: "Θεσσαλονίκη", fieldId: 3, base2023: 18050, coeffs: { s1: 0.20, s2: 0.25, s3: 0.25, s4: 0.30 } },
  { id: "308", name: "Φαρμακευτικής", institution: "ΕΚΠΑ", city: "Αθήνα", fieldId: 3, base2023: 17850, coeffs: { s1: 0.20, s2: 0.20, s3: 0.35, s4: 0.25 } },
  { id: "309", name: "Φαρμακευτικής", institution: "ΑΠΘ", city: "Θεσσαλονίκη", fieldId: 3, base2023: 17600, coeffs: { s1: 0.20, s2: 0.20, s3: 0.35, s4: 0.25 } },
  { id: "310", name: "Κτηνιατρικής", institution: "ΑΠΘ", city: "Θεσσαλονίκη", fieldId: 3, base2023: 17350, coeffs: { s1: 0.20, s2: 0.20, s3: 0.30, s4: 0.30 } },
  { id: "311", name: "Βιολογίας", institution: "ΕΚΠΑ", city: "Αθήνα", fieldId: 3, base2023: 17400, coeffs: { s1: 0.20, s2: 0.20, s3: 0.30, s4: 0.30 } },
  { id: "312", name: "Βιολογίας", institution: "ΑΠΘ", city: "Θεσσαλονίκη", fieldId: 3, base2023: 16900, coeffs: { s1: 0.20, s2: 0.20, s3: 0.30, s4: 0.30 } },
  { id: "313", name: "Βιολογίας", institution: "Παν. Κρήτης", city: "Ηράκλειο", fieldId: 3, base2023: 16200, coeffs: { s1: 0.20, s2: 0.20, s3: 0.30, s4: 0.30 } },
  { id: "314", name: "Νοσηλευτικής", institution: "ΕΚΠΑ", city: "Αθήνα", fieldId: 3, base2023: 14500, coeffs: { s1: 0.25, s2: 0.20, s3: 0.25, s4: 0.30 } },
  { id: "315", name: "Φυσικοθεραπείας", institution: "ΠΑΔΑ", city: "Αθήνα", fieldId: 3, base2023: 16250, coeffs: { s1: 0.25, s2: 0.20, s3: 0.25, s4: 0.30 } },

  // --- 4Ο ΠΕΔΙΟ (ΟΙΚΟΝΟΜΙΑΣ & ΠΛΗΡΟΦΟΡΙΚΗΣ) ---
  { id: "401", name: "Πληροφορικής", institution: "ΟΠΑ", city: "Αθήνα", fieldId: 4, base2023: 17200, coeffs: { s1: 0.20, s2: 0.35, s3: 0.25, s4: 0.20 } },
  { id: "402", name: "Πληροφορικής", institution: "ΑΠΘ", city: "Θεσσαλονίκη", fieldId: 4, base2023: 16400, coeffs: { s1: 0.20, s2: 0.35, s3: 0.25, s4: 0.20 } },
  { id: "403", name: "Εφαρμοσμένης Πληροφορικής", institution: "ΠΑΜΑΚ", city: "Θεσσαλονίκη", fieldId: 4, base2023: 15900, coeffs: { s1: 0.20, s2: 0.35, s3: 0.25, s4: 0.20 } },
  { id: "404", name: "Διοικητικής Επιστήμης & Τεχνολογίας", institution: "ΟΠΑ", city: "Αθήνα", fieldId: 4, base2023: 17950, coeffs: { s1: 0.20, s2: 0.35, s3: 0.20, s4: 0.25 } },
  { id: "405", name: "Οικονομικής Επιστήμης", institution: "ΟΠΑ", city: "Αθήνα", fieldId: 4, base2023: 15300, coeffs: { s1: 0.20, s2: 0.25, s3: 0.20, s4: 0.35 } },
  { id: "406", name: "Οικονομικών Επιστημών", institution: "ΑΠΘ", city: "Θεσσαλονίκη", fieldId: 4, base2023: 14500, coeffs: { s1: 0.20, s2: 0.25, s3: 0.20, s4: 0.35 } },
  { id: "407", name: "Οικονομικών Επιστημών", institution: "ΠΑΜΑΚ", city: "Θεσσαλονίκη", fieldId: 4, base2023: 14100, coeffs: { s1: 0.20, s2: 0.25, s3: 0.20, s4: 0.35 } },
  { id: "408", name: "Οργάνωσης και Διοίκησης Επιχειρήσεων", institution: "ΟΠΑ", city: "Αθήνα", fieldId: 4, base2023: 16100, coeffs: { s1: 0.20, s2: 0.30, s3: 0.20, s4: 0.30 } },
  { id: "409", name: "Λογιστικής και Χρηματοοικονομικής", institution: "ΟΠΑ", city: "Αθήνα", fieldId: 4, base2023: 15800, coeffs: { s1: 0.20, s2: 0.30, s3: 0.20, s4: 0.30 } },
  { id: "410", name: "Λογιστικής και Χρηματοοικονομικής", institution: "ΠΑΜΑΚ", city: "Θεσσαλονίκη", fieldId: 4, base2023: 14900, coeffs: { s1: 0.20, s2: 0.30, s3: 0.20, s4: 0.30 } },
  { id: "411", name: "Ναυτιλιακών Σπουδών", institution: "Παν. Πειραιά", city: "Πειραιάς", fieldId: 4, base2023: 14800, coeffs: { s1: 0.25, s2: 0.20, s3: 0.25, s4: 0.30 } },
  { id: "412", name: "Τουριστικών Σπουδών", institution: "Παν. Πειραιά", city: "Πειραιάς", fieldId: 4, base2023: 13500, coeffs: { s1: 0.25, s2: 0.20, s3: 0.25, s4: 0.30 } },
  { id: "413", name: "Μάρκετινγκ & Επικοινωνίας", institution: "ΟΠΑ", city: "Αθήνα", fieldId: 4, base2023: 15750, coeffs: { s1: 0.25, s2: 0.25, s3: 0.20, s4: 0.30 } },
  { id: "414", name: "Πληροφορικής με Εφαρμογές στη Βιοϊατρική", institution: "Παν. Θεσσαλίας", city: "Λαμία", fieldId: 4, base2023: 13900, coeffs: { s1: 0.20, s2: 0.30, s3: 0.30, s4: 0.20 } },
  { id: "415", name: "Λογιστικής και Χρηματοοικονομικής", institution: "Παν. Δυτ. Αττικής", city: "Αθήνα", fieldId: 4, base2023: 12500, coeffs: { s1: 0.25, s2: 0.20, s3: 0.25, s4: 0.30 } },
  { id: "416", name: "Διοίκησης Επιχειρήσεων", institution: "Παν. Πατρών", city: "Πάτρα", fieldId: 4, base2023: 11800, coeffs: { s1: 0.25, s2: 0.20, s3: 0.25, s4: 0.30 } },
  { id: "417", name: "Οικονομικών Επιστημών", institution: "Παν. Κρήτης", city: "Ρέθυμνο", fieldId: 4, base2023: 11200, coeffs: { s1: 0.25, s2: 0.25, s3: 0.25, s4: 0.25 } },

  // --- ΕΞΤΡΑ ΣΧΟΛΕΣ (ΠΕΔΙΟ 1) ---
  { id: "119", name: "Κοινωνιολογίας", institution: "Πάντειο", city: "Αθήνα", fieldId: 1, base2023: 15100, coeffs: { s1: 0.30, s2: 0.20, s3: 0.25, s4: 0.25 } },
  { id: "120", name: "Θεατρικών Σπουδών", institution: "ΕΚΠΑ", city: "Αθήνα", fieldId: 1, base2023: 12200, coeffs: { s1: 0.30, s2: 0.20, s3: 0.30, s4: 0.20 } },

  // --- ΕΞΤΡΑ ΣΧΟΛΕΣ (ΠΕΔΙΟ 2) ---
  { id: "215", name: "Γεωπονίας", institution: "ΑΠΘ", city: "Θεσσαλονίκη", fieldId: 2, base2023: 12600, coeffs: { s1: 0.20, s2: 0.20, s3: 0.30, s4: 0.30 } },
  { id: "216", name: "Επιστήμης Υπολογιστών", institution: "Παν. Κρήτης", city: "Ηράκλειο", fieldId: 2, base2023: 15800, coeffs: { s1: 0.20, s2: 0.25, s3: 0.20, s4: 0.35 } }
];
