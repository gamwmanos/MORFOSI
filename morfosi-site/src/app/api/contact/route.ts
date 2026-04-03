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
    return true; // Επιτρέπεται
  }
  if (now - userData.lastReset > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true; // Επιτρέπεται (πέρασε το 1 λεπτό)
  }
  if (userData.count >= RATE_LIMIT) {
    return false; // ΜΠΛΟΚΑΡΙΣΜΑ (Rate Limited)
  }
  
  userData.count += 1;
  return true;
}

// --- Input Validation (Sanitization) ---
const contactSchema = z.object({
  name: z.string().min(2, "Το όνομα είναι πολύ μικρό").max(100),
  phone: z.string().max(20).optional().or(z.literal("")),
  email: z.string().email("Μη έγκυρο email"),
  subject: z.string().min(1, "Επιλέξτε θέμα"),
  message: z.string().min(10, "Το μήνυμα είναι πολύ μικρό").max(5000),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    
    // Έλεγχος Spammers (Rate Limiting)
    if (!applyRateLimit(ip)) {
      return NextResponse.json(
        { error: "Έχετε υπερβεί το όριο των 6 μηνυμάτων. Δοκιμάστε ξανά σε 1 λεπτό." },
        { status: 429 }
      );
    }

    // Διαβάζουμε και ελέγχουμε αυστηρά τα δεδομένα
    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    console.log("Λάβαμε Ασφαλές Μήνυμα:", validatedData);
    
    // Εδώ στο μέλλον μπορούμε να τα στέλνουμε στο Supabase ή σε Email
    await new Promise(r => setTimeout(r, 600)); // Προσομοίωση αποθήκευσης

    return NextResponse.json({ success: true, message: "Το μήνυμα εστάλη με επιτυχία" }, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Μη έγκυρα δεδομένα συμπλήρωσης", details: error.flatten().fieldErrors }, { status: 400 });
    }
    return NextResponse.json({ error: "Εσωτερικό σφάλμα διακομιστή" }, { status: 500 });
  }
}
