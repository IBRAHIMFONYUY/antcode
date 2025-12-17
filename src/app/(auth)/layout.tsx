import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { Logo } from '@/components/logo';
import { Loader2 } from 'lucide-react';

function AuthLoading() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dark flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground">
        <div className='mb-8'>
            <Logo />
        </div>
      <Suspense fallback={<AuthLoading />}>
        {children}
      </Suspense>
    </div>
  );
}
