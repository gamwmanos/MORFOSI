"use client";

import { Phone, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

export default function MobileStickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[9999] md:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Top shadow line */}
      <div className="h-[3px] bg-black" />

      <div className="flex">
        {/* Phone button */}
        <a
          href="tel:2105063610"
          className="flex-1 flex items-center justify-center gap-2 bg-brand-teal text-white py-4 font-black text-sm uppercase tracking-wider border-r-[2px] border-black active:bg-brand-teal-dark transition-colors"
        >
          <Phone size={18} strokeWidth={3} />
          ΤΗΛΕΦΩΝΟ
        </a>

        {/* Enrollment CTA */}
        <a
          href="/contact"
          className="flex-[1.4] flex items-center justify-center gap-2 bg-brand-orange text-white py-4 font-black text-sm uppercase tracking-wider active:bg-orange-600 transition-colors"
        >
          <UserPlus size={18} strokeWidth={3} />
          ΔΩΡΕΑΝ ΔΟΚΙΜΑΣΤΙΚΟ
        </a>
      </div>
    </div>
  );
}
