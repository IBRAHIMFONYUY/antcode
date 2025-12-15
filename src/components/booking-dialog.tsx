
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
            <div className="flex flex-col h-full">
                <div className="p-6 border-b">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={expert.imageUrl} alt={expert.name} />
                                <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-xl font-bold">{expert.name}</h2>
                                <p className="text-muted-foreground">{expert.role}</p>
                                <p className="font-semibold mt-1">${expert.session.price} / {expert.session.duration} min</p>
                            </div>
                        </div>
                            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="shrink-0 absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {expert.expertise.map(skill => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-6">
                        <BookingForm expert={expert} onBookingConfirmed={handleBookingConfirmed} />
                    </div>
                </ScrollArea>
            </div>
        </ResponsiveModal>
    );
}
