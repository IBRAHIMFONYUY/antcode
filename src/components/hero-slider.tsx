'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const heroSlides = [
  {
    title: 'Learn, Build, and Grow with Industry Experts',
    description: 'Combine 1-on-1 mentorship with structured learning paths to accelerate your career in tech. Get guidance from the best in the industry.',
  },
  {
    title: 'Unlock Your Potential with Personalized Mentorship',
    description: 'Connect with top mentors, follow guided learning paths, and achieve your professional goals faster than ever before.',
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={cn(
            'absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out',
            currentSlide === index ? 'opacity-100 animate-fade-in-down' : 'opacity-0'
          )}
        >
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {slide.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {slide.description}
          </p>
        </div>
      ))}
      {/* Buttons are outside the sliding content to remain static */}
      <div className={cn("transition-opacity duration-1000", heroSlides.length > 0 ? 'opacity-100' : 'opacity-0')}>
          {/* This div is used to take up space so buttons are positioned correctly */}
         <div className="invisible">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                {heroSlides[0].title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                {heroSlides[0].description}
            </p>
         </div>
        <div className="mt-16 flex justify-center gap-4">
            <Button size="lg" asChild>
            <Link href="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
            <Link href="/experts">
                Find an Expert <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
