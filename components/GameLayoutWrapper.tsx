'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function GameLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#130a2a' }}>
        {children}
      </div>
    );
  }

  return (
    <div className="game-container">
      {children}
    </div>
  );
}
