'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { experts } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { BookingDialog } from '@/components/booking-dialog';

export default function ExpertProfilePage({ params }: { params: { id: string } }) {
  const expert = experts.find((e) => e.id === params.id);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  if (!expert) {
    notFound();
  }

  return (
    <>
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
                          <Button size="lg" onClick={() => setIsBookingOpen(true)}>Book a Session</Button>
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
                <CardContent className="p-8">
                  <h2 className="text-xl font-bold mb-4">About {expert.name}</h2>
                  <p className="text-muted-foreground leading-relaxed">{expert.about}</p>
                </CardContent>
              </Card>
              
              <Card>
                 <CardContent className="p-8">
                  <h2 className="text-xl font-bold mb-4">What to Expect</h2>
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

          <div className="lg:col-span-1">
            {/* This space can be used for other info or kept clean */}
          </div>
        </div>
      </div>
      <BookingDialog expert={expert} isOpen={isBookingOpen} onOpenChange={setIsBookingOpen} />
    </>
  );
}
