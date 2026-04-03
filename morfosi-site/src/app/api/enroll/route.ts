import { NextResponse } from "next/server";
import { z } from "zod";

// --- Rate Limiting (Μέγιστο 6 το λεπτό ανά IP) ---
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 6; 
const WINDOW_MS = 60 * 1000; 

function applyRateLimit(ip: string): boolean {
  const now = Date.now();
  const userData = rateLimitMap.get(ip);

  if (!userData) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true; 
  }
  if (now - userData.lastReset > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true; 
  }
  if (userData.count >= RATE_LIMIT) {
    return false; // ΜΠΛΟΚΑΡΙΣΜΑ
  }
  
  userData.count += 1;
  return true;
}

// --- Input Validation (Sanitization) ---
const enrollSchema = z.object({
  studentName: z.string().min(2, "Το όνομα μαθητή είναι πολύ μικρό").max(100),
  studentClass: z.string().min(1, "Επιλέξτε τάξη"),
  dateOfBirth: z.string().optional().or(z.literal("")),
  school: z.string().max(100).optional().or(z.literal("")),
  parentName: z.string().min(2, "Το όνομα κηδεμόνα είναι πολύ μικρό").max(100),
  parentPhone: z.string().min(8, "Μη έγκυρο τηλέφωνο").max(20),
  parentEmail: z.string().email("Μη έγκυρο email"),
  parentRelation: z.string().default("Γονέας"),
  program: z.string().min(1, "Επιλέξτε πρόγραμμα"),
  previousGrade: z.string().max(10).optional().or(z.literal("")),
  howFound: z.string().optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
  agreeTerms: z.boolean().refine(val => val === true, "Πρέπει να συμφωνήσετε με τους όρους"),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    
    // Έλεγχος Spammers (Rate Limiting)
    if (!applyRateLimit(ip)) {
      return NextResponse.json(
        { error: "Έχετε υπερβεί το όριο των 6 αιτήσεων. Δοκιμάστε ξανά σε 1 λεπτό." },
        { status: 429 }
      );
    }

    // Διαβάζουμε και ελέγχουμε αυστηρά τα δεδομένα
    const body = await req.json();
    const validatedData = enrollSchema.parse(body);

    console.log("Λάβαμε Ασφαλή Αίτηση Εγγραφής:", validatedData);
    
    // Εδώ στο μέλλον μπορούμε να τα στέλνουμε στο Supabase ή σε Email
    await new Promise(r => setTimeout(r, 600)); // Προσομοίωση αποθήκευσης

    return NextResponse.json({ success: true, message: "Η αίτηση αποθηκεύτηκε επιτυχώς" }, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Μη έγκυρα δεδομένα συμπλήρωσης", details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: "Εσωτερικό σφάλμα διακομιστή" }, { status: 500 });
  }
}
