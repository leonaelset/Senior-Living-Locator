'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-full font-dm-sans text-sm transition-colors ${
        isActive
          ? 'bg-[#EDE8DF] font-medium text-[#1A1714]'
          : 'text-[#7A6F65] font-light hover:bg-[#EDE8DF] hover:text-[#1A1714]'
      }`}
    >
      {children}
    </Link>
  )
}