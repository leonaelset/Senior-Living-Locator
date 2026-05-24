// components/BookingModal.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { submitBooking } from '@/app/actions/submitBooking';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  communitySlug: string;
  communityName: string;
}

export default function BookingModal({ isOpen, onClose, communitySlug, communityName }: BookingModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const result = await submitBooking({
      name,
      phone,
      email,
      preferredDate,
      preferredTime,
      communitySlug,
    });

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || 'Something went wrong. Please try again.');
    }
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#F7F3EE] rounded-2xl border border-[#DDD6CC] max-w-md w-full p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-[#7A6F65] hover:text-[#1A1714]">
            <X size={20} />
          </button>
          <h3 className="font-fraunces font-bold text-2xl text-[#1A1714] mb-2">Request Sent!</h3>
          <p className="font-dm-sans text-[#1A1714] mb-4">
            A senior living advisor will contact you within 24 hours to confirm your tour.
          </p>
          <button
            onClick={onClose}
            className="w-full rounded-full border border-[#1A1714] bg-[#1A1714] text-white py-3 font-dm-sans font-medium hover:bg-[#2a2a2a] transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#F7F3EE] rounded-2xl border border-[#DDD6CC] max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#7A6F65] hover:text-[#1A1714]">
          <X size={20} />
        </button>
        <h3 className="font-fraunces font-bold text-2xl text-[#1A1714] mb-2">Schedule a Tour</h3>
        <p className="font-dm-sans text-[#7A6F65] mb-4">{communityName}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1A1714] mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border-2 border-[#DDD6CC] rounded-full px-4 py-2 focus:border-[#1A1714] outline-none font-dm-sans font-light"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1714] mb-1">Phone *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white border-2 border-[#DDD6CC] rounded-full px-4 py-2 focus:border-[#1A1714] outline-none font-dm-sans font-light"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1714] mb-1">Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border-2 border-[#DDD6CC] rounded-full px-4 py-2 focus:border-[#1A1714] outline-none font-dm-sans font-light"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#1A1714] mb-1">Preferred Date *</label>
              <input
                type="date"
                required
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full bg-white border-2 border-[#DDD6CC] rounded-full px-4 py-2 focus:border-[#1A1714] outline-none font-dm-sans font-light"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1714] mb-1">Preferred Time *</label>
              <input
                type="time"
                required
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full bg-white border-2 border-[#DDD6CC] rounded-full px-4 py-2 focus:border-[#1A1714] outline-none font-dm-sans font-light"
              />
            </div>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full border border-[#1A1714] bg-[#1A1714] text-white py-3 font-dm-sans font-medium hover:bg-[#2a2a2a] transition disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Request Tour'}
          </button>
        </form>
      </div>
    </div>
  );
}