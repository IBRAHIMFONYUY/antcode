'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useMentor } from '@/hooks/use-mentor';
import { Loader2 } from 'lucide-react';
import { MentorDashboardSidebar } from './mentor-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { useToast } from '@/hooks/use-toast';
import { useQuestions } from '@/hooks/use-questions';
import { useSubmissions } from '@/hooks/use-submissions';

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

  // Real-time notifications for new questions and submissions
  const { questions } = useQuestions();
  const { submissions } = useSubmissions(user?.uid);
  const { toast } = useToast();
  const prevCounts = useRef({ q: 0, s: 0 });

  useEffect(() => {
    const qLen = questions?.length ?? 0;
    if (prevCounts.current.q === 0) {
      // initial load
      prevCounts.current.q = qLen;
    } else if (qLen > prevCounts.current.q) {
      const latest = questions[0];
      if (latest) {
        toast({ title: 'New question', description: latest.text });
      }
      prevCounts.current.q = qLen;
    }
  }, [questions]);

  useEffect(() => {
    const sLen = submissions?.length ?? 0;
    if (prevCounts.current.s === 0) {
      prevCounts.current.s = sLen;
    } else if (sLen > prevCounts.current.s) {
      const latest = submissions[0];
      if (latest) {
        toast({ title: 'New submission', description: `Task ${latest.taskId} submitted by ${latest.studentName}` });
      }
      prevCounts.current.s = sLen;
    }
  }, [submissions]);

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

