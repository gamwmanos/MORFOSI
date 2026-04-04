"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("morfosi_cookie_consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const acceptCookies = () => {
    localStorage.setItem("morfosi_cookie_consent", "true");
    setShow(false);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] px-4 pb-4 md:px-8 md:pb-8 pt-4 pointer-events-none flex justify-center">
      <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] p-6 max-w-4xl w-full pointer-events-auto flex flex-col md:flex-row gap-6 md:items-center">
        <div className="flex-shrink-0 hidden md:flex items-center justify-center w-12 h-12 bg-brand-orange border-[3px] border-black">
          <Cookie size={24} className="text-white fill-white" />
        </div>
        
        <div className="flex-grow">
          <h4 className="font-black text-lg uppercase tracking-tight text-gray-900 mb-1">
            Χρησιμοποιούμε Cookies 🍪
          </h4>
          <p className="text-sm font-bold text-gray-600 leading-relaxed md:pr-4">
            Αυτός ο ιστότοπος χρησιμοποιεί cookies για να βελτιώσει την εμπειρία σας και να αναλύσει την επισκεψιμότητά μας. Μπορείτε να μάθετε περισσότερα στην{" "}
            <Link href="/privacy" className="text-brand-teal underline font-black hover:text-brand-orange transition-colors">
              Πολιτική Απορρήτου
            </Link>{" "}
            μας.
          </p>
        </div>

        <div className="flex gap-3 flex-shrink-0 w-full md:w-auto">
          <button
            onClick={acceptCookies}
            className="flex-1 md:flex-none uppercase tracking-widest font-black text-sm bg-brand-teal text-white border-[3px] border-black shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all px-8 py-3 text-center"
          >
            ΕΝΤΑΞΕΙ
          </button>
          <button
            onClick={() => setShow(false)}
            aria-label="Κλείσιμο"
            className="hidden md:flex uppercase tracking-widest font-black text-white hover:text-gray-900 border-[3px] border-black bg-black shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] hover:bg-gray-100 transition-all p-3 items-center justify-center"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
