"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error monitoring (can be replaced with Sentry etc.)
    console.error("[Morfosi Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#031516] flex flex-col items-center justify-center px-6 py-24 font-sans relative overflow-hidden">

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#f58220 1px, transparent 1px), linear-gradient(90deg, #f58220 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 w-full max-w-2xl text-center">

        {/* Icon */}
        <div className="w-24 h-24 bg-brand-orange border-[6px] border-white/20 flex items-center justify-center mx-auto mb-8 shadow-[10px_10px_0px_rgba(0,0,0,0.5)]">
          <AlertTriangle size={48} className="text-white" strokeWidth={2} />
        </div>

        {/* Title */}
        <div className="text-brand-orange font-black text-xs uppercase tracking-[0.3em] mb-4">Σφάλμα Διακομιστή</div>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6">
          ΚΑΤΙ <span className="text-brand-orange">ΠΗΓΕ</span><br />ΣΤΡΑΒΑ
        </h1>
        <p className="text-gray-400 font-bold text-lg mb-4 leading-relaxed max-w-xl mx-auto">
          Παρουσιάστηκε ένα τεχνικό πρόβλημα. Δοκιμάστε να ανανεώσετε τη σελίδα ή επιστρέψτε στην αρχική.
        </p>
        {error.digest && (
          <p className="text-gray-600 font-mono text-xs mb-10">
            Κωδικός: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <button
            onClick={reset}
            className="inline-flex items-center gap-3 bg-brand-orange text-white px-10 py-5 font-black uppercase tracking-widest text-sm border-4 border-white/20 shadow-[6px_6px_0px_rgba(0,0,0,0.4)] hover:shadow-[2px_2px_0px_rgba(0,0,0,0.4)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
          >
            <RefreshCw size={18} strokeWidth={3} />
            ΔΟΚΙΜΑΣΤΕ ΞΑΝΑ
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-white/10 text-white px-10 py-5 font-black uppercase tracking-widest text-sm border-4 border-white/20 hover:bg-white/20 transition-colors"
          >
            <Home size={18} strokeWidth={3} />
            ΑΡΧΙΚΗ
          </Link>
        </div>
      </div>

      {/* Bottom brand */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <span className="text-white/20 font-black text-xs uppercase tracking-[0.4em]">ΜΟΡΦΩΣΗ • ΦΡΟΝΤΙΣΤΗΡΙΟ</span>
      </div>
    </div>
  );
}
