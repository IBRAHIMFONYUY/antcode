import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Book, Briefcase, Users, Code, Bot, BrainCircuit } from 'lucide-react';
import { experts, faqs } from '@/lib/data';
import { ExpertCard } from '@/components/expert-card';
import { Faq } from '@/components/faq';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const featuredExperts = experts.slice(0, 6);
  const aboutImage = PlaceHolderImages.find(img => img.id === 'expert-7');

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

      {/* About Section */}
      <section id="about" className="py-20 md:py-28">
          <div className="container">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                      <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl mb-6">About AntCodeHub</h2>
                      <p className="text-muted-foreground text-lg mb-4">
                          AntCodeHub was founded on a simple principle: the fastest way to grow in your tech career is by learning directly from those who have already walked the path. We bridge the gap between aspiring developers and seasoned industry experts.
                      </p>
                      <p className="text-muted-foreground text-lg">
                          Our platform is more than just a marketplace for mentors. It's a comprehensive ecosystem designed for structured learning, hands-on project experience, and meaningful professional connections. We're here to empower you to not just learn, but to build, innovate, and lead.
                      </p>
                  </div>
                  <div className="relative h-[400px] rounded-xl overflow-hidden">
                      {aboutImage && (
                          <Image
                              src={aboutImage.imageUrl}
                              alt="Developer working"
                              fill
                              className="object-cover"
                              data-ai-hint={aboutImage.imageHint}
                          />
                      )}
                  </div>
              </div>
          </div>
      </section>

      {/* What We Offer Section */}
      <section id="features" className="bg-muted py-20 md:py-28">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              A Better Way to Learn and Grow
            </h2>
            <p className="mx-auto mt-4 text-lg text-muted-foreground">
              Our platform combines the best of mentorship, structured education, and AI-powered tools to accelerate your journey.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-card p-8 rounded-xl shadow-sm">
                  <Users className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">1-on-1 Mentorship</h3>
                  <p className="text-muted-foreground">Connect with vetted industry experts for personalized guidance, code reviews, and career advice tailored to your specific goals.</p>
              </div>
              <div className="bg-card p-8 rounded-xl shadow-sm">
                  <Book className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">Guided Learning Paths</h3>
                  <p className="text-muted-foreground">Follow structured courses co-created with top mentors, featuring real-world projects that build a standout portfolio.</p>
              </div>
              <div className="bg-card p-8 rounded-xl shadow-sm">
                  <BrainCircuit className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">AI-Powered Task Review</h3>
                  <p className="text-muted-foreground">Get instant, intelligent feedback on your project submissions, helping you identify knowledge gaps and improve faster.</p>
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
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredExperts.map((expert) => (
                <ExpertCard key={expert.id} expert={expert} />
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

      {/* FAQ Section */}
      <section id="faq" className="border-t py-20 md:py-28">
        <div className="container">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Have questions? We have answers. If you can't find what you're looking for, feel free to contact us.
            </p>
          </div>
          <div className="mt-12 mx-auto max-w-4xl">
            <Faq items={faqs} />
          </div>
        </div>
      </section>
    </div>
  );
}
