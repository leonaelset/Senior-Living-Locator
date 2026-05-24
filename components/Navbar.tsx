'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-4 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/70 backdrop-blur-md border border-white/40 shadow-sm rounded-full px-6 py-1.5 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="font-fraunces font-semibold text-[#111] text-lg">
            Texas Senior Living
          </Link>

          {/* Nav links with smooth underline */}
          <div className="flex items-center gap-6">
            <Link
              href="/browse"
              className="font-dm-sans text-sm text-[#555] hover:text-[#111] transition-colors duration-200 relative group"
            >
              Browse
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#C4906A] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/contact"
              className="font-dm-sans text-sm text-[#555] hover:text-[#111] transition-colors duration-200 relative group"
            >
              Contact
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-[#C4906A] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/browse"
              className="bg-[#111] text-white text-sm font-dm-sans px-5 py-1.5 rounded-full transition-all duration-300 hover:bg-white hover:text-[#111] hover:shadow-md"
            >
              Find Care
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}