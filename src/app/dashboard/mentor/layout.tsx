'use client';

import { MentorDashboardLayout } from '@/components/mentor/mentor-dashboard-layout';

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  return <MentorDashboardLayout>{children}</MentorDashboardLayout>;
}
