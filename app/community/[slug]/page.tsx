import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import CommunityGallery from '@/components/CommunityGallery';
import BookingButton from '@/components/BookingButton';

interface CommunityPageProps {
  params: Promise<{ slug: string }>;
}

const amenityEmoji: Record<string, string> = {
  'Chef-Prepared Meals': '🍽️', 'Restaurant-Style Dining': '🍽️', 'Farm-to-Table Dining': '🍽️',
  'Fitness Center': '🏋️', 'Fitness Classes': '🏋️', 'Transportation': '🚗', 'Transportation Services': '🚗',
  'Memory Care Program': '🧠', 'Memory Care Neighborhood': '🧠', 'Secure Memory Care': '🧠',
  'Outdoor Courtyard': '🌿', 'Outdoor Walking Paths': '🌿', 'Courtyard Garden': '🌿', 'Gardens': '🌿',
  'Concierge': '🛎️', 'Concierge Services': '🛎️', 'Spa & Salon': '💆', 'Wellness Spa': '💆',
  'Beauty Salon': '💆', 'Pet Friendly': '🐾', 'Heated Pool': '🏊', 'Resort-Style Pool': '🏊',
  'Housekeeping': '🧹', 'Chapel': '⛪', 'Art Studio': '🎨', 'Activity Center': '🎯',
  '24-Hour Nursing': '👩‍⚕️', 'Rooftop Terrace': '🏙️', 'Bistro & Bar': '🥂',
  'Multiple Dining Venues': '🍴', 'Gourmet Dining': '🍴',
};

const renderStars = (rating: number, reviewCount: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => <span key={i} className="text-[#C4906A] text-sm">★</span>)}
      {halfStar && <span className="text-[#C4906A] text-sm">½</span>}
      {[...Array(emptyStars)].map((_, i) => <span key={i} className="text-[#E5E5E5] text-sm">★</span>)}
      <span className="text-[#6B6B6B] text-xs ml-1">({reviewCount} reviews)</span>
    </div>
  );
};

export default async function CommunityPage({ params }: CommunityPageProps) {
  const { slug } = await params;
  const { data: rawCommunity, error } = await supabase
    .from('communities')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !rawCommunity) notFound();

  // Map snake_case → camelCase
  const community = {
    ...rawCommunity,
    careTypes: rawCommunity.care_types,
    priceMin: rawCommunity.price_min,
    priceMax: rawCommunity.price_max,
    reviewCount: rawCommunity.review_count,
  };

  const formattedMin = community.priceMin.toLocaleString();
  const formattedMax = community.priceMax.toLocaleString();
  const encodedAddress = encodeURIComponent(community.address);
  const encodedMapQuery = encodeURIComponent(community.name + ' ' + community.address);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <CommunityGallery images={community.images} name={community.name} />

        <div className="flex items-center gap-3 flex-wrap mt-5">
          <h1 className="font-fraunces font-bold text-2xl text-[#1A1714]">{community.name}</h1>
          {community.careTypes.map((care: string) => (
            <span key={care} className="text-xs border border-[#E5E5E5] rounded-full px-3 py-1 font-dm-sans text-[#6B6B6B]">
              {care}
            </span>
          ))}
        </div>

        <div className="flex gap-6 flex-wrap mt-2 mb-5">
          <span className="font-dm-sans text-sm text-[#6B6B6B] flex items-center gap-1">📍 {community.address}</span>
          <span className="font-dm-sans text-sm text-[#6B6B6B] flex items-center gap-1">
            ⭐ {community.rating} ({community.reviewCount} reviews)
          </span>
          <span className="font-dm-sans text-sm text-[#6B6B6B] flex items-center gap-1">
            💰 ${formattedMin}–${formattedMax}/mo
          </span>
        </div>

        <hr className="border-[#E5E5E5] my-4" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_200px] gap-8 py-4">
          <div>
            <h2 className="font-fraunces font-bold text-lg text-[#1A1714] mb-3">About</h2>
            <p className="font-dm-sans text-sm text-[#1A1714] leading-relaxed font-light">{community.description}</p>
          </div>

          <div>
            <h2 className="font-fraunces font-bold text-lg text-[#1A1714] mb-3">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {community.amenities.map((amenity: string) => (
                <span key={amenity} className="text-xs border border-[#E5E5E5] rounded-full px-3 py-1.5 font-dm-sans text-[#6B6B6B] bg-[#F5F5F5]">
                  {amenityEmoji[amenity] || '✓'} {amenity}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-xl overflow-hidden border border-[#E5E5E5] h-40 mb-2">
              <iframe
                width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                src={`https://maps.google.com/maps?q=${encodedMapQuery}&output=embed&z=15`}
                title={`Map of ${community.name}`}
              />
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`}
              target="_blank" rel="noopener noreferrer"
              className="font-dm-sans text-xs text-[#C4906A] hover:underline mb-4 inline-block"
            >
              Get directions →
            </a>

            <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 mt-2 shadow-sm">
              <p className="font-dm-sans text-xs text-[#6B6B6B] mb-1">Starting at</p>
              <p className="font-fraunces font-bold text-xl text-[#1A1714] mb-1">
                ${formattedMin}–${formattedMax}<span className="text-sm font-normal">/mo</span>
              </p>
              {renderStars(community.rating, community.reviewCount)}
              <div className="my-4 border-t border-[#E5E5E5]" />
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm font-dm-sans text-[#1A1714]">
                  <span>📞</span>
                  <a href={`tel:${community.phone}`} className="hover:text-[#C4906A]">{community.phone}</a>
                </div>
                <div className="flex items-center gap-2 text-sm font-dm-sans text-[#1A1714]">
                  <span>✉️</span>
                  <a href={`mailto:${community.email}`} className="hover:text-[#C4906A] break-all text-xs">{community.email}</a>
                </div>
              </div>
              <BookingButton communitySlug={community.slug} communityName={community.name} />
              <p className="text-center text-[#6B6B6B] text-xs font-dm-sans mt-3">Free service · No obligation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}