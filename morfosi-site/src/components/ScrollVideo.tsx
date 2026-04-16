"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { useScroll, useMotionValueEvent, useSpring, useInView } from "framer-motion";

const FRAME_COUNT = 62;

function currentFrame(index: number) {
  return `/video-frames/frame_${index.toString().padStart(4, "0")}.jpg`;
}

export default function ScrollVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Using a ref for the images array to keep scrubbing super fast (60fps)
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasStartedLoading = useRef(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const isInView = useInView(containerRef, { margin: "1000px" });

  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const img = imagesRef.current[index - 1];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const ratio = Math.max(canvas.width / iw, canvas.height / ih);
    const x = (canvas.width - iw * ratio) / 2;
    const y = (canvas.height - ih * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, iw, ih, x, y, iw * ratio, ih * ratio);
  }, []);

  // Sync Canvas Size
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      
      const idx = Math.min(FRAME_COUNT, Math.max(1, Math.floor(smoothProgress.get() * FRAME_COUNT) + 1));
      renderFrame(idx);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderFrame, smoothProgress]);

  // Preload
  useEffect(() => {
    if (!isInView || hasStartedLoading.current) return;
    hasStartedLoading.current = true;

    let count = 0;
    const handleLoadOrError = (i: number) => {
        count++;
        // Remove loader when the first frame loads, or immediately if we get ANY frame
        if (i === 1 || count === 1) {
            if (i === 1) renderFrame(1);
            setIsLoaded(true);
        }
        if (count === FRAME_COUNT) {
            setIsLoaded(true);
            // Draw based on current scroll position once all are in memory
            const idx = Math.min(FRAME_COUNT, Math.max(1, Math.floor(smoothProgress.get() * FRAME_COUNT) + 1));
            renderFrame(idx);
        }
    };

    for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => handleLoadOrError(i);
        img.onerror = () => handleLoadOrError(i);
        imagesRef.current[i - 1] = img;
    }
  }, [isInView, renderFrame, smoothProgress]);

  // Scrub Loop
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (imagesRef.current.length < 1) return;
    const frameIndex = Math.min(
      FRAME_COUNT,
      Math.max(1, Math.floor(latest * FRAME_COUNT) + 1)
    );
    requestAnimationFrame(() => renderFrame(frameIndex));
  });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[300vh] bg-black"
      style={{ minHeight: '300vh' }}
    >
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center bg-black border-y-8 border-brand-teal z-0">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full block"
        />
        
        {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="w-10 h-10 border-4 border-brand-teal border-t-white rounded-full animate-spin opacity-40"></div>
            </div>
        )}

        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      </div>
    </section>
  );
}
