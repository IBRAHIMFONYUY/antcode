
'use client';

import { DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookingForm } from './booking-form';
import type { Expert } from '@/lib/types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { ResponsiveModal } from './responsive-modal';

type BookingDialogProps = {
    expert: Expert;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
};

export function BookingDialog({ expert, isOpen, onOpenChange }: BookingDialogProps) {
    
    const handleBookingConfirmed = () => {
        // The success step is now handled inside the form,
        // but we still want to close the modal after a delay or user action.
        // For now, we can let the form handle it.
        // If the success step had a "close" button, it would call onOpenChange(false)
    }
    
    return (
        <ResponsiveModal isOpen={isOpen} onOpenChange={onOpenChange} className="max-w-4xl p-0">
            <DialogTitle className="sr-only">Book a session with {expert.name}</DialogTitle>
             <div className="flex h-full max-h-[90vh] flex-col">
                {/* Right Column: Booking Form */}
                <div className="relative flex-1">
                     <BookingForm expert={expert} onBookingConfirmed={handleBookingConfirmed} onOpenChange={onOpenChange} />
                </div>
            </div>
        </ResponsiveModal>
    );
}
