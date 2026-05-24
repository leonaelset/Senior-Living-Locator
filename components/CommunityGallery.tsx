'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface CommunityGalleryProps {
  images: string[];
  name: string;
}

export default function CommunityGallery({ images, name }: CommunityGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance
  useEffect(() => {
    if (isHovering) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovering, images.length]);

  const mainImage = images[currentIndex];
  const secondImage = images[1] || images[0];
  const thirdImage = images[2] || images[0];
  const remainingCount = images.length - 3;

  return (
    <div className="w-full">
      {/* Top grid: 2fr left, 1fr right stacked */}
      <div
        className="grid grid-cols-[2fr_1fr] gap-1 rounded-xl overflow-hidden border border-[#DDD6CC] h-64"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Left: main photo */}
        <div className="relative h-full w-full cursor-pointer">
          <Image
            src={mainImage}
            alt={`${name} - main view`}
            fill
            className="object-cover transition-opacity duration-700"
            priority
          />
        </div>

        {/* Right: two stacked small photos */}
        <div className="flex flex-col gap-1">
          <div className="relative h-1/2 w-full">
            <Image
              src={secondImage}
              alt={`${name} - view 2`}
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-1/2 w-full">
            <Image
              src={thirdImage}
              alt={`${name} - view 3`}
              fill
              className="object-cover"
            />
            {remainingCount > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-dm-sans font-medium text-sm">
                +{remainingCount} more
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative w-12 h-8 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
              idx === currentIndex ? 'border-[#C4906A]' : 'border-[#DDD6CC] hover:border-[#C4906A]/50'
            }`}
          >
            <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}