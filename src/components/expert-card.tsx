import Link from 'next/link';
import Image from 'next/image';
import type { Expert } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type ExpertCardProps = {
  expert: Expert;
  className?: string;
};

export function ExpertCard({ expert, className }: ExpertCardProps) {
  return (
    <Link href={`/experts/${expert.id}`} className={cn("group block", className)}>
      <div className="overflow-hidden rounded-xl">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={expert.imageUrl}
            alt={expert.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            data-ai-hint="person portrait"
          />
        </div>
        <div className="p-4 bg-card">
          <h3 className="font-semibold text-lg text-foreground">
            {expert.name}, <span className="text-muted-foreground">{expert.role}</span>
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{expert.company}</p>
          {expert.expertise.length > 0 && (
            <div className="mt-3">
              <Badge variant="secondary" className="bg-secondary/80 text-secondary-foreground/80 font-normal">
                {expert.expertise[0]}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
