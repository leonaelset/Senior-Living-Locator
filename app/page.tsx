'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Music, Landmark } from 'lucide-react';

function StatsBar() {
  return (
    <div className="w-[90%] max-w-[500px] grid grid-cols-4 border border-[#EFEFEF] rounded-xl overflow-hidden">
      {[
        { val: '9', label: 'Communities', gold: false },
        { val: 'Free', label: 'For Families', gold: false },
        { val: 'TX', label: 'Based', gold: true },
        { val: '24hr', label: 'Response', gold: false },
      ].map(({ val, label, gold }, i, arr) => (
        <div
          key={label}
          className={`flex flex-col items-center py-5 px-2 ${
            i < arr.length - 1 ? 'border-r border-[#EFEFEF]' : ''
          }`}
        >
          <span className={`text-[22px] font-bold leading-none ${gold ? 'text-[#C4906A]' : 'text-[#111]'}`}>
            {val}
          </span>
          <span className="text-[10px] text-[#bbb] tracking-widest uppercase mt-1.5">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();

  function handleCitySelect(city: string) {
    router.push(`/browse?city=${city}`);
  }

  return (
    <>
      {/* Hero – full viewport height */}
      <section
        className="relative w-full min-h-screen flex flex-col items-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/52" />

        {/* Inline Navbar */}
        <nav className="relative z-10 mt-5 w-[88%] max-w-[640px] flex items-center justify-between
                        bg-white/10 backdrop-blur-md border border-white/25 rounded-full px-7 py-3.5">
          <span className="text-white text-[15px] font-semibold tracking-wide">
            Texas Senior Living
          </span>
          <div className="flex items-center gap-6">
            <Link href="/browse" className="text-white/70 text-[13px] hover:text-white transition-colors">
              Browse
            </Link>
            <Link href="/contact" className="text-white/70 text-[13px] hover:text-white transition-colors">
              Contact
            </Link>
            <Link
              href="/contact"
              className="bg-[#111] text-white text-[13px] rounded-full px-6 py-2.5
                         hover:bg-white hover:text-[#111] transition-all"
            >
              Find Care
            </Link>
          </div>
        </nav>

        {/* Centered headline + subline + city cards */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full px-4 pb-16">
          <p className="text-white/45 text-[10px] tracking-[.18em] uppercase mb-4">
            Texas Senior Living
          </p>
          <div className="text-center leading-[1.1] mb-5">
            <span className="block text-white font-bold text-[52px] font-serif">
              Find the right home.
            </span>
            <span className="block text-white/82 italic font-normal text-[46px] font-serif mt-1">
              For the people you love.
            </span>
          </div>
          <p className="text-white/55 text-[15px] text-center max-w-[400px] leading-relaxed mb-10">
            We connect Texas families with the best senior living communities —
            completely free, no pressure.
          </p>

          {/* City cards – click redirects to browse */}
          <div className="w-full max-w-[480px] grid grid-cols-3 gap-3">
            {[
              { city: 'Houston', icon: <Building2 size={24} />, count: '3 communities' },
              { city: 'Austin', icon: <Music size={24} />, count: '3 communities' },
              { city: 'San Antonio', icon: <Landmark size={24} />, count: '3 communities' },
            ].map(({ city, icon, count }) => (
              <button
                key={city}
                onClick={() => handleCitySelect(city)}
                className="group flex flex-col items-center justify-center gap-2
                           rounded-2xl border-2 py-6 px-3 transition-all duration-200
                           bg-white border-white hover:bg-[#111] hover:border-[#111]"
              >
                <span className="text-[#C4906A] transition-colors duration-200">
                  {icon}
                </span>
                <span className="text-[13px] font-bold whitespace-nowrap leading-none
                                 text-[#111] group-hover:text-white">
                  {city}
                </span>
                <span className="text-[10px] leading-none text-[#aaa] group-hover:text-white/50">
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar – always visible below hero */}
      <div className="w-full bg-white flex flex-col items-center py-12">
        <StatsBar />
      </div>
    </>
  );
}