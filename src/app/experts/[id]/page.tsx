
import { notFound } from 'next/navigation';
import { experts } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Briefcase, Clock, CheckCircle } from 'lucide-react';
import { BookingForm } from '@/components/booking-form';

export default function ExpertProfilePage({ params }: { params: { id: string } }) {
  const expert = experts.find((e) => e.id === params.id);

  if (!expert) {
    notFound();
  }

  return (
    <div className="container py-12 md:py-20">
        {/* Profile Header */}
        <div className="relative mb-12">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-32 w-32 border-4 border-background ring-2 ring-primary">
                    <AvatarImage src={expert.imageUrl} alt={expert.name} />
                    <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold tracking-tight">{expert.name}</h1>
                    <p className="text-lg text-muted-foreground">{expert.role} at {expert.company}</p>
                    <div className="mt-4">
                        <Button size="lg">Book a Session</Button>
                    </div>
                </div>
                <div className="absolute top-0 right-0 md:relative md:top-auto md:right-auto md:ml-auto">
                    <div className="bg-primary text-primary-foreground font-bold text-lg rounded-full px-5 py-2">
                        ${expert.session.price}
                    </div>
                </div>
            </div>
        </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Left Column: About & Expertise */}
        <div className="lg:col-span-2">
          <div className="grid gap-10">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">About {expert.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{expert.about}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">What to Expect</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {expert.expertise.map((skill) => (
                    <li key={skill} className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>{`Guidance on ${skill}`}</span>
                    </li>
                  ))}
                   <li className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Actionable career advice</span>
                    </li>
                     <li className="flex items-center gap-3 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>In-depth code reviews</span>
                    </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Booking */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
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
  );
}
