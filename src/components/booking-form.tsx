
'use client';

import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, ArrowLeft, Lock, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Expert } from '@/lib/types';
import { Progress } from './ui/progress';
import { Label } from '@/components/ui/label';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';

const bookingSchema = z.object({
  date: z.date({ required_error: 'A date is required.' }),
  time: z.string({ required_error: 'A time is required.' }),
  duration: z.string({ required_error: 'Please select a duration.' }),
  goal: z.string().min(20, { message: 'Please describe your goal in at least 20 characters.' }).max(500),
  topics: z.array(z.string()).optional(),
  experienceLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  notes: z.string().max(300).optional(),
  cardName: z.string().min(1, { message: 'Name on card is required.' }),
  cardNumber: z.string().min(16, { message: 'Card number must be 16 digits.' }).max(16),
  expiryDate: z.string().min(5, { message: 'Expiry must be MM/YY.' }).max(5),
  cvv: z.string().min(3, { message: 'CVV must be 3 digits.' }).max(4),
  agreeTerms: z.boolean().refine(val => val === true, { message: 'You must agree to the terms.' }),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const availableDurations = [
  { duration: 15, price: 156 },
  { duration: 30, price: 312 },
  { duration: 45, price: 468 },
  { duration: 60, price: 624 },
];

const availableTimes = ['10:00 AM', '10:15 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM'];

export function BookingForm({ expert, onBookingConfirmed }: { expert: Expert; onBookingConfirmed: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      duration: '15',
      goal: '',
      topics: [],
      notes: '',
      cardName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      agreeTerms: false,
    },
  });

  const selectedDuration = form.watch('duration');
  const price = availableDurations.find(d => String(d.duration) === selectedDuration)?.price ?? expert.session.price;

  async function onSubmit(data: BookingFormValues) {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    toast({
      title: 'Session Booked! 🎉',
      description: `Your ${data.duration} minute session with ${expert.name} on ${format(data.date, 'PPP')} at ${data.time} has been confirmed.`,
    });
    form.reset();
    onBookingConfirmed();
  }

  const nextStep = async () => {
    let fields: (keyof BookingFormValues)[] = [];
    if (currentStep === 1) fields = ['date', 'time', 'duration'];
    if (currentStep === 2) fields = ['goal'];

    const isValid = await form.trigger(fields);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => setCurrentStep(currentStep - 1);

  const steps = [
    { id: 1, title: 'Select date and time', fields: ['date', 'time', 'duration'] },
    { id: 2, title: 'Session purpose & details', fields: ['goal'] },
    { id: 3, title: 'Payment & confirmation', fields: ['cardName', 'cardNumber', 'expiryDate', 'cvv', 'agreeTerms'] },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-muted-foreground uppercase tracking-wider text-sm">{steps[currentStep - 1].title}</h3>
            <span className='text-sm text-muted-foreground'>Step {currentStep} of {steps.length}</span>
        </div>
        <Progress value={(currentStep / steps.length) * 100} className='h-1' />
        
        {currentStep === 1 && <Step1 form={form} />}
        {currentStep === 2 && <Step2 form={form} expert={expert} />}
        {currentStep === 3 && <Step3 form={form} expert={expert} price={price} />}

        <div className="flex justify-between items-center pt-4">
            <div>
              {currentStep > 1 && (
                <Button type="button" variant="ghost" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              )}
            </div>
            <div>
              {currentStep < steps.length ? (
                <Button type="button" onClick={nextStep}>
                  Continue
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Confirm & Pay ${price}
                </Button>
              )}
            </div>
        </div>
      </form>
    </Form>
  );
}

function Step1({ form }: { form: UseFormReturn<BookingFormValues> }) {
  const selectedDate = form.watch('date');
  const selectedTime = form.watch('time');
  const selectedDuration = form.watch('duration');

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
       <div>
         <p className="text-sm text-muted-foreground mb-4">Showing available time slots in <span className="font-semibold text-foreground">Africa/Lagos</span></p>
         <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
                <FormItem>
                <FormControl>
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        className="p-0"
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
       </div>
       <div className='space-y-6'>
         <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
                <FormItem className="space-y-3">
                <FormLabel className="font-semibold">Select duration</FormLabel>
                <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-2 gap-4">
                    {availableDurations.map((item) => (
                        <FormItem key={item.duration}>
                        <FormControl>
                            <RadioGroupItem value={String(item.duration)} id={`duration-${item.duration}`} className="sr-only" />
                        </FormControl>
                        <Label htmlFor={`duration-${item.duration}`} className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", selectedDuration === String(item.duration) && "border-primary")}>
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
          {selectedDate && <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
                <FormItem className="space-y-3">
                <FormLabel className="font-semibold">Select time</FormLabel>
                <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-3 gap-2">
                        {availableTimes.map((time) => (
                            <FormItem key={time}>
                                <FormControl>
                                    <RadioGroupItem value={time} id={`time-${time}`} className="sr-only" />
                                </FormControl>
                                <Label htmlFor={`time-${time}`} className={cn("flex items-center justify-center rounded-md border-2 border-muted bg-popover px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer", selectedTime === time && "border-primary")}>
                                    {time}
                                </Label>
                            </FormItem>
                        ))}
                    </RadioGroup>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />}
       </div>
    </div>
  )
}

function Step2({ form, expert }: { form: UseFormReturn<BookingFormValues>; expert: Expert }) {
    return (
        <div className="space-y-6">
            <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="font-semibold">What do you want to achieve from this session?</FormLabel>
                        <FormControl>
                            <Textarea {...field} placeholder="I want guidance on building a personal media brand..." rows={4} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="topics"
                render={() => (
                    <FormItem>
                        <FormLabel className="font-semibold">Select relevant topics</FormLabel>
                         <div className="flex flex-wrap gap-2">
                            {expert.expertise.map((topic) => (
                                <FormField
                                    key={topic}
                                    control={form.control}
                                    name="topics"
                                    render={({ field }) => (
                                        <FormItem key={topic} className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(topic)}
                                                    onCheckedChange={(checked) => {
                                                        return checked
                                                        ? field.onChange([...(field.value ?? []), topic])
                                                        : field.onChange(field.value?.filter((value) => value !== topic));
                                                    }}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal text-sm">{topic}</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="experienceLevel"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel className="font-semibold">Your current level</FormLabel>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                <FormItem key={level}>
                                <FormControl>
                                    <RadioGroupItem value={level} id={`level-${level}`} className="sr-only" />
                                </FormControl>
                                <Label htmlFor={`level-${level}`} className="flex items-center justify-center rounded-md border-2 border-muted bg-popover px-4 py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                    {level}
                                </Label>
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="font-semibold">Anything else the mentor should know? (Optional)</FormLabel>
                        <FormControl>
                            <Textarea {...field} placeholder="e.g. link to my portfolio, specific questions" rows={3} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

function Step3({ form, expert, price }: { form: UseFormReturn<BookingFormValues>, expert: Expert, price: number }) {
    const { date, time, duration } = form.getValues();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className='space-y-6'>
                <h3 className='font-semibold'>Payment Method</h3>
                 <FormField control={form.control} name="cardName" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name on card</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="cardNumber" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Card number</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <div className='flex gap-4'>
                    <FormField control={form.control} name="expiryDate" render={({ field }) => (
                        <FormItem className='flex-1'>
                            <FormLabel>Expiry</FormLabel>
                            <FormControl><Input {...field} placeholder="MM/YY" /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="cvv" render={({ field }) => (
                        <FormItem className='flex-1'>
                            <FormLabel>CVV</FormLabel>
                            <FormControl><Input {...field} placeholder="123" /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                <FormField
                    control={form.control}
                    name="agreeTerms"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>I agree to the Terms of Service and Cancellation Policy.</FormLabel>
                            <FormMessage />
                        </div>
                        </FormItem>
                    )}
                />
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>Your payment is protected and only released after session confirmation.</span>
                </div>
            </div>
            <div className='space-y-4 rounded-lg bg-muted/50 p-6'>
                <h3 className='font-semibold mb-4'>Booking Summary</h3>
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={expert.imageUrl} alt={expert.name} />
                        <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{expert.name}</p>
                        <p className="text-sm text-muted-foreground">{expert.role}</p>
                    </div>
                </div>
                <Separator />
                <div className='flex justify-between items-center text-sm'>
                    <span className='text-muted-foreground'>Date</span>
                    <span className='font-medium'>{date ? format(date, 'PPP') : 'Not selected'}</span>
                </div>
                <div className='flex justify-between items-center text-sm'>
                    <span className='text-muted-foreground'>Time</span>
                    <span className='font-medium'>{time || 'Not selected'}</span>
                </div>
                 <div className='flex justify-between items-center text-sm'>
                    <span className='text-muted-foreground'>Duration</span>
                    <span className='font-medium'>{duration} min</span>
                </div>
                <Separator />
                 <div className='flex justify-between items-center text-sm'>
                    <span className='text-muted-foreground'>Session Fee</span>
                    <span className='font-medium'>${price}</span>
                </div>
                 <div className='flex justify-between items-center text-sm'>
                    <span className='text-muted-foreground'>Platform Fee</span>
                    <span className='font-medium'>$0.00</span>
                </div>
                <Separator />
                 <div className='flex justify-between items-center font-bold text-lg'>
                    <span>Total</span>
                    <span>${price}</span>
                </div>

                 <div className="flex items-start gap-3 text-xs text-muted-foreground rounded-md bg-background p-3 mt-4">
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>You can cancel or reschedule for a full refund up to 24 hours before your session.</span>
                </div>
            </div>
        </div>
    )
}

    

    