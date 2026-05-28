
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';


const navLinks = [
  { href: '/experts', label: 'Explore Experts' },
  { href: '/courses', label: 'Courses' },
  { href: '/signup?role=mentor', label: 'Become a Mentor' },
];

export function LandingHeader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const loadingBarRef = useRef<HTMLDivElement>(null);
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // This is a workaround to show loading on internal navigation
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
  
  if (isMobile) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-gradient-to-r from-white to-blue-50 dark:from-slate-950 dark:to-slate-900 backdrop-blur supports-[backdrop-filter]:bg-white/95 dark:supports-[backdrop-filter]:bg-slate-950/95 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white dark:bg-slate-950">
              <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
              <div className="p-4">
                <div className="mb-8">
                  <Logo />
                </div>
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          'text-lg font-semibold transition-colors hover:text-primary',
                          pathname === link.href ? 'text-primary' : 'text-foreground'
                        )}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-8 flex flex-col space-y-4">
                  <SheetClose asChild>
                    <Button variant="outline" asChild className="border-primary/30 text-primary hover:bg-primary/5">
                        <Link href="/login">Login</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white">
                        <Link href="/signup">Get Started</Link>
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        {loading && <div ref={loadingBarRef} className="absolute bottom-0 h-1 bg-gradient-to-r from-primary to-secondary" />}
      </header>
    );
  }

  return (
    <header className="sticky top-4 z-50 w-full flex justify-center">
      <div 
        ref={headerContainerRef}
        className={cn(
            "relative container flex h-16 items-center rounded-full border border-primary/30 bg-white/80 dark:bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-slate-950/70 transition-[max-width,padding] duration-1000 ease-in-out shadow-lg hover:shadow-xl",
            isHovered ? "max-w-6xl justify-between px-6" : "max-w-min justify-center px-4"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={cn(
            "absolute inset-0 rounded-full border-2 border-transparent transition-all duration-300 ease-in-out pointer-events-none",
            isHovered ? "border-primary/40 shadow-[0_0_30px_5px_hsl(var(--primary)/0.25)]" : "shadow-[0_0_20px_3px_hsl(var(--primary)/0.15)]"
        )} />

        <div className={cn(
            "flex items-center transition-all duration-1000 z-10",
            isHovered ? "w-auto" : "w-full justify-center"
        )}>
            <Logo />
            <nav className={cn(
                "flex items-center space-x-8 text-sm font-semibold transition-opacity duration-500",
                isHovered ? "ml-12 opacity-100 delay-500" : "w-0 opacity-0"
            )}>
            {navLinks.map((link) => (
                <Link
                key={link.href}
                href={link.href}
                className={cn(
                    'transition-all duration-200 hover:text-primary hover:scale-105 whitespace-nowrap',
                    pathname === link.href ? 'text-primary font-bold' : 'text-foreground/70'
                )}
                >
                {link.label}
                </Link>
            ))}
            </nav>
        </div>
        <div className={cn(
            "flex items-center space-x-4 transition-opacity duration-500 z-10", 
            isHovered ? "opacity-100 delay-500" : "w-0 opacity-0 pointer-events-none"
        )}>
          <Button 
            variant="ghost" 
            asChild
            className="text-foreground hover:text-primary font-semibold"
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button 
            asChild
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
      {loading && <div ref={loadingBarRef} className="absolute bottom-0 h-1 bg-gradient-to-r from-primary to-secondary" />}
    </header>
  );
}
