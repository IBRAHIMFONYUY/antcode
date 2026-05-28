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
      <div className="overflow-hidden rounded-2xl bg-card shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:border-primary/30 border border-border">
        <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
          <Image
            src={expert.imageUrl}
            alt={expert.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            data-ai-hint="person portrait"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-5 bg-white dark:bg-slate-900">
          <h3 className="font-headline font-semibold text-lg text-foreground leading-snug">
            {expert.name}
          </h3>
          <p className="text-sm font-medium text-primary mt-1">{expert.role}</p>
          <p className="text-xs text-muted-foreground mt-1">{expert.company}</p>
          {expert.expertise.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {expert.expertise.slice(0, 2).map((skill, idx) => (
                <Badge 
                  key={idx}
                  className="bg-gradient-to-r from-primary/90 to-secondary/90 text-white text-xs font-medium px-3 py-1"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
