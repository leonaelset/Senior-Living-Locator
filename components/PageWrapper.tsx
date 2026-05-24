'use client';
import { usePathname } from 'next/navigation';

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomepage = pathname === '/';
  return <div className={!isHomepage ? 'pt-24' : ''}>{children}</div>;
}