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
  BookOpen,
  ListTodo,
  BarChart2,
  Calendar,
  UserCircle,
  LogOut,
  Settings,
  ChevronLeft,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, title: 'Dashboard' },
  { href: '/dashboard/courses', icon: BookOpen, title: 'My Courses' },
  { href: '/dashboard/tasks', icon: ListTodo, title: 'Tasks' },
  { href: '/dashboard/reports', icon: BarChart2, title: 'Reports' },
  { href: '/dashboard/sessions', icon: Calendar, title: 'Mentorship' },
];

const bottomNavItems = [
    { href: '/dashboard/settings', icon: Settings, title: 'Settings' },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();
  const { state, toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  
  const isCollapsed = state === 'collapsed';

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };


  return (
    <Sidebar
      className={cn(
        'border-r transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <SidebarHeader className="border-b h-14 flex items-center justify-between px-4">
        {!isCollapsed && <Logo isDashboard />}
        {!isMobile && (
           <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
            <ChevronLeft className={cn("h-5 w-5 transition-transform duration-300", isCollapsed && "rotate-180")} />
          </Button>
        )}
      </SidebarHeader>
      <SidebarContent className="p-4 flex-1">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard')}
                  className={cn("h-10 justify-start", isCollapsed && "w-10 justify-center")}
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-3">{item.title}</span>}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
         <SidebarMenu>
            {bottomNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                        <SidebarMenuButton
                            isActive={pathname.startsWith(item.href)}
                            className={cn("h-10 justify-start", isCollapsed && "w-10 justify-center")}
                        >
                            <item.icon className="h-5 w-5" />
                            {!isCollapsed && <span className="ml-3">{item.title}</span>}
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className={cn("h-10 justify-start", isCollapsed && "w-10 justify-center")}
                >
                  <LogOut className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-3">Logout</span>}
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
