"use client";
import { useRef, useEffect, useState } from "react";
import { useScroll, useMotionValueEvent, useSpring, useInView } from "framer-motion";

const FRAME_COUNT = 120; // Έκανα extract ακριβώς 120 φωτογραφίες!

function currentFrame(index: number) {
  // Τα αρχεία ονομάστηκαν: frame_0001.jpg έως frame_0120.jpg
  return `/video-frames/frame_${index.toString().padStart(4, "0")}.jpg`;
}

export default function ScrollVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150, // Λίγο πιο άμεση απόκριση
    damping: 30,
    restDelta: 0.001
  });

  const isInView = useInView(containerRef, { margin: "800px" });
  const [hasStartedLoading, setHasStartedLoading] = useState(false);

  // Preload των εικόνων στη μνήμη του Browser μόνο όταν πλησιάσουμε στο section
  useEffect(() => {
    if (!isInView || hasStartedLoading) return;
    setHasStartedLoading(true);

    const loadedImages: HTMLImageElement[] = [];
    let loadCount = 0;

    for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new window.Image();
        img.src = currentFrame(i);
        img.onload = () => {
          loadCount++;
          if (loadCount === FRAME_COUNT) {
              setImages(loadedImages);
              // Μόλις φορτώσουν, ζωγράφισε την πρώτη εικόνα (frame 1)
              renderFrame(1, loadedImages);
          }
        };
        loadedImages.push(img);
    }
  }, [isInView, hasStartedLoading]);

  const renderFrame = (index: number, imgArray: HTMLImageElement[]) => {
      if (imgArray[index - 1] && canvasRef.current) {
          const context = canvasRef.current.getContext("2d");
          if (context) {
              const img = imgArray[index - 1];
              const canvas = canvasRef.current;
              
              // Υπολογισμός CSS "Object-Fit: Cover" για το Canvas
              const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
              const x = (canvas.width - img.width * ratio) / 2;
              const y = (canvas.height - img.height * ratio) / 2;
              
              context.clearRect(0, 0, canvas.width, canvas.height);
              context.drawImage(img, 0, 0, img.width, img.height, x, y, img.width * ratio, img.height * ratio);
          }
      }
  };

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    // Όσο ο χρήστης κατεβαίνει (0.00 έως 1.00), υπολογίζουμε σε ποιο από τα 120 frames πρέπει να είμαστε
    if (images.length === FRAME_COUNT) {
        const frameIndex = Math.min(
            FRAME_COUNT,
            Math.max(1, Math.floor(latest * FRAME_COUNT) + 1)
        );
        requestAnimationFrame(() => renderFrame(frameIndex, images));
    }
  });

  // Responsive Canvas Resize
  useEffect(() => {
     const resize = () => {
         if (canvasRef.current) {
             canvasRef.current.width = window.innerWidth;
             canvasRef.current.height = window.innerHeight;
             if (images.length === FRAME_COUNT) {
                 const frameIndex = Math.min(
                    FRAME_COUNT,
                    Math.max(1, Math.floor(smoothProgress.get() * FRAME_COUNT) + 1)
                 );
                 renderFrame(frameIndex, images);
             }
         }
     };
     window.addEventListener("resize", resize);
     resize(); // Κάλεσέ το μια φορά στο mount
     return () => window.removeEventListener("resize", resize);
  }, [images]);

  return (
    <section ref={containerRef} className="relative w-full h-[600vh] bg-black">
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-black border-y-8 border-brand-teal">
        
        {/* ΤΕΛΟΣ ΤΟ HTML5 VIDEO. Πλέον είναι ένας ζωγραφικός καμβάς! */}
        <canvas ref={canvasRef} className="w-full h-full block" />
        
        {images.length < FRAME_COUNT && (
           <div className="absolute inset-0 flex items-center justify-center text-white/50 font-black animate-pulse uppercase tracking-widest text-xl">
             Loading Cinematics...
           </div>
        )}

        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      </div>
    </section>
  );
}
