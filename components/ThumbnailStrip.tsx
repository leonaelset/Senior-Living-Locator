'use client';

import Image from 'next/image';
import { useSlideshow } from './SlideshowContext';

interface ThumbnailStripProps {
  images: string[];
  name: string;
}

export default function ThumbnailStrip({ images, name }: ThumbnailStripProps) {
  const { setCurrentIndex } = useSlideshow();
  const thumbnails = images.slice(0, 3);

  return (
    <div className="flex gap-2 mt-4">
      {thumbnails.map((img, idx) => (
        <button
          key={idx}
          onClick={() => setCurrentIndex(idx)}
          className="relative w-16 h-16 rounded-md overflow-hidden border-2 border-[#DDD6CC] hover:border-[#C4906A] transition"
        >
          <Image
            src={img}
            alt={`${name} thumbnail ${idx + 1}`}
            fill
            className="object-cover"
          />
        </button>
      ))}
    </div>
  );
}