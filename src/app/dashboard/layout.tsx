'use client';

import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { MentorDashboardSidebar } from '@/components/mentor/mentor-sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { useMentor } from '@/hooks/use-mentor';

function DashboardLayoutContent({ children }: { children: ReactNode }) {
  const { isMentor } = useMentor();

  return (
    <div className="dark bg-background text-foreground min-h-screen">
      <SidebarProvider>
        <div className="flex h-screen">
          {isMentor ? <MentorDashboardSidebar /> : <DashboardSidebar />}
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

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardLayoutContent>{children}</DashboardLayoutContent>;
}
