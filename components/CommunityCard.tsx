'use client';

import Image from 'next/image';
import { Community } from '@/lib/types';

interface CommunityCardProps {
  community: Community;
  onClick: () => void;
  featured?: boolean;   // if true, use large featured layout
  index?: number;       // for staggered animation delay
}

export default function CommunityCard({ community, onClick, featured = false, index = 0 }: CommunityCardProps) {
  const pricePerMonth = `$${community.priceMin.toLocaleString()} – $${community.priceMax.toLocaleString()}/mo`;
  const primaryCare = community.careTypes[0];

  // Featured layout (large hero image, full content)
  if (featured) {
    return (
      <div
        onClick={onClick}
        className="bg-white rounded-2xl border border-[#E2D9CC] overflow-hidden cursor-pointer transition-transform duration-200 hover:-translate-y-1 group community-card"
        style={{ animationDelay: `${index * 0.08}s` }}
      >
        <div className="relative h-72 w-full">
          <Image
            src={community.images[0]}
            alt={community.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714]/80 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className="bg-white text-[#1A1714] text-xs font-semibold rounded-full px-3 py-1">
              Featured
            </span>
          </div>
        </div>
        <div className="p-6">
          <span className="bg-[#1A1714] text-white text-xs rounded-full px-3 py-1 inline-block mb-3">
            {primaryCare}
          </span>
          <h3 className="font-fraunces font-bold text-2xl text-[#1A1714] mb-1">{community.name}</h3>
          <p className="text-sm text-[#7A6F65] mb-2">{community.address}</p>
          <p className="font-fraunces font-bold text-2xl text-[#1A1714] mb-4">{pricePerMonth}</p>
          <button className="w-full bg-[#1A1714] text-white rounded-xl py-3 font-dm-sans font-medium hover:bg-[#2a2a2a] transition">
            View Community →
          </button>
        </div>
      </div>
    );
  }

  // Small card layout (right columns)
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-[#E2D9CC] overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 group community-card"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="relative h-28 w-full">
        <Image
          src={community.images[0]}
          alt={community.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-fraunces font-bold text-base text-[#1A1714] mb-1">{community.name}</h3>
        <div className="flex justify-between items-center text-sm text-[#7A6F65]">
          <span>{pricePerMonth}</span>
          <span>{primaryCare}</span>
        </div>
        <span className="inline-block mt-2 text-xs text-[#C4906A] hover:underline">
          Learn More →
        </span>
      </div>
    </div>
  );
}