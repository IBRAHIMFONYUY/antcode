
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookingForm } from './booking-form';
import type { Expert } from '@/lib/types';
import { Badge } from './ui/badge';

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
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl grid-cols-1 md:grid-cols-2 p-0 gap-0">
                <div className="p-8 flex flex-col">
                    <div className="flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src={expert.imageUrl} alt={expert.name} />
                            <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-2xl font-bold">{expert.name}</h2>
                        <p className="text-muted-foreground">{expert.role}</p>
                    </div>

                    <div className="mt-8">
                        <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Rate</h3>
                        <div className="bg-primary text-primary-foreground font-bold text-lg rounded-md px-4 py-2 mt-2 inline-block">
                          ${expert.session.price}
                        </div>
                    </div>
                    
                    <div className="mt-8">
                        <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider mb-2">Areas of Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                            {expert.expertise.map(skill => (
                                <Badge key={skill} variant="secondary">{skill}</Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-muted/30">
                    <BookingForm expert={expert} onBookingConfirmed={handleBookingConfirmed} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
