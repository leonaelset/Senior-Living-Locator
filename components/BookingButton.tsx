// components/BookingButton.tsx
'use client';

import { useState } from 'react';
import BookingModal from './BookingModal';

interface BookingButtonProps {
  communitySlug: string;
  communityName: string;
}

export default function BookingButton({ communitySlug, communityName }: BookingButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full rounded-full border border-[#1A1714] bg-[#1A1714] text-white py-2.5 font-dm-sans font-medium hover:bg-[#2a2a2a] transition"
      >
        Request Tour
      </button>
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        communitySlug={communitySlug}
        communityName={communityName}
      />
    </>
  );
}