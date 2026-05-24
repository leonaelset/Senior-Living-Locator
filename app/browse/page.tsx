'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { City, CareType } from '@/lib/types';

const PRICE_MIN = 0;
const PRICE_MAX = 20000;

const cities: City[] = ['Houston', 'Austin', 'San Antonio'];
const careTypeOptions: CareType[] = [
  'Independent Living',
  'Assisted Living',
  'Memory Care',
  'Skilled Nursing',
];

const fmtRange = (min: number, max: number) =>
  `$${min.toLocaleString()} – ${max >= PRICE_MAX ? '$20,000+' : '$' + max.toLocaleString()}`;

interface Community {
  id: string;
  slug: string;
  name: string;
  address: string;
  city: City;
  care_types: CareType[];
  price_min: number;
  images: string[];
}

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  const [selectedCareTypes, setSelectedCareTypes] = useState<CareType[]>([]);
  const [minPrice, setMinPrice] = useState(PRICE_MIN);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [refreshing, setRefreshing] = useState(false);
  const initialized = useRef(false);

  // Fetch communities from Supabase once on mount
  useEffect(() => {
    const fetchCommunities = async () => {
      const { data, error } = await supabase
        .from('communities')
        .select('id, slug, name, address, city, care_types, price_min, images')
        .order('name');

      if (error) {
        console.error('Error fetching communities:', error.message);
      } else {
        setCommunities(data ?? []);
      }
      setLoading(false);
    };

    fetchCommunities();
  }, []);

  // Read URL params once on mount
  useEffect(() => {
    const cityParam = searchParams.get('city');
    if (cityParam && cities.includes(cityParam as City)) {
      setSelectedCities([cityParam as City]);
    }
    const careParam = searchParams.get('care');
    if (careParam && careTypeOptions.includes(careParam as CareType)) {
      setSelectedCareTypes([careParam as CareType]);
    }
    initialized.current = true;
  }, []);

  const flash = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 300);
  };

  const toggleCity = (city: City) => {
    setSelectedCities(prev =>
      prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]
    );
    flash();
  };

  const toggleCare = (care: CareType) => {
    setSelectedCareTypes(prev =>
      prev.includes(care) ? prev.filter(c => c !== care) : [...prev, care]
    );
    flash();
  };

  const clearAll = () => {
    setSelectedCities([]);
    setSelectedCareTypes([]);
    setMinPrice(PRICE_MIN);
    setMaxPrice(PRICE_MAX);
    flash();
  };

  const hasFilters =
    selectedCities.length > 0 ||
    selectedCareTypes.length > 0 ||
    minPrice > PRICE_MIN ||
    maxPrice < PRICE_MAX;

  const filtered = communities.filter(c => {
    if (selectedCities.length && !selectedCities.includes(c.city)) return false;
    if (
      selectedCareTypes.length &&
      !selectedCareTypes.some(ct => c.care_types?.includes(ct))
    )
      return false;
    if (c.price_min < minPrice || c.price_min > maxPrice) return false;
    return true;
  });

  const featured = filtered[0] || null;
  const rest = filtered.slice(1);
  const headlineCity = selectedCities.length
    ? selectedCities.join(' + ')
    : 'Texas';

  const minPct = ((minPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxPct = ((maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  const priceDisplay =
    minPrice === PRICE_MIN && maxPrice === PRICE_MAX
      ? 'Any budget'
      : fmtRange(minPrice, maxPrice);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes filterFlash {
          0% { opacity: 1; }
          30% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        .community-card { animation: fadeUp 0.4s ease both; }
        .community-card:nth-child(1) { animation-delay: 0s; }
        .community-card:nth-child(2) { animation-delay: 0.07s; }
        .community-card:nth-child(3) { animation-delay: 0.14s; }
        .community-card:nth-child(4) { animation-delay: 0.21s; }
        .community-card:nth-child(5) { animation-delay: 0.28s; }
        .community-card:nth-child(6) { animation-delay: 0.35s; }
        .results-refreshing { animation: filterFlash 0.3s ease; }

        .price-slider {
          position: absolute;
          inset: 0;
          width: 100%;
          appearance: none;
          -webkit-appearance: none;
          background: transparent;
          pointer-events: none;
          height: 20px;
        }
        .price-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #1A1714;
          border: 2px solid white;
          box-shadow: 0 1px 6px rgba(0,0,0,0.25);
          cursor: grab;
          pointer-events: auto;
        }
        .price-slider::-webkit-slider-thumb:active { cursor: grabbing; }
        .price-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #1A1714;
          border: 2px solid white;
          box-shadow: 0 1px 6px rgba(0,0,0,0.25);
          cursor: grab;
          pointer-events: auto;
        }
        .price-slider::-webkit-slider-runnable-track { background: transparent; }
        .price-slider::-moz-range-track { background: transparent; }

        .check-box {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1.5px solid #E2D9CC;
          flex-shrink: 0;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .check-box.checked {
          background: #1A1714;
          border-color: #1A1714;
        }

        .skeleton {
          background: linear-gradient(90deg, #ede8e0 25%, #e2dcd4 50%, #ede8e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 12px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="flex min-h-screen bg-[#F5F0E8]">

        {/* LEFT PANEL */}
        <aside className="w-[300px] shrink-0 sticky top-0 h-screen overflow-y-auto bg-white border-r border-[#E2D9CC] flex flex-col">
          <div className="px-8 py-10 flex flex-col gap-8 flex-1">

            {/* Header */}
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#C4906A] mb-3">
                Senior Living
              </p>
              <h2 className="font-['var(--font-fraunces)'] font-bold text-2xl text-[#1A1714] leading-tight">
                Find your<br /><em className="font-normal italic">community</em>
              </h2>
              <p className="text-sm text-[#7A6F65] font-['var(--font-dm-sans)'] font-light mt-2">
                Adjust filters to explore
              </p>
            </div>

            {/* City */}
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#7A6F65] mb-4">
                City
              </p>
              <div className="flex flex-col gap-3">
                {cities.map(city => (
                  <label key={city} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selectedCities.includes(city)}
                      onChange={() => toggleCity(city)}
                    />
                    <div className={`check-box ${selectedCities.includes(city) ? 'checked' : ''}`}>
                      {selectedCities.includes(city) && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-['var(--font-dm-sans)'] text-[#1A1714] group-hover:text-[#C4906A] transition-colors">
                      {city}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#E2D9CC]" />

            {/* Care Type */}
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#7A6F65] mb-4">
                Care Type
              </p>
              <div className="flex flex-col gap-3">
                {careTypeOptions.map(care => (
                  <label key={care} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selectedCareTypes.includes(care)}
                      onChange={() => toggleCare(care)}
                    />
                    <div className={`check-box ${selectedCareTypes.includes(care) ? 'checked' : ''}`}>
                      {selectedCareTypes.includes(care) && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-['var(--font-dm-sans)'] text-[#1A1714] group-hover:text-[#C4906A] transition-colors">
                      {care}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#E2D9CC]" />

            {/* Budget dual slider */}
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#7A6F65] mb-2">
                Monthly Budget
              </p>
              <p className="font-['var(--font-fraunces)'] font-bold text-xl text-[#1A1714] mb-4">
                {priceDisplay}
              </p>

              <div className="relative w-full" style={{ height: '20px' }}>
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-[3px] rounded-full bg-[#E2D9CC]" />
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-[#1A1714]"
                  style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
                />
                <input
                  type="range"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={250}
                  value={minPrice}
                  className="price-slider"
                  onChange={e => {
                    const val = Number(e.target.value);
                    setMinPrice(Math.min(val, maxPrice - 250));
                    flash();
                  }}
                />
                <input
                  type="range"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={250}
                  value={maxPrice}
                  className="price-slider"
                  onChange={e => {
                    const val = Number(e.target.value);
                    setMaxPrice(Math.max(val, minPrice + 250));
                    flash();
                  }}
                />
              </div>

              <div className="flex justify-between mt-3">
                <span className="text-xs text-[#7A6F65] font-['var(--font-dm-sans)']">$0</span>
                <span className="text-xs text-[#7A6F65] font-['var(--font-dm-sans)']">$20,000+</span>
              </div>
            </div>

            {/* Bottom */}
            <div className="mt-auto pt-4 border-t border-[#E2D9CC] flex items-center justify-between">
              <span className="text-sm text-[#7A6F65] font-['var(--font-dm-sans)']">
                {loading ? '...' : `${filtered.length} ${filtered.length === 1 ? 'community' : 'communities'}`}
              </span>
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="text-xs text-[#7A6F65] hover:text-[#1A1714] font-['var(--font-dm-sans)'] underline underline-offset-2 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* RIGHT RESULTS */}
        <main className="flex-1 px-8 py-10 overflow-y-auto">

          {/* Headline */}
          <div className="mb-8">
            <h1 className="font-['var(--font-fraunces)'] font-bold text-4xl text-[#1A1714] leading-tight">
              {loading ? (
                <span className="opacity-40">Loading communities…</span>
              ) : (
                <>
                  {filtered.length} {filtered.length === 1 ? 'community' : 'communities'}<br />
                  <em className="font-normal italic">in {headlineCity}</em>
                </>
              )}
            </h1>
          </div>

          {/* Loading skeletons */}
          {loading && (
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr) minmax(0,1fr)' }}
            >
              <div className="row-span-2 skeleton" style={{ height: '520px' }} />
              <div className="skeleton" style={{ height: '250px' }} />
              <div className="skeleton" style={{ height: '250px' }} />
              <div className="skeleton" style={{ height: '250px' }} />
              <div className="skeleton" style={{ height: '250px' }} />
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="py-24 text-center">
              <p className="font-['var(--font-fraunces)'] text-3xl text-[#1A1714] mb-3">
                No communities found
              </p>
              <p className="font-['var(--font-dm-sans)'] text-[#7A6F65] mb-6">
                Try adjusting your filters
              </p>
              <button
                onClick={clearAll}
                className="border border-[#1A1714] rounded-full px-6 py-2 text-sm font-['var(--font-dm-sans)'] hover:bg-[#1A1714] hover:text-white transition"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Results grid */}
          {!loading && filtered.length > 0 && (
            <div
              className={`grid gap-4 ${refreshing ? 'results-refreshing' : ''}`}
              style={{ gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr) minmax(0,1fr)' }}
            >
              {/* Featured card */}
              {featured && (
                <div
                  className="row-span-2 community-card cursor-pointer"
                  onClick={() => router.push(`/community/${featured.slug}`)}
                >
                  <div className="bg-white rounded-2xl border border-[#E2D9CC] overflow-hidden hover:-translate-y-1 transition-transform duration-200 h-full flex flex-col">
                    <div style={{ position: 'relative', height: '320px', flexShrink: 0 }}>
                      <Image
                        src={featured.images?.[0] ?? '/placeholder.jpg'}
                        alt={featured.name}
                        fill
                        sizes="(max-width:768px) 100vw, 50vw"
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714]/70 to-transparent" />
                      <span className="absolute top-3 left-3 bg-white text-[#1A1714] text-xs font-semibold rounded-full px-3 py-1">
                        Featured
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <span className="inline-block mb-3 bg-[#1A1714] text-white text-xs rounded-full px-3 py-1 w-fit">
                        {featured.care_types?.[0]}
                      </span>
                      <h3 className="font-['var(--font-fraunces)'] font-bold text-2xl text-[#1A1714] mb-1">
                        {featured.name}
                      </h3>
                      <p className="text-sm text-[#7A6F65] mb-3">{featured.address}</p>
                      <p className="font-['var(--font-fraunces)'] font-bold text-xl text-[#1A1714] mb-5">
                        From ${featured.price_min.toLocaleString()}/mo
                      </p>
                      <button className="mt-auto w-full bg-[#1A1714] text-white rounded-xl py-3 font-['var(--font-dm-sans)'] font-medium hover:bg-[#2a2a2a] transition">
                        View Community →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Small cards */}
              {rest.map(community => (
                <div
                  key={community.id}
                  className="community-card cursor-pointer"
                  onClick={() => router.push(`/community/${community.slug}`)}
                >
                  <div className="bg-white rounded-2xl border border-[#E2D9CC] overflow-hidden hover:-translate-y-1 transition-transform duration-200">
                    <div style={{ position: 'relative', height: '140px' }}>
                      <Image
                        src={community.images?.[0] ?? '/placeholder.jpg'}
                        alt={community.name}
                        fill
                        sizes="(max-width:768px) 100vw, 33vw"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-['var(--font-fraunces)'] font-bold text-base text-[#1A1714] mb-1 truncate">
                        {community.name}
                      </h3>
                      <p className="text-xs text-[#7A6F65] mb-2 truncate">{community.address}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#1A1714]">
                          From ${community.price_min.toLocaleString()}/mo
                        </span>
                        <span className="text-xs text-[#C4906A] font-medium">Learn More →</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}