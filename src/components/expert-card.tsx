
'use client';
import Link from 'next/link';
import type { Expert } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight, Star } from 'lucide-react';

type ExpertCardProps = {
  expert: Expert;
};

export function ExpertCard({ expert }: ExpertCardProps) {
  return (
    <Link href={`/experts/${expert.id}`} className="group block">
      <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 group-hover:border-primary/60 group-hover:shadow-lg group-hover:shadow-primary/10">
        <CardHeader className="flex flex-row items-start gap-4 p-4">
          <Avatar className="h-16 w-16 border-2 border-transparent group-hover:border-primary transition-colors">
            <AvatarImage src={expert.imageUrl} alt={expert.name} data-ai-hint="person smiling" />
            <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-bold leading-tight">{expert.name}</h3>
            <p className="text-sm text-muted-foreground">{expert.role}</p>
            <p className="text-sm font-medium text-primary">{expert.company}</p>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4 pt-0">
          <div className="flex flex-wrap gap-2">
            {expert.expertise.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </CardContent>
        <div className="flex items-center justify-between border-t p-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-semibold text-foreground">{expert.rating}</span>
            <span className="hidden sm:inline">({expert.reviews} reviews)</span>
          </div>
          <div className="flex items-center text-sm font-semibold">
            <span>${expert.session.price} / session</span>
            <ArrowRight className="ml-2 h-4 w-4 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
