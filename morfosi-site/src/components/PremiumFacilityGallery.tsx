"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

export type FacilityPhoto = {
  _id: string;
  title: string;
  photoUrl: string;
};

interface PremiumFacilityGalleryProps {
  photos: FacilityPhoto[];
}

export default function PremiumFacilityGallery({ photos }: PremiumFacilityGalleryProps) {
  // We use the brand colors as hover overlays. 
  // Main: Light Blue (sky-500) and White. Secondary: Orange, Green, Red, Purple.
  const overlayColors = [
    "bg-sky-500/30",
    "bg-orange-500/30",
    "bg-green-500/30",
    "bg-red-500/30",
    "bg-purple-500/30",
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const { scrollYProgress } = useScroll();

  // Without a target, scrollYProgress is 0 to 1 over the whole page.
  // The gallery is usually at the bottom half of the page context, 
  // so we map 0.5->1.0 to the parallax effect.
  const heroScrollY = useTransform(scrollYProgress, [0.4, 1], ["0%", "30%"]);
  const heroScale = useTransform(scrollYProgress, [0.4, 1], [1, 1.1]);

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-[#050505]">
        <h3 className="text-white/50 text-xl font-bold tracking-widest uppercase">
          Δεν βρέθηκαν φωτογραφίες
        </h3>
      </div>
    );
  }

  const heroPhoto = photos[0];
  const gridPhotos = photos.slice(1);

  return (
    <div
      ref={containerRef}
      className="relative w-full left-1/2 -ml-[50vw] right-1/2 -mr-[50vw] bg-[#050505] overflow-hidden"
      style={{ width: "100vw" }}
    >
      {/* 
        1. HERO IMAGE
        Takes full viewport width, features intense parallax 
      */}
      <div className="relative w-full h-[60vh] md:h-[85vh] lg:h-screen overflow-hidden">
        <motion.div
          className="w-full h-full"
          style={{ y: heroScrollY, scale: heroScale }}
        >
          <img
            src={heroPhoto.photoUrl}
            alt="Central Facility View"
            className="w-full h-[120%] object-cover object-center"
          />
        </motion.div>
        
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]" />
        
        {/* Optional floating brand elements if desired, but user wants clean focus on photos. */}
        <div className="absolute bottom-10 inset-x-0 w-full flex justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-[1px] h-24 bg-gradient-to-b from-sky-400 to-transparent"
          />
        </div>
      </div>

      {/* 
        2. EDITORIAL MASONRY GRID 
        Edge to edge, irregular spans, approx 3 per row on PC 
      */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[40vh] md:auto-rows-[55vh] grid-flow-dense">
        {gridPhotos.map((photo, index) => {
          // Determine spanning logic for an editorial feel
          // For example, every 5th photo spans 2 columns, every 7th photo spans 2 rows, etc.
          const isLargeCols = index % 5 === 0 && index !== 0;
          const isLargeRows = index % 4 === 0 && index !== 0;
          const spanClass = `
            ${isLargeCols ? "md:col-span-2" : "col-span-1"} 
            ${isLargeRows ? "row-span-2" : "row-span-1"}
          `;

          // Assign a random secondary overlay color for a premium brand touch on hover
          const colorClass = overlayColors[index % overlayColors.length];

          return (
            <motion.div
              key={photo._id}
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative overflow-hidden group ${spanClass}`}
            >
              <motion.img
                src={photo.photoUrl}
                alt="Facility Detail"
                className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              />
              
              {/* Secondary Color Overlay on Hover */}
              <div 
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay ${colorClass}`} 
              />
              {/* Vignette */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
            </motion.div>
          );
        })}
      </div>
      
      {/* Clean Bottom Fade Extender */}
      <div className="w-full h-32 bg-gradient-to-b from-transparent to-white" />
    </div>
  );
}
