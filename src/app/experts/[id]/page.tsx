import { notFound } from 'next/navigation';
import { experts } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Briefcase, Clock } from 'lucide-react';
import { BookingForm } from '@/components/booking-form';

export default function ExpertProfilePage({ params }: { params: { id: string } }) {
  const expert = experts.find((e) => e.id === params.id);

  if (!expert) {
    notFound();
  }

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {/* Left Column: Profile & Info */}
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="items-center text-center">
              <Avatar className="h-32 w-32 border-4 border-background ring-2 ring-primary">
                <AvatarImage src={expert.imageUrl} alt={expert.name} />
                <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="pt-4 text-3xl">{expert.name}</CardTitle>
              <CardDescription className="text-base">{expert.role} at <span className="font-semibold text-primary">{expert.company}</span></CardDescription>
              <div className="flex items-center gap-1 pt-2 text-muted-foreground">
                <Star className="h-5 w-5 fill-accent text-accent" />
                <span className="font-bold text-foreground">{expert.rating}</span>
                <span>({expert.reviews} reviews)</span>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex justify-around border-t pt-4">
                  <div className="text-center">
                      <p className="text-2xl font-bold">${expert.session.price}</p>
                      <p className="text-sm text-muted-foreground">per session</p>
                  </div>
                  <div className="text-center">
                      <p className="text-2xl font-bold">{expert.session.duration}</p>
                      <p className="text-sm text-muted-foreground">min session</p>
                  </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: About & Booking */}
        <div className="md:col-span-2">
          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>About {expert.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{expert.about}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Proficiency</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {expert.expertise.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm">
                    {skill}
                  </Badge>
                ))}
              </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Book a Session</CardTitle>
                    <CardDescription>Choose a date and time that works for you.</CardDescription>
                </CardHeader>
                <CardContent>
                    <BookingForm expert={expert} />
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
