"use client";

import { useState } from "react";

export default function ShareButtons({ title }: { title: string }) {
  const [url] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  });

  if (!url) return null; // Avoid hydration mismatch by waiting for client

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const xShare = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const inShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  return (
    <div className="flex gap-4">
      <a
        href={fbShare}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-colors bg-white font-bold text-gray-900"
        title="Share on Facebook"
      >
        FB
      </a>
      <a
        href={xShare}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors bg-white font-bold text-gray-900"
        title="Share on X (Twitter)"
      >
        X
      </a>
      <a
        href={inShare}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-colors bg-white font-bold text-gray-900"
        title="Share on LinkedIn"
      >
        IN
      </a>
    </div>
  );
}
