
'use client';

import { DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookingForm } from './booking-form';
import type { Expert } from '@/lib/types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { ResponsiveModal } from './responsive-modal';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

type BookingDialogProps = {
    expert: Expert;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
};

export function BookingDialog({ expert, isOpen, onOpenChange }: BookingDialogProps) {
    
    const handleBookingConfirmed = () => {
        onOpenChange(false);
    }
    
    return (
        <ResponsiveModal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-4xl p-0">
            <DialogTitle className="sr-only">Book a session with {expert.name}</DialogTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 h-full max-h-[90vh]">
                {/* Left Column: Expert Info */}
                <div className="hidden md:flex flex-col gap-6 p-8 bg-muted/50">
                     <div className="flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src={expert.imageUrl} alt={expert.name} />
                            <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-xl font-bold">{expert.name}</h2>
                        <p className="text-muted-foreground">{expert.role}</p>
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="text-sm font-semibold text-muted-foreground mb-2">RATE</p>
                            <Badge variant="secondary" className="text-lg font-bold">${expert.session.price} / {expert.session.duration} min</Badge>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-muted-foreground mb-2">AREAS OF EXPERTISE</p>
                             <div className="flex flex-wrap gap-2">
                                {expert.expertise.map(skill => (
                                    <Badge key={skill} variant="outline" className='font-normal'>{skill}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Booking Form */}
                <div className="md:col-span-2 relative">
                    <ScrollArea className="h-[90vh] md:h-auto">
                        <div className="p-6 md:p-8">
                            <BookingForm expert={expert} onBookingConfirmed={handleBookingConfirmed} />
                        </div>
                    </ScrollArea>
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="shrink-0 absolute top-4 right-4">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </Button>
                </div>
            </div>
        </ResponsiveModal>
    );
}
