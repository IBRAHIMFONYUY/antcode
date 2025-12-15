'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [isHovered, setIsHovered] = useState(false);
  const loadingBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is a workaround to show loading on internal navigation
    // A more robust solution would involve Next.js's router events if available and suitable
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute('href');
      if (href && href.startsWith('/') && href !== window.location.pathname) {
        setLoading(true);
      }
    };

    const internalLinks = document.querySelectorAll('a[href^="/"]');
    internalLinks.forEach(link => link.addEventListener('click', handleAnchorClick));

    // Reset loading state on history change
    const handlePopState = () => setLoading(false);
    window.addEventListener('popstate', handlePopState);
    
    // A simple way to end loading state after a delay, simulating page load
    let timer: NodeJS.Timeout;
    if (loading) {
      if(loadingBarRef.current) {
        loadingBarRef.current.style.width = '0%';
        loadingBarRef.current.style.transition = 'none';
        void loadingBarRef.current.offsetWidth; // Trigger reflow
        loadingBarRef.current.style.transition = 'width 4s ease-out';
        loadingBarRef.current.style.width = '100%';
      }
      timer = setTimeout(() => {
        setLoading(false);
        if(loadingBarRef.current) {
            loadingBarRef.current.style.width = '100%';
            setTimeout(() => {
                if(loadingBarRef.current) {
                    loadingBarRef.current.style.transition = 'opacity 0.5s ease-out';
                    loadingBarRef.current.style.opacity = '0';
                }
            }, 500);
        }
      }, 4000);
    } else {
        if(loadingBarRef.current) {
            loadingBarRef.current.style.opacity = '1';
            loadingBarRef.current.style.width = '0%';
        }
    }

    return () => {
      clearTimeout(timer);
      internalLinks.forEach(link => link.removeEventListener('click', handleAnchorClick));
      window.removeEventListener('popstate', handlePopState);
    };
  }, [loading, pathname]);

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn("container flex h-16 items-center transition-all duration-300", isHovered ? "justify-between" : "justify-center")}>
        <div className={cn("flex items-center", isHovered ? "" : "absolute")}>
            <Logo />
            <nav className={cn(
                "items-center space-x-6 text-sm font-medium transition-all duration-300 md:flex",
                isHovered ? "ml-10 opacity-100" : "ml-0 w-0 opacity-0"
            )}>
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
        </div>
        <div className={cn("flex items-center space-x-4 transition-opacity duration-300", isHovered ? "opacity-100" : "opacity-0")}>
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </div>
      </div>
      {loading && <div ref={loadingBarRef} className="absolute bottom-0 h-0.5 bg-primary" />}
    </header>
  );
}
