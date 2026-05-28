import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { Logo } from './logo';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-gradient-to-b from-white to-blue-50 dark:from-slate-950 dark:to-slate-900">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Logo />
            <p className="mt-6 max-w-xs text-muted-foreground leading-relaxed font-medium">
              Accelerate your tech career with expert mentorship and professional guidance.
            </p>
            <div className="mt-8 flex items-center space-x-5">
              <Link href="#" className="text-muted-foreground transition-all duration-200 hover:text-primary hover:scale-110"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground transition-all duration-200 hover:text-primary hover:scale-110"><Github className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground transition-all duration-200 hover:text-primary hover:scale-110"><Linkedin className="h-5 w-5" /></Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:col-span-9">
            <div>
              <h3 className="font-headline font-semibold text-foreground">Platform</h3>
              <ul className="mt-6 space-y-4">
                <li><Link href="/experts" className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block">Experts</Link></li>
                <li><Link href="/courses" className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block">Courses</Link></li>
                <li><Link href="/#features" className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block">Features</Link></li>
                <li><Link href="/#faq" className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-semibold text-foreground">Company</h3>
              <ul className="mt-6 space-y-4">
                <li><Link href="/#about" className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block">About Us</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block">Careers</Link></li>
                <li><Link href="/signup?role=mentor" className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block">For Mentors</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-semibold text-foreground">Resources</h3>
              <ul className="mt-6 space-y-4">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block">Blog</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block">Help Center</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-semibold text-foreground">Legal</h3>
              <ul className="mt-6 space-y-4">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block">Terms of Service</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between border-t border-border/40 pt-8 gap-6 sm:flex-row">
          <p className="text-sm text-muted-foreground font-medium">&copy; {new Date().getFullYear()} AntCodeHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
