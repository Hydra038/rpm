"use client";
import { useEffect } from 'react';
import { useNavigationStore } from '../store/navigation';
import { FullPageLoader } from './LoadingSpinner';
import { usePathname } from 'next/navigation';

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
  const { isNavigating, setNavigating } = useNavigationStore();
  const pathname = usePathname();

  // Clear loading state when pathname changes (navigation complete)
  useEffect(() => {
    setNavigating(false);
  }, [pathname, setNavigating]);

  return (
    <>
      {children}
      {isNavigating && <FullPageLoader />}
    </>
  );
}