import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Book, Briefcase, Users, Code, Bot, BrainCircuit, Goal, Lightbulb, UserCheck, Network, GraduationCap, Telescope, Library } from 'lucide-react';
import { experts, faqs } from '@/lib/data';
import { ExpertCard } from '@/components/expert-card';
import { Faq } from '@/components/faq';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl mb-4">About AntCodeHub</h2>
              <p className="text-muted-foreground text-lg">
                AntCodeHub is an initiative that empowers youth in tech to achieve their dream tech lives in a successful way. We provide mentorship, resources, and a supportive community to help aspiring tech professionals thrive.
              </p>
            </div>
            <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-card p-8 rounded-xl shadow-sm border">
                <Goal className="h-10 w-10 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Our Mission</h3>
                <p className="text-muted-foreground">To bridge the gap between education and industry by providing practical tech skills.</p>
              </div>
              <div className="bg-card p-8 rounded-xl shadow-sm border">
                <Lightbulb className="h-10 w-10 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Our Vision</h3>
                <p className="text-muted-foreground">To create a world where every young person has the opportunity to excel in tech.</p>
              </div>
              <div className="bg-card p-8 rounded-xl shadow-sm border">
                <Users className="h-10 w-10 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2">Our Community</h3>
                <p className="text-muted-foreground">A diverse network of learners, mentors, and industry professionals working together.</p>
              </div>
            </div>
          </div>
      </section>

       {/* Why Choose Us Section */}
      <section id="why-choose-us" className="bg-muted py-20 md:py-28">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[450px] rounded-xl overflow-hidden">
                {communityImage && (
                    <Image
                        src={communityImage.imageUrl}
                        alt="Community learning"
                        fill
                        className="object-cover"
                        data-ai-hint={communityImage.imageHint}
                    />
                )}
            </div>
            <div>
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl mb-6">Why Choose AntCodeHub?</h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-full"><Book className="h-6 w-6" /></div>
                  <div>
                    <h3 className="text-xl font-bold">Industry-Relevant Curriculum</h3>
                    <p className="text-muted-foreground mt-1">Our programs are designed in collaboration with industry experts to ensure you learn skills that are in demand.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-full"><Code className="h-6 w-6" /></div>
                  <div>
                    <h3 className="text-xl font-bold">Hands-on Learning</h3>
                    <p className="text-muted-foreground mt-1">We believe in learning by doing. Our project-based approach ensures you build a portfolio while you learn.</p>
                  </div>
                </li>
                 <li className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-full"><UserCheck className="h-6 w-6" /></div>
                  <div>
                    <h3 className="text-xl font-bold">Mentorship & Support</h3>
                    <p className="text-muted-foreground mt-1">Get guidance from experienced professionals who are passionate about helping you succeed.</p>
                  </div>
                </li>
                 <li className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-full"><Network className="h-6 w-6" /></div>
                  <div>
                    <h3 className="text-xl font-bold">Networking Opportunities</h3>
                    <p className="text-muted-foreground mt-1">Connect with peers, alumni, and industry professionals through our events and community platform.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section id="features" className="py-20 md:py-28">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              What We Offer
            </h2>
            <p className="mx-auto mt-4 text-lg text-muted-foreground">
              Our comprehensive programs and services are designed to equip you with the skills, knowledge, and connections needed to thrive in the tech industry.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {offerings.map((offering) => (
                <div key={offering.title} className="bg-card p-8 rounded-xl shadow-sm border flex flex-col">
                  <offering.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">{offering.title}</h3>
                  <p className="text-muted-foreground flex-grow">{offering.description}</p>
                  <Button variant="link" className="p-0 h-auto justify-start mt-4 text-primary">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Expert Showcase Section */}
      <section className="bg-muted py-20 md:py-28">
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
      <section id="faq" className="py-20 md:py-28">
        <div className="container">
          <div className="text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Have questions? We have answers. If you can't find what you're looking for, feel free to contact us.
            </p>
          </div>
          <div className="mt-12 mx-auto max-w-4xl bg-card border rounded-xl p-2">
            <Faq items={faqs.slice(0, 8)} />
          </div>
        </div>
      </section>
    </div>
  );
}
