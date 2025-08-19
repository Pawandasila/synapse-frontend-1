'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Prevent hydration mismatch by not rendering differently on server vs client
  if (!mounted) {
    // Default server-side render - assume not auth page
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  const isAuthPage = pathname?.startsWith('/auth') ?? false;

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main className={isAuthPage ? "min-h-screen" : "min-h-screen pt-16"}>
        {isAuthPage ? (
          children
        ) : (
          <div className="container mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        )}
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
}
