'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SlideshowContextType {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

const SlideshowContext = createContext<SlideshowContextType | undefined>(undefined);

export function SlideshowProvider({ children }: { children: ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <SlideshowContext.Provider value={{ currentIndex, setCurrentIndex }}>
      {children}
    </SlideshowContext.Provider>
  );
}

export function useSlideshow() {
  const context = useContext(SlideshowContext);
  if (!context) throw new Error('useSlideshow must be used within SlideshowProvider');
  return context;
}