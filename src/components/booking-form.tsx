
'use client';

import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, ArrowLeft, Lock, Info, CheckCircle, Clock, Globe, X } from 'lucide-react';

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
  { duration: 15, price: 20 },
  { duration: 30, price: 40 },
  { duration: 45, price: 60 },
  { duration: 60, price: 80 },
];

const availableTimes = ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM'];
const bookedTimes = ['11:00 AM', '01:00 PM', '04:00 PM'];


export function BookingForm({ expert, onBookingConfirmed, onOpenChange }: { expert: Expert; onBookingConfirmed: () => void; onOpenChange: (open: boolean) => void; }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      duration: '30',
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
  const price = availableDurations.find(d => String(d.duration) === selectedDuration)?.price ?? 80;

  async function onSubmit(data: BookingFormValues) {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSuccess(true);
  }

  const nextStep = async () => {
    let fields: (keyof BookingFormValues)[] = [];
    if (currentStep === 1) fields = ['date', 'time', 'duration'];
    if (currentStep === 2) fields = ['goal'];
    if (currentStep === 3) fields = ['cardName', 'cardNumber', 'expiryDate', 'cvv', 'agreeTerms'];


    const isValid = await form.trigger(fields);
    if (isValid) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        await onSubmit(form.getValues());
      }
    }
  };

  const prevStep = () => setCurrentStep(currentStep - 1);

  const steps = [
    { id: 1, title: 'Select Date & Time'},
    { id: 2, title: 'Session Details'},
    { id: 3, title: 'Payment & Confirmation' },
  ];

  if (isSuccess) {
    return <SuccessStep onOpenChange={onOpenChange} />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 rounded-t-2xl border-b bg-background px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{steps[currentStep-1].title}</h2>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Step {currentStep} of 3</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3].map(step => (
                     <div key={step} className={cn("h-1.5 w-16 rounded-full", currentStep >= step ? "bg-primary" : "bg-muted")}></div>
                  ))}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="shrink-0">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
            {currentStep === 1 && <Step1 form={form} />}
            {currentStep === 2 && <Step2 form={form} expert={expert} />}
            {currentStep === 3 && <Step3 form={form} expert={expert} price={price} />}
        </main>
        
        {/* Footer */}
        <footer className="sticky bottom-0 rounded-b-2xl border-t bg-background px-6 py-4">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              )}
              <Button type="button" onClick={nextStep} disabled={isLoading} className='flex-1'>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {currentStep < 3 ? 'Continue' : `Confirm & Pay $${price}`}
              </Button>
            </div>
        </footer>
      </form>
    </Form>
  );
}

function Step1({ form }: { form: UseFormReturn<BookingFormValues> }) {
  const selectedDate = form.watch('date');

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-start'>
       <div className='flex flex-col gap-6'>
        <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-sm font-semibold text-foreground">Select Date</FormLabel>
                <FormControl>
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        className="rounded-lg border bg-background"
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
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground">Session Duration</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-2 gap-2">
                        {availableDurations.map((item) => (
                        <FormItem key={item.duration}>
                            <FormControl>
                                <RadioGroupItem value={String(item.duration)} id={`duration-${item.duration}`} className="sr-only" />
                            </FormControl>
                            <Label htmlFor={`duration-${item.duration}`} className={cn(
                                "block cursor-pointer rounded-lg border-2 p-3 text-center transition-all",
                                field.value === String(item.duration)
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-muted hover:border-primary/50"
                            )}>
                                <span className='font-bold text-sm'>{item.duration} min</span>
                                <br/>
                                <span className="text-xs text-muted-foreground">${item.price}</span>
                            </Label>
                        </FormItem>
                        ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
            )}
        />
       </div>
       <div className='space-y-6'>
          <div>
            <Label className="text-sm font-semibold text-foreground">Current Timezone</Label>
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                <Globe className="h-5 w-5" />
                <span>{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
            </div>
          </div>
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("text-sm font-semibold text-foreground", !selectedDate && "text-muted-foreground")}>
                    Available Slots {selectedDate ? `for ${format(selectedDate, 'MMM dd')}`: ''}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="max-h-80 space-y-2 overflow-y-auto" disabled={!selectedDate}>
                        {!selectedDate ? (
                            <div className="py-4 text-center text-sm text-muted-foreground">Please select a date first.</div>
                        ) : (
                            <>
                                {[...availableTimes, ...bookedTimes].sort().map((time) => {
                                const isBooked = bookedTimes.includes(time);
                                return (
                                    <FormItem key={time}>
                                        <FormControl>
                                            <RadioGroupItem value={time} id={`time-${time}`} className="sr-only" disabled={isBooked}/>
                                        </FormControl>
                                        <Label htmlFor={`time-${time}`} className={cn(
                                            "flex w-full cursor-pointer items-center justify-between rounded-lg border-2 p-3 text-left transition-all",
                                            field.value === time
                                                ? "border-primary bg-primary/10 font-semibold"
                                                : "border-muted hover:border-primary/50",
                                            isBooked && "cursor-not-allowed border-muted bg-muted/50 text-muted-foreground"
                                        )}>
                                            <span>{time}</span>
                                            {isBooked && <span className="text-xs">Booked</span>}
                                        </Label>
                                    </FormItem>
                                )
                                })}
                            </>
                        )}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
            )}
            />
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
                        <FormLabel className="font-semibold">What would you like to focus on? <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                            <Textarea {...field} placeholder="Describe your goals for this session..." rows={4} />
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
                        <FormLabel className="font-semibold">Anything else to share? (Optional)</FormLabel>
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
                            <FormLabel>I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Cancellation Policy</a>.</FormLabel>
                            <FormMessage />
                        </div>
                        </FormItem>
                    )}
                />
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>Secure payment powered by Stripe.</span>
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
                 <div className='flex justify-between items-center font-bold text-lg'>
                    <span>Total</span>
                    <span className='text-primary'>${price}</span>
                </div>

                 <div className="flex items-start gap-3 text-xs text-muted-foreground rounded-md bg-background p-3 mt-4">
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>You can cancel or reschedule for a full refund up to 24 hours before your session.</span>
                </div>
            </div>
        </div>
    )
}


function SuccessStep({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
             <div className="inline-block h-20 w-20 animate-pulse rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-foreground">Booking Confirmed! 🎉</h3>
            <p className="mb-6 text-muted-foreground">
                Your mentorship session has been successfully booked. You&apos;ll receive a calendar invite and confirmation email shortly.
            </p>
            <div className="w-full rounded-lg bg-muted/50 p-4 mb-6 text-left">
                <h4 className="mb-2 font-semibold text-foreground">What&apos;s Next?</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                        <span>Calendar invite sent to your email</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                        <span>Booking details saved to your dashboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                        <span>You can message your mentor anytime</span>
                    </li>
                </ul>
            </div>
            <div className="flex w-full gap-3">
                <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                    Message Mentor
                </Button>
                <Button className="flex-1" onClick={() => onOpenChange(false)}>
                    View Booking
                </Button>
            </div>
        </div>
    )
}

    