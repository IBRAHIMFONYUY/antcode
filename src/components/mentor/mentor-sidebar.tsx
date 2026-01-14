'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  Sidebar,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  BarChart3,
  LogOut,
  Settings,
  ChevronLeft,
  Award,
  CheckCircle,
  MessageCircle,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNotifications } from '@/hooks/use-notifications';

const mentorNavItems = [
  { href: '/dashboard/mentor', icon: LayoutDashboard, title: 'Dashboard' },
  { href: '/dashboard/mentor/sessions', icon: Calendar, title: 'Sessions' },
  { href: '/dashboard/mentor/students', icon: Users, title: 'Students' },
  { href: '/dashboard/mentor/courses', icon: BookOpen, title: 'Courses' },
  { href: '/dashboard/mentor/questions', icon: MessageCircle, title: 'Questions' },
  { href: '/dashboard/mentor/task-review', icon: CheckCircle, title: 'Task Review' },
  { href: '/dashboard/mentor/earnings', icon: BarChart3, title: 'Earnings' },
];

const bottomNavItems = [
  { href: '/dashboard/mentor/settings', icon: Settings, title: 'Settings' },
];
export function MentorDashboardSidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();
  const { state, toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  const { unansweredQuestionsCount, pendingSubmissionsCount } = useNotifications();

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <Logo />
          {isMobile && state === 'expanded' && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {mentorNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className={cn(
                  'transition-colors',
                  pathname === item.href && 'bg-primary text-primary-foreground'
                )}
              >
                <Link href={item.href} className="flex items-center gap-3 w-full">
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                  {item.href.includes('questions') && unansweredQuestionsCount > 0 && (
                    <span className="ml-auto inline-flex items-center justify-center rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">{unansweredQuestionsCount}</span>
                  )}
                  {item.href.includes('task-review') && pendingSubmissionsCount > 0 && (
                    <span className="ml-auto inline-flex items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">{pendingSubmissionsCount}</span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {bottomNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className={cn(
                  'transition-colors',
                  pathname === item.href && 'bg-primary text-primary-foreground'
                )}
              >
                <Link href={item.href} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:bg-destructive/10">
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
