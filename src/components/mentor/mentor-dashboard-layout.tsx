'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useMentor } from '@/hooks/use-mentor';
import { Loader2 } from 'lucide-react';
import { MentorDashboardSidebar } from './mentor-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';

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
    <div className="dark bg-background text-foreground min-h-screen">
      <SidebarProvider>
        <div className="flex h-screen">
          <MentorDashboardSidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
