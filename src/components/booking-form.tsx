'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Expert } from '@/lib/types';
import { Progress } from './ui/progress';
import { Label } from '@/components/ui/label';

const bookingSchema = z.object({
  date: z.date({
    required_error: 'A date is required.',
  }),
  duration: z.string({
    required_error: 'Please select a duration.',
  }),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const availableDurations = [
  { duration: 15, price: 156 },
  { duration: 30, price: 312 },
  { duration: 45, price: 468 },
  { duration: 60, price: 600 },
]

export function BookingForm({ expert, onBookingConfirmed }: { expert: Expert; onBookingConfirmed: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      duration: '15'
    }
  });

  async function onSubmit(data: BookingFormValues) {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    toast({
      title: 'Session Booked!',
      description: `Your ${data.duration} minute session with ${expert.name} on ${format(data.date, 'PPP')} has been confirmed.`,
    });
    form.reset();
    onBookingConfirmed();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Select date and time</h3>
            <span className='text-sm text-muted-foreground'>Step 1 of 3</span>
          </div>
          <Progress value={33} className='h-1' />
        </div>
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormControl>
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0,0,0,0))
                    }
                    className="p-0"
                  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="font-semibold">Select duration</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-4"
                >
                  {availableDurations.map((item) => (
                    <FormItem key={item.duration}>
                      <FormControl>
                        <RadioGroupItem value={String(item.duration)} className="sr-only" />
                      </FormControl>
                      <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                        <span>{item.duration} min</span>
                        <span className="text-muted-foreground text-sm">${item.price}</span>
                      </Label>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Confirm & Book
        </Button>
      </form>
    </Form>
  );
}
