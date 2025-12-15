'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, title: 'Dashboard' },
  { href: '/dashboard/courses', icon: BookOpen, title: 'My Courses' },
  { href: '/dashboard/tasks', icon: ListTodo, title: 'Tasks' },
  { href: '/dashboard/reports', icon: BarChart2, title: 'Reports' },
  { href: '/dashboard/sessions', icon: Calendar, title: 'Mentorship Sessions' },
  { href: '/dashboard/profile', icon: UserCircle, title: 'Profile' },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
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
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div className="flex items-center gap-2 p-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://picsum.photos/seed/user/100/100" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
                <p className="truncate font-medium">Alex Smith</p>
                <p className="truncate text-xs text-muted-foreground">alex.smith@example.com</p>
            </div>
            <Button variant="ghost" size="icon" asChild>
                <Link href="/"><LogOut /></Link>
            </Button>
        </div>
      </SidebarFooter>
    </>
  );
}
