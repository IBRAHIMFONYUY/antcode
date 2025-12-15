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
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, title: 'Dashboard' },
  { href: '/dashboard/courses', icon: BookOpen, title: 'My Courses' },
  { href: '/dashboard/tasks', icon: ListTodo, title: 'Tasks' },
  { href: '/dashboard/reports', icon: BarChart2, title: 'Reports' },
  { href: '/dashboard/sessions', icon: Calendar, title: 'Mentorship' },
];

const bottomNavItems = [
    { href: '/dashboard/profile', icon: UserCircle, title: 'Profile' },
    { href: '#', icon: Settings, title: 'Settings' },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };


  return (
    <>
      <SidebarHeader className="border-b-0">
        <Logo isDashboard />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.title}
                  className="justify-center"
                >
                  <item.icon className="h-5 w-5" />
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t-0 p-2">
         <SidebarMenu>
          {bottomNavItems.map((item) => (
             <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.title}
                   className="justify-center"
                >
                  <item.icon className="h-5 w-5" />
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
           <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  tooltip="Logout"
                  className="justify-center"
                >
                  <LogOut className="h-5 w-5" />
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
