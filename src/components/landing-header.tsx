'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/experts', label: 'Explore Experts' },
  { href: '/courses', label: 'Courses' },
  { href: '/auth/signup?role=mentor', label: 'Become a Mentor' },
];

export function LandingHeader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url: string) => (url !== window.location.pathname) && setLoading(true);
    const handleComplete = () => setLoading(false);

    // For next/link navigation
    // This is a simplified version. For a robust solution, you might need to tap into Next.js router events if they are exposed in a way that can be used in your app version.
    // The following is a conceptual stand-in.
    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if(href && href.startsWith('/') && href !== window.location.pathname){
                handleStart(href);
            }
        });
    });
    
    // Fallback for when navigation completes
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        handleComplete();
    };

    window.addEventListener('popstate', handleComplete);
    
    return () => {
        window.removeEventListener('popstate', handleComplete);
        history.pushState = originalPushState;
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <nav className="ml-10 hidden items-center space-x-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-foreground/60'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </div>
      </div>
      {loading && <div className="absolute bottom-0 h-0.5 w-full bg-primary animate-pulse" />}
    </header>
  );
}
