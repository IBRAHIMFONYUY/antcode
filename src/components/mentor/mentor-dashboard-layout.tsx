'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useMentor } from '@/hooks/use-mentor';
import { Loader2 } from 'lucide-react';
import { MentorDashboardSidebar } from './mentor-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export function MentorDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isMentor } = useMentor();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isMentor) {
      router.push('/dashboard');
    }
  }, [loading, isMentor, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isMentor) {
    return null;
  }

  return (
    <SidebarProvider>
      <MentorDashboardSidebar />
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  );
}
