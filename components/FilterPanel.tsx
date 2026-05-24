'use client';

import { City, CareType } from '@/lib/types';

interface FilterPanelProps {
  selectedCities: City[];
  selectedCareTypes: CareType[];
  minPrice: number;
  maxPrice: number;
  onCitiesChange: (cities: City[]) => void;
  onCareTypesChange: (types: CareType[]) => void;
  onPriceChange: (min: number, max: number) => void;
  onClearFilters: () => void;
}

const cities: City[] = ['Houston', 'Austin', 'San Antonio'];
const careTypeOptions: CareType[] = [
  'Independent Living',
  'Assisted Living',
  'Memory Care',
  'Skilled Nursing',
];

const PRICE_MIN = 0;
const PRICE_MAX = 20000;
const PRICE_STEP = 250;

export default function FilterPanel({
  selectedCities,
  selectedCareTypes,
  minPrice,
  maxPrice,
  onCitiesChange,
  onCareTypesChange,
  onPriceChange,
  onClearFilters,
}: FilterPanelProps) {
  const handleCityToggle = (city: City) => {
    if (selectedCities.includes(city)) {
      onCitiesChange(selectedCities.filter(c => c !== city));
    } else {
      onCitiesChange([...selectedCities, city]);
    }
  };

  const handleCareTypeToggle = (type: CareType) => {
    if (selectedCareTypes.includes(type)) {
      onCareTypesChange(selectedCareTypes.filter(t => t !== type));
    } else {
      onCareTypesChange([...selectedCareTypes, type]);
    }
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), maxPrice - PRICE_STEP);
    onPriceChange(newMin, maxPrice);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), minPrice + PRICE_STEP);
    onPriceChange(minPrice, newMax);
  };

  const minPercent = ((minPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxPercent = ((maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  const hasActiveFilters =
    selectedCities.length > 0 || selectedCareTypes.length > 0 ||
    minPrice > PRICE_MIN || maxPrice < PRICE_MAX;

  const formatPrice = (val: number) => `$${val.toLocaleString()}`;
  const displayPriceRange = () => {
    if (minPrice === PRICE_MIN && maxPrice === PRICE_MAX) return 'Any Budget';
    return `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}/mo`;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 shadow-warm">
      {/* City Section */}
      <div className="pb-6 border-b border-[#E5E5E5]">
        <h3 className="text-[#6B6B6B] text-xs tracking-[0.25em] uppercase font-dm-sans font-medium mb-4">
          City
        </h3>
        <div className="space-y-3">
          {cities.map(city => {
            const isSelected = selectedCities.includes(city);
            return (
              <label key={city} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isSelected}
                  onChange={() => handleCityToggle(city)}
                />
                <div className={`w-4 h-4 rounded border-2 transition-all ${
                  isSelected
                    ? 'bg-[#1A1714] border-[#1A1714]'
                    : 'bg-white border-[#E5E5E5] group-hover:border-[#1A1714]'
                }`}>
                  {isSelected && (
                    <span className="text-white text-[10px] flex items-center justify-center h-full">✓</span>
                  )}
                </div>
                <span className="font-dm-sans text-base font-light text-[#1A1714]">{city}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Care Type Section */}
      <div className="py-6 border-b border-[#E5E5E5]">
        <h3 className="text-[#6B6B6B] text-xs tracking-[0.25em] uppercase font-dm-sans font-medium mb-4">
          Care Type
        </h3>
        <div className="space-y-3">
          {careTypeOptions.map(type => {
            const isSelected = selectedCareTypes.includes(type);
            return (
              <label key={type} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isSelected}
                  onChange={() => handleCareTypeToggle(type)}
                />
                <div className={`w-4 h-4 rounded border-2 transition-all ${
                  isSelected
                    ? 'bg-[#1A1714] border-[#1A1714]'
                    : 'bg-white border-[#E5E5E5] group-hover:border-[#1A1714]'
                }`}>
                  {isSelected && (
                    <span className="text-white text-[10px] flex items-center justify-center h-full">✓</span>
                  )}
                </div>
                <span className="font-dm-sans text-base font-light text-[#1A1714]">{type}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Budget Range Section */}
      <div className="pt-6">
        <h3 className="text-[#6B6B6B] text-xs tracking-[0.25em] uppercase font-dm-sans font-medium mb-2">
          Monthly Budget
        </h3>
        <div className="font-dm-sans text-base font-bold text-[#1A1714] mb-4">
          {displayPriceRange()}
        </div>

        <div className="relative w-full mt-3 mb-1">
          <div className="absolute h-1.5 bg-[#E5E5E5] rounded-full w-full top-1/2 -translate-y-1/2" />
          <div
            className="absolute h-1.5 bg-[#C4906A] rounded-full top-1/2 -translate-y-1/2"
            style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={minPrice}
            onChange={handleMinChange}
            className="price-slider absolute w-full top-0 pointer-events-none"
            style={{ zIndex: 1 }}
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={maxPrice}
            onChange={handleMaxChange}
            className="price-slider absolute w-full top-0 pointer-events-none"
            style={{ zIndex: 2 }}
          />
        </div>

        <div className="flex justify-between text-sm font-medium text-[#6B6B6B] mt-2">
          <span>${PRICE_MIN.toLocaleString()}</span>
          <span>${PRICE_MAX.toLocaleString()}</span>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="text-[#1A1714] underline hover:opacity-60 text-xs font-dm-sans transition-opacity mt-6 block font-light"
        >
          Clear Filters
        </button>
      )}

      <style jsx>{`
        input[type='range'].price-slider {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          pointer-events: none;
        }
        input[type='range'].price-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #1A1714;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          pointer-events: all;
          cursor: pointer;
        }
        input[type='range'].price-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #1A1714;
          border: 2px solid white;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          pointer-events: all;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}