import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { Logo } from './logo';

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Logo />
            <p className="mt-4 max-w-xs text-muted-foreground">
              Accelerate your tech career with expert mentorship.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:col-span-9">
            <div>
              <h3 className="font-semibold">Platform</h3>
              <ul className="mt-4 space-y-3">
                <li><Link href="/experts" className="text-muted-foreground hover:text-primary transition-colors">Experts</Link></li>
                <li><Link href="/courses" className="text-muted-foreground hover:text-primary transition-colors">Courses</Link></li>
                <li><Link href="/#features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="/#faq" className="text-muted-foreground hover:text-primary transition-colors">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Company</h3>
              <ul className="mt-4 space-y-3">
                <li><Link href="/#about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
                <li><Link href="/auth/signup?role=mentor" className="text-muted-foreground hover:text-primary transition-colors">For Mentors</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Resources</h3>
              <ul className="mt-4 space-y-3">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Legal</h3>
              <ul className="mt-4 space-y-3">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between border-t pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} AntCodeHub. All rights reserved.</p>
          <div className="mt-4 flex items-center space-x-4 sm:mt-0">
            <Link href="#" className="text-muted-foreground transition-colors hover:text-primary"><Twitter className="h-5 w-5" /></Link>
            <Link href="#" className="text-muted-foreground transition-colors hover:text-primary"><Github className="h-5 w-5" /></Link>
            <Link href="#" className="text-muted-foreground transition-colors hover:text-primary"><Linkedin className="h-5 w-5" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
