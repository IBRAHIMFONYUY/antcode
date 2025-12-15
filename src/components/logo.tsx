import { cn } from '@/lib/utils';
import Link from 'next/link';

type LogoProps = {
  className?: string;
  isDashboard?: boolean;
};

export function Logo({ className, isDashboard = false }: LogoProps) {
  return (
    <Link href={isDashboard ? '/dashboard' : '/'} className={cn('flex items-center gap-2', className)}>
      <span className="font-headline text-xl font-bold">
        AntCodeHub
      </span>
    </Link>
  );
}
