import type { ReactNode } from 'react';
import { Logo } from '@/components/logo';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dark flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground">
        <div className='mb-8'>
            <Logo />
        </div>
      {children}
    </div>
  );
}
