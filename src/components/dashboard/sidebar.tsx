'use client';

import { usePathname, useRouter } from 'next/navigation';
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
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';

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
  const { user } = useUser();
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
              <AvatarImage src={user?.photoURL ?? "https://picsum.photos/seed/user/100/100"} />
              <AvatarFallback>{user?.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
                <p className="truncate font-medium">{user?.displayName ?? 'User'}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email ?? ''}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut />
            </Button>
        </div>
      </SidebarFooter>
    </>
  );
}
