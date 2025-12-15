import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Book, Briefcase, Users } from 'lucide-react';
import { experts } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const featuredExperts = experts.slice(0, 6);

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 flex items-center justify-center text-center">
        <div className="container relative z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] md:w-[150%] md:h-[150%] lg:w-[100%] lg:h-[100%] bg-grid-pattern opacity-20 animate-spin-slow"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 rounded-full blur-3xl"></div>
          
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Learn, Build, and Grow with Industry Experts
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Combine 1-on-1 mentorship with structured learning paths to accelerate your career in tech. Get guidance from the best in the industry.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/experts">
                Find an Expert <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value Stats Section */}
      <section className="bg-muted py-16">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
            <div className="flex flex-col items-center gap-2">
              <Users className="h-10 w-10 text-accent" />
              <p className="text-3xl font-bold">100+ Mentors</p>
              <p className="text-muted-foreground">From top-tier companies</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Book className="h-10 w-10 text-accent" />
              <p className="text-3xl font-bold">Guided Learning Paths</p>
              <p className="text-muted-foreground">Curated by industry veterans</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Briefcase className="h-10 w-10 text-accent" />
              <p className="text-3xl font-bold">Real-World Projects</p>
              <p className="text-muted-foreground">Build a portfolio that stands out</p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Showcase Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Meet Our Experts
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Hand-picked professionals ready to guide you.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredExperts.map((expert) => (
                <Card key={expert.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                    <CardContent className="p-6 text-center">
                        <Link href={`/experts/${expert.id}`}>
                            <Avatar className="mx-auto h-24 w-24 border-4 border-background ring-2 ring-primary">
                                <AvatarImage src={expert.imageUrl} alt={expert.name} data-ai-hint="person smiling" />
                                <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </Link>
                        <h3 className="mt-4 text-xl font-semibold"><Link href={`/experts/${expert.id}`}>{expert.name}</Link></h3>
                        <p className="mt-1 text-muted-foreground">{expert.role} at <span className="font-medium text-primary">{expert.company}</span></p>
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                            {expert.expertise.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="secondary">{skill}</Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
             <Button size="lg" variant="outline" asChild>
              <Link href="/experts">
                Explore All Experts <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
