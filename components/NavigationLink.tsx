"use client";
import Link from 'next/link';
import { useNavigationStore } from '../store/navigation';
import { LoadingSpinner } from './LoadingSpinner';
import { ReactNode, MouseEvent } from 'react';

interface NavigationLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  showSpinner?: boolean;
}

export function NavigationLink({ 
  href, 
  children, 
  className = '', 
  onClick,
  showSpinner = true,
  ...props 
}: NavigationLinkProps) {
  const { setNavigating, isNavigating } = useNavigationStore();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    
    if (showSpinner && !e.defaultPrevented) {
      setNavigating(true);
      // Set a timeout to clear loading if navigation takes too long
      setTimeout(() => {
        setNavigating(false);
      }, 5000);
    }
  };

  return (
    <Link 
      href={href} 
      className={`${className} ${isNavigating ? 'pointer-events-none opacity-75' : ''}`}
      onClick={handleClick}
      {...props}
    >
      <span className="flex items-center gap-2">
        {children}
        {isNavigating && showSpinner && (
          <LoadingSpinner size="sm" className="text-current" />
        )}
      </span>
    </Link>
  );
}