'use client';

import Link from 'next/link';
import { useTokens } from '@/app/TokenProvider';
import { usePathname } from 'next/navigation';

export default function PremiumBadgeWrapper() {
  const { tokensRemaining, isPremiumActive } = useTokens();
  const pathname = usePathname();
  
  // Ne pas afficher le badge sur certaines pages
  const hiddenOnPages = ['/premium', '/premium-success'];
  if (hiddenOnPages.includes(pathname)) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Link href="/premium">
        <div className={`
          flex items-center gap-2 rounded-full px-3 py-1.5 
          ${isPremiumActive 
            ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-orange-200/50' 
            : 'bg-gray-100 hover:bg-gray-200'} 
          transition-all duration-300 transform hover:scale-105
        `}>
          <div className={`
            text-sm font-bold 
            ${isPremiumActive ? 'text-white' : 'text-gray-600'}
          `}>
            {isPremiumActive 
              ? `✨ Premium: ${tokensRemaining}/3` 
              : '⚡ Activer Premium'}
          </div>
        </div>
      </Link>
    </div>
  );
} 