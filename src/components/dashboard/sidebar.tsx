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
  MessageCircle,
  LogOut,
  Settings,
  ChevronLeft,
  BookMarked,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, title: 'Dashboard' },
  { href: '/dashboard/courses', icon: BookOpen, title: 'My Courses' },
  { href: '/dashboard/bookings', icon: BookMarked, title: 'My Bookings' },
  { href: '/dashboard/tasks', icon: ListTodo, title: 'Tasks' },
  { href: '/dashboard/reports', icon: BarChart2, title: 'Reports' },
  { href: '/dashboard/ask', icon: MessageCircle, title: 'Ask' },
  { href: '/dashboard/sessions', icon: Calendar, title: 'Mentorship' },
];

const bottomNavItems = [
  { href: '/dashboard/profile', icon: UserCircle, title: 'Profile' },
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
        'border-r border-border/40 bg-white dark:bg-slate-950 transition-all duration-300 ease-in-out shadow-sm',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <SidebarHeader className="border-b border-border/40 h-16 flex items-center justify-between px-4">
        {!isCollapsed && <Logo isDashboard />}
        {!isMobile && (
           <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
          >
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
                  className={cn(
                    "h-10 justify-start rounded-lg transition-all duration-200",
                    isCollapsed && "w-10 justify-center",
                    "hover:bg-primary/10 hover:text-primary",
                    "data-[active=true]:bg-gradient-to-r data-[active=true]:from-primary/20 data-[active=true]:to-secondary/10 data-[active=true]:text-primary data-[active=true]:shadow-sm"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-3 font-medium">{item.title}</span>}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/40 p-4">
         <SidebarMenu>
            {bottomNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                        <SidebarMenuButton
                            isActive={pathname.startsWith(item.href)}
                            className={cn(
                              "h-10 justify-start rounded-lg transition-all duration-200",
                              isCollapsed && "w-10 justify-center",
                              "hover:bg-primary/10 hover:text-primary",
                              "data-[active=true]:bg-gradient-to-r data-[active=true]:from-primary/20 data-[active=true]:to-secondary/10 data-[active=true]:text-primary"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {!isCollapsed && <span className="ml-3 font-medium">{item.title}</span>}
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className={cn(
                    "h-10 justify-start rounded-lg transition-all duration-200",
                    isCollapsed && "w-10 justify-center",
                    "hover:bg-destructive/10 hover:text-destructive"
                  )}
                >
                  <LogOut className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
