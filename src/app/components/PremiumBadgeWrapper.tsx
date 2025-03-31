'use client';

import { useEffect } from "react";
import { PremiumTokensBadge } from "../auth/AuthProvider";

export default function PremiumBadgeWrapper() {
  useEffect(() => {
    // Vérifier si un rafraîchissement forcé est demandé
    const forceRefresh = localStorage.getItem('force_refresh');
    if (forceRefresh === 'true') {
      localStorage.removeItem('force_refresh');
      window.location.reload();
    }
  }, []);

  return (
    <div className="fixed top-2 right-2 z-50">
      <PremiumTokensBadge />
    </div>
  );
} 