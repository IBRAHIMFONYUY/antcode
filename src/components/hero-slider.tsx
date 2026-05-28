'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const heroSlides = [
  {
    title: 'Learn, Build, and Grow with Industry Experts',
    description: 'Combine 1-on-1 mentorship with structured learning paths to accelerate your career in tech. Get guidance from the best in the industry.',
    icon: Sparkles,
  },
  {
    title: 'Unlock Your Potential with Personalized Mentorship',
    description: 'Connect with top mentors, follow guided learning paths, and achieve your professional goals faster than ever before.',
    icon: Zap,
  },
  {
    title: 'Accelerate Your Tech Career Today',
    description: 'Join thousands of successful developers who transformed their careers through our expert-led programs and hands-on projects.',
    icon: TrendingUp,
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn('relative', 'z-10')}>
      <div className="relative" style={{ minHeight: '280px' }}>
        {heroSlides.map((slide, index) => {
          const Icon = slide.icon;
          return (
            <div
              key={index}
              className={cn(
                'absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out',
                currentSlide === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              )}
            >
              <div className={cn('mb-8', 'animate-float')}>
                <div className="relative">
                  <div className={cn('absolute', 'inset-0', 'bg-gradient-to-br', 'from-primary/30', 'to-secondary/20', 'blur-2xl', 'rounded-full')} />
                  <div className={cn('relative', 'bg-gradient-to-br', 'from-primary', 'via-primary', 'to-secondary', 'p-5', 'rounded-3xl', 'shadow-2xl', 'backdrop-blur-sm')}>
                    <Icon className={cn('h-8', 'w-8', 'text-white')} />
                  </div>
                </div>
              </div>
              <h1 className={cn('font-headline', 'text-4xl', 'font-bold', 'tracking-tight', 'sm:text-5xl', 'md:text-6xl', 'lg:text-7xl', 'bg-gradient-to-r', 'from-foreground', 'via-primary', 'to-foreground', 'bg-clip-text', 'text-transparent', 'animate-gradient-x')}>
                {slide.title}
              </h1>
              <p className={cn('mx-auto', 'mt-6', 'max-w-2xl', 'text-lg', 'text-muted-foreground', 'leading-relaxed')}>
                {slide.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className={cn('relative', 'z-10', 'mt-12', 'flex', 'flex-col', 'sm:flex-row', 'justify-center', 'gap-4')}>
        <Button 
          size="lg" 
          asChild
          className={cn('group', 'relative', 'overflow-hidden', 'bg-gradient-to-r', 'from-primary', 'to-secondary', 'hover:from-primary/90', 'hover:to-secondary/90', 'transition-all', 'duration-300', 'shadow-xl', 'hover:shadow-2xl', 'hover:scale-105', 'text-white', 'font-semibold', 'border-0')}
        >
          <Link href="/signup">
            <span className={cn('relative', 'z-10')}>Get Started</span>
            <div className={cn('absolute', 'inset-0', 'bg-white/20', 'translate-y-full', 'group-hover:translate-y-0', 'transition-transform', 'duration-300')} />
          </Link>
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          asChild
          className={cn('group', 'border-2', 'border-primary', 'text-primary', 'hover:bg-primary/5', 'hover:border-secondary', 'transition-all', 'duration-300', 'hover:scale-105', 'font-semibold')}
        >
          <Link href="/experts" className="group">
            Find an Expert <ArrowRight className={cn('ml-2', 'h-4', 'w-4', 'transition-transform', 'group-hover:translate-x-1')} />
          </Link>
        </Button>
      </div>

      <div className={cn('mt-16', 'flex', 'justify-center', 'gap-8')}>
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              currentSlide === index ? 'w-8 bg-primary' : 'w-2 bg-primary/30 hover:bg-primary/50'
            )}
          />
        ))}
      </div>
    </div>
  );
}
