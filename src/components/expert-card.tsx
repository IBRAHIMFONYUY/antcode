import Link from 'next/link';
import type { Expert } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Star } from 'lucide-react';

type ExpertCardProps = {
  expert: Expert;
};

export function ExpertCard({ expert }: ExpertCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="flex justify-center p-6">
            <Avatar className="h-24 w-24 border-4 border-background ring-2 ring-primary">
                <AvatarImage src={expert.imageUrl} alt={expert.name} data-ai-hint="person smiling" />
                <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
            </Avatar>
        </div>
      </CardHeader>
      <CardContent className="flex-grow text-center">
        <h3 className="text-xl font-bold">{expert.name}</h3>
        <p className="mt-1 text-muted-foreground">{expert.role} at <span className="font-medium text-primary">{expert.company}</span></p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {expert.expertise.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary">{skill}</Badge>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-1 text-muted-foreground">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-semibold text-foreground">{expert.rating}</span>
            <span>({expert.reviews} reviews)</span>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 p-4">
        <div className="text-lg font-semibold">
            ${expert.session.price} / {expert.session.duration} min session
        </div>
        <Button className="w-full" asChild>
          <Link href={`/experts/${expert.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
