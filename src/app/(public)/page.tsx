'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Book, Briefcase, Users, Code, Bot, BrainCircuit, Goal, Lightbulb, UserCheck, Network, GraduationCap, Telescope, Library, Star, Shield, Rocket } from 'lucide-react';
import { experts, faqs } from '@/lib/data';
import { ExpertCard } from '@/components/expert-card';
import { Faq } from '@/components/faq';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { HeroSlider } from '@/components/hero-slider';
import { FloatingParticles } from '@/components/floating-particles';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const featuredExperts = experts.slice(0, 6);
  const aboutImage = PlaceHolderImages.find(img => img.id === 'expert-7');
  const communityImage = PlaceHolderImages.find(img => img.id === 'expert-8');

  const offerings = [
    {
      icon: GraduationCap,
      title: 'Coding Bootcamps',
      description: 'Intensive, hands-on training programs in web development, mobile app development, data science, and more.',
      details: ['8-12 week programs', 'Project-based learning', 'Industry mentors'],
    },
    {
      icon: Users,
      title: 'Mentorship Programs',
      description: 'One-on-one guidance from industry professionals to help you navigate your tech career journey.',
      details: ['Personalized guidance', 'Career planning', 'Regular check-ins'],
    },
    {
      icon: Briefcase,
      title: 'Career Services',
      description: 'Comprehensive support to help you land your dream job in the tech industry.',
      details: ['Resume building', 'Interview preparation', 'Job placement assistance'],
    },
    {
        icon: Network,
        title: 'Community Events',
        description: 'Regular meetups, workshops, and hackathons to connect, learn, and grow together.',
        details: ['Tech talks', 'Networking sessions', 'Hackathons'],
    },
    {
        icon: Telescope,
        title: 'Innovation Lab',
        description: 'A collaborative space to work on real-world projects and bring your ideas to life.',
        details: ['Access to equipment', 'Technical support', 'Collaborative environment'],
    },
    {
        icon: Library,
        title: 'Resource Library',
        description: 'Access to a vast collection of learning materials, tools, and resources to support your tech journey.',
        details: ['Digital courses', 'Software licenses', 'Technical documentation'],
    },
  ];


  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className={cn('relative', 'overflow-hidden', 'min-h-screen', 'flex', 'items-center', 'justify-center', 'text-center', 'bg-gradient-to-b', 'from-background', 'via-background/95', 'to-background')}>
        <FloatingParticles />
        
        {/* Animated gradient blobs */}
        <div className={cn('absolute', 'top-1/4', 'left-1/4', 'w-96', 'h-96', 'bg-primary/20', 'rounded-full', 'blur-3xl', 'animate-blob')} />
        <div className={cn('absolute', 'top-1/3', 'right-1/4', 'w-96', 'h-96', 'bg-accent/20', 'rounded-full', 'blur-3xl', 'animate-blob', 'animation-delay-2000')} />
        <div className={cn('absolute', 'bottom-1/4', 'left-1/3', 'w-96', 'h-96', 'bg-primary/10', 'rounded-full', 'blur-3xl', 'animate-blob', 'animation-delay-4000')} />
        
        <div className={cn('container', 'relative', 'z-10')}>
          <div className={cn('absolute', 'top-1/2', 'left-1/2', '-translate-x-1/2', '-translate-y-1/2', 'w-[200%]', 'h-[200%]', 'md:w-[150%]', 'md:h-[150%]', 'lg:w-[100%]', 'lg:h-[100%]', 'bg-grid-pattern', 'opacity-10', 'animate-spin-slow')}></div>
          
          <HeroSlider />
        </div>
      </section>

      {/* Expert Showcase Section */}
      <section className={cn('relative', 'py-24', 'md:py-32', 'bg-gradient-to-b', 'from-background', 'to-muted/50')}>
        <div className="container">
          <div className={cn('text-center', 'mb-16')}>
            <div className={cn('inline-flex', 'items-center', 'gap-2', 'px-4', 'py-2', 'rounded-full', 'bg-primary/10', 'text-primary', 'text-sm', 'font-medium', 'mb-4')}>
              <Star className={cn('h-4', 'w-4')} />
              Top-Rated Mentors
            </div>
            <h2 className={cn('font-headline', 'text-4xl', 'md:text-5xl', 'font-bold', 'tracking-tight', 'mb-4')}>
              Meet Our Experts
            </h2>
            <p className={cn('mx-auto', 'max-w-2xl', 'text-lg', 'text-muted-foreground')}>
              Hand-picked professionals ready to guide you on your tech journey
            </p>
          </div>
          <div className={cn('mt-12', 'grid', 'grid-cols-1', 'gap-8', 'sm:grid-cols-2', 'lg:grid-cols-3')}>
            {featuredExperts.map((expert, index) => (
                <div key={expert.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <ExpertCard expert={expert} />
                </div>
            ))}
          </div>
          <div className={cn('mt-16', 'text-center')}>
             <Button size="lg" variant="outline" asChild className={cn('group', 'border-2', 'hover:border-primary/50', 'transition-all', 'duration-300', 'hover:scale-105')}>
              <Link href="/experts" className="group">
                Explore All Experts <ArrowRight className={cn('ml-2', 'h-4', 'w-4', 'transition-transform', 'group-hover:translate-x-1')} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={cn('py-24', 'md:py-32', 'bg-gradient-to-b', 'from-muted/50', 'to-background')}>
          <div className="container">
            <div className={cn('text-center', 'max-w-3xl', 'mx-auto', 'mb-16')}>
              <div className={cn('inline-flex', 'items-center', 'gap-2', 'px-4', 'py-2', 'rounded-full', 'bg-accent/10', 'text-accent', 'text-sm', 'font-medium', 'mb-4')}>
                <Rocket className={cn('h-4', 'w-4')} />
                Our Story
              </div>
              <h2 className={cn('font-headline', 'text-4xl', 'md:text-5xl', 'font-bold', 'tracking-tight', 'mb-6')}>About AntCodeHub</h2>
              <p className={cn('text-muted-foreground', 'text-lg', 'leading-relaxed')}>
                AntCodeHub is an initiative that empowers youth in tech to achieve their dream tech lives in a successful way. We provide mentorship, resources, and a supportive community to help aspiring tech professionals thrive.
              </p>
            </div>
            <div className={cn('mt-16', 'grid', 'md:grid-cols-3', 'gap-8')}>
              <div className={cn('group', 'bg-card/50', 'backdrop-blur-sm', 'p-8', 'rounded-2xl', 'shadow-lg', 'border', 'border-border/50', 'hover:border-primary/50', 'transition-all', 'duration-300', 'hover:scale-105', 'hover:shadow-xl')}>
                <div className={cn('bg-primary/10', 'w-16', 'h-16', 'rounded-2xl', 'flex', 'items-center', 'justify-center', 'mb-6', 'group-hover:bg-primary/20', 'transition-colors')}>
                  <Goal className={cn('h-8', 'w-8', 'text-primary')} />
                </div>
                <h3 className={cn('text-xl', 'font-bold', 'mb-3')}>Our Mission</h3>
                <p className={cn('text-muted-foreground', 'leading-relaxed')}>To bridge the gap between education and industry by providing practical tech skills.</p>
              </div>
              <div className={cn('group', 'bg-card/50', 'backdrop-blur-sm', 'p-8', 'rounded-2xl', 'shadow-lg', 'border', 'border-border/50', 'hover:border-primary/50', 'transition-all', 'duration-300', 'hover:scale-105', 'hover:shadow-xl')}>
                <div className={cn('bg-primary/10', 'w-16', 'h-16', 'rounded-2xl', 'flex', 'items-center', 'justify-center', 'mb-6', 'group-hover:bg-primary/20', 'transition-colors')}>
                  <Lightbulb className={cn('h-8', 'w-8', 'text-primary')} />
                </div>
                <h3 className={cn('text-xl', 'font-bold', 'mb-3')}>Our Vision</h3>
                <p className={cn('text-muted-foreground', 'leading-relaxed')}>To create a world where every young person has the opportunity to excel in tech.</p>
              </div>
              <div className={cn('group', 'bg-card/50', 'backdrop-blur-sm', 'p-8', 'rounded-2xl', 'shadow-lg', 'border', 'border-border/50', 'hover:border-primary/50', 'transition-all', 'duration-300', 'hover:scale-105', 'hover:shadow-xl')}>
                <div className={cn('bg-primary/10', 'w-16', 'h-16', 'rounded-2xl', 'flex', 'items-center', 'justify-center', 'mb-6', 'group-hover:bg-primary/20', 'transition-colors')}>
                  <Users className={cn('h-8', 'w-8', 'text-primary')} />
                </div>
                <h3 className={cn('text-xl', 'font-bold', 'mb-3')}>Our Community</h3>
                <p className={cn('text-muted-foreground', 'leading-relaxed')}>A diverse network of learners, mentors, and industry professionals working together.</p>
              </div>
            </div>
          </div>
      </section>

       {/* Why Choose Us Section */}
      <section id="why-choose-us" className={cn('py-24', 'md:py-32', 'bg-gradient-to-b', 'from-background', 'to-muted/50')}>
        <div className="container">
          <div className={cn('grid', 'md:grid-cols-2', 'gap-12', 'items-center')}>
            <div className={cn('relative', 'h-[500px]', 'rounded-2xl', 'overflow-hidden', 'shadow-2xl', 'group')}>
                {communityImage && (
                    <Image
                        src={communityImage.imageUrl}
                        alt="Community learning"
                        fill
                        className={cn('object-cover', 'transition-transform', 'duration-700', 'group-hover:scale-105')}
                        data-ai-hint={communityImage.imageHint}
                    />
                )}
                <div className={cn('absolute', 'inset-0', 'bg-gradient-to-t', 'from-primary/20', 'to-transparent')} />
            </div>
            <div>
              <div className={cn('inline-flex', 'items-center', 'gap-2', 'px-4', 'py-2', 'rounded-full', 'bg-primary/10', 'text-primary', 'text-sm', 'font-medium', 'mb-4')}>
                <Shield className={cn('h-4', 'w-4')} />
                Why Choose Us
              </div>
              <h2 className={cn('font-headline', 'text-4xl', 'md:text-5xl', 'font-bold', 'tracking-tight', 'mb-8')}>Why Choose AntCodeHub?</h2>
              <ul className="space-y-6">
                <li className={cn('flex', 'items-start', 'gap-4', 'group')}>
                  <div className={cn('bg-primary/10', 'text-primary', 'p-3', 'rounded-xl', 'group-hover:bg-primary', 'group-hover:text-primary-foreground', 'transition-all', 'duration-300')}><Book className={cn('h-6', 'w-6')} /></div>
                  <div>
                    <h3 className={cn('text-xl', 'font-bold', 'mb-2')}>Industry-Relevant Curriculum</h3>
                    <p className={cn('text-muted-foreground', 'leading-relaxed')}>Our programs are designed in collaboration with industry experts to ensure you learn skills that are in demand.</p>
                  </div>
                </li>
                <li className={cn('flex', 'items-start', 'gap-4', 'group')}>
                  <div className={cn('bg-primary/10', 'text-primary', 'p-3', 'rounded-xl', 'group-hover:bg-primary', 'group-hover:text-primary-foreground', 'transition-all', 'duration-300')}><Code className={cn('h-6', 'w-6')} /></div>
                  <div>
                    <h3 className={cn('text-xl', 'font-bold', 'mb-2')}>Hands-on Learning</h3>
                    <p className={cn('text-muted-foreground', 'leading-relaxed')}>We believe in learning by doing. Our project-based approach ensures you build a portfolio while you learn.</p>
                  </div>
                </li>
                 <li className={cn('flex', 'items-start', 'gap-4', 'group')}>
                  <div className={cn('bg-primary/10', 'text-primary', 'p-3', 'rounded-xl', 'group-hover:bg-primary', 'group-hover:text-primary-foreground', 'transition-all', 'duration-300')}><UserCheck className={cn('h-6', 'w-6')} /></div>
                  <div>
                    <h3 className={cn('text-xl', 'font-bold', 'mb-2')}>Mentorship & Support</h3>
                    <p className={cn('text-muted-foreground', 'leading-relaxed')}>Get guidance from experienced professionals who are passionate about helping you succeed.</p>
                  </div>
                </li>
                 <li className={cn('flex', 'items-start', 'gap-4', 'group')}>
                  <div className={cn('bg-primary/10', 'text-primary', 'p-3', 'rounded-xl', 'group-hover:bg-primary', 'group-hover:text-primary-foreground', 'transition-all', 'duration-300')}><Network className={cn('h-6', 'w-6')} /></div>
                  <div>
                    <h3 className={cn('text-xl', 'font-bold', 'mb-2')}>Networking Opportunities</h3>
                    <p className={cn('text-muted-foreground', 'leading-relaxed')}>Connect with peers, alumni, and industry professionals through our events and community platform.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section id="features" className={cn('py-24', 'md:py-32', 'bg-gradient-to-b', 'from-muted/50', 'to-background')}>
        <div className="container">
          <div className={cn('text-center', 'max-w-3xl', 'mx-auto', 'mb-16')}>
            <div className={cn('inline-flex', 'items-center', 'gap-2', 'px-4', 'py-2', 'rounded-full', 'bg-accent/10', 'text-accent', 'text-sm', 'font-medium', 'mb-4')}>
              <Star className={cn('h-4', 'w-4')} />
              Our Services
            </div>
            <h2 className={cn('font-headline', 'text-4xl', 'md:text-5xl', 'font-bold', 'tracking-tight', 'mb-6')}>
              What We Offer
            </h2>
            <p className={cn('mx-auto', 'text-lg', 'text-muted-foreground', 'leading-relaxed')}>
              Our comprehensive programs and services are designed to equip you with the skills, knowledge, and connections needed to thrive in the tech industry.
            </p>
          </div>
          <div className={cn('mt-16', 'grid', 'grid-cols-1', 'gap-8', 'md:grid-cols-2', 'lg:grid-cols-3')}>
              {offerings.map((offering, index) => (
                <div key={offering.title} className={cn('group', 'bg-card/50', 'backdrop-blur-sm', 'p-8', 'rounded-2xl', 'shadow-lg', 'border', 'border-border/50', 'flex', 'flex-col', 'hover:border-primary/50', 'transition-all', 'duration-300', 'hover:scale-105', 'hover:shadow-xl', 'animate-slide-up')} style={{ animationDelay: `${index * 100}ms` }}>
                  <div className={cn('bg-primary/10', 'w-14', 'h-14', 'rounded-2xl', 'flex', 'items-center', 'justify-center', 'mb-6', 'group-hover:bg-primary', 'group-hover:text-primary-foreground', 'transition-all', 'duration-300')}>
                    <offering.icon className={cn('h-7', 'w-7', 'text-primary', 'group-hover:text-primary-foreground')} />
                  </div>
                  <h3 className={cn('text-xl', 'font-bold', 'mb-3')}>{offering.title}</h3>
                  <p className={cn('text-muted-foreground', 'flex-grow', 'leading-relaxed')}>{offering.description}</p>
                  <Button variant="link" className={cn('p-0', 'h-auto', 'justify-start', 'mt-6', 'text-primary', 'group-hover:translate-x-1', 'transition-transform', 'duration-300')}>
                    Learn More <ArrowRight className={cn('ml-2', 'h-4', 'w-4')} />
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className={cn('py-24', 'md:py-32', 'bg-gradient-to-b', 'from-background', 'to-muted/50')}>
        <div className="container">
          <div className={cn('text-center', 'mb-16')}>
            <div className={cn('inline-flex', 'items-center', 'gap-2', 'px-4', 'py-2', 'rounded-full', 'bg-primary/10', 'text-primary', 'text-sm', 'font-medium', 'mb-4')}>
              <Lightbulb className={cn('h-4', 'w-4')} />
              Got Questions?
            </div>
            <h2 className={cn('font-headline', 'text-4xl', 'md:text-5xl', 'font-bold', 'tracking-tight', 'mb-6')}>
              Frequently Asked Questions
            </h2>
            <p className={cn('mx-auto', 'max-w-2xl', 'text-lg', 'text-muted-foreground', 'leading-relaxed')}>
              Have questions? We have answers. If you can't find what you're looking for, feel free to contact us.
            </p>
          </div>
          <div className={cn('mt-12', 'mx-auto', 'max-w-4xl', 'bg-card/50', 'backdrop-blur-sm', 'border', 'border-border/50', 'rounded-2xl', 'p-6', 'shadow-lg')}>
            <Faq items={faqs.slice(0, 8)} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={cn('py-24', 'md:py-32', 'bg-gradient-to-b', 'from-muted/50', 'to-background')}>
        <div className="container">
          <div className={cn('max-w-4xl', 'mx-auto', 'text-center', 'bg-gradient-to-br', 'from-primary', 'to-primary/80', 'p-12', 'md:p-16', 'rounded-3xl', 'shadow-2xl', 'relative', 'overflow-hidden')}>
            <div className={cn('absolute', 'top-0', 'right-0', 'w-64', 'h-64', 'bg-white/10', 'rounded-full', 'blur-3xl', '-translate-y-1/2', 'translate-x-1/2')} />
            <div className={cn('absolute', 'bottom-0', 'left-0', 'w-64', 'h-64', 'bg-white/10', 'rounded-full', 'blur-3xl', 'translate-y-1/2', '-translate-x-1/2')} />
            <div className={cn('relative', 'z-10')}>
              <h2 className={cn('font-headline', 'text-3xl', 'md:text-4xl', 'font-bold', 'tracking-tight', 'text-primary-foreground', 'mb-6')}>
                Ready to Start Your Tech Journey?
              </h2>
              <p className={cn('text-lg', 'text-primary-foreground/90', 'mb-8', 'max-w-2xl', 'mx-auto', 'leading-relaxed')}>
                Join thousands of learners who have transformed their careers with AntCodeHub. Get started today and unlock your potential.
              </p>
              <div className={cn('flex', 'flex-col', 'sm:flex-row', 'gap-4', 'justify-center')}>
                <Button size="lg" asChild className={cn('bg-background', 'text-foreground', 'hover:bg-background/90', 'border-2', 'border-transparent', 'hover:border-primary/30', 'transition-all', 'duration-300', 'hover:scale-105')}>
                  <Link href="/signup">
                    Get Started Free
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className={cn('bg-transparent', 'text-primary-foreground', 'border-2', 'border-primary-foreground/30', 'hover:bg-primary-foreground/10', 'hover:border-primary-foreground/50', 'transition-all', 'duration-300', 'hover:scale-105')}>
                  <Link href="/experts" className="group">
                    Explore Experts <ArrowRight className={cn('ml-2', 'h-4', 'w-4', 'transition-transform', 'group-hover:translate-x-1')} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
