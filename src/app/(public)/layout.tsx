import type { ReactNode } from 'react';
import { LandingHeader } from '@/components/landing-header';
import { Footer } from '@/components/footer';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
