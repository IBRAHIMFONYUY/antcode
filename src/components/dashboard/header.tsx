'use client';

import { useState, useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Search, MessageSquare } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardHeader() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/50 bg-gradient-to-r from-white to-blue-50 dark:from-slate-950 dark:to-slate-900 px-4 sm:px-6 shadow-sm">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-white dark:bg-slate-800 border-border pl-8 md:w-[200px] lg:w-[336px] focus:ring-primary"
            />
        </div>
      </div>
      <div className="flex items-center gap-2">
         <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 hover:bg-primary/10 hover:text-primary">
            <MessageSquare className="h-5 w-5" />
            <span className="sr-only">Messages</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 hover:bg-primary/10 hover:text-primary">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
        </Button>
        
        {!isMounted ? (
          <Skeleton className="h-10 w-10 rounded-full" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.photoURL ?? "https://picsum.photos/seed/user/100/100"} alt="User avatar" />
                  <AvatarFallback>{user?.displayName?.charAt(0)?.toUpperCase() ?? 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.displayName ?? 'My Account'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
