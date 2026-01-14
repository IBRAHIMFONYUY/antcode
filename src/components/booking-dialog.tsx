'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import type { Expert, Booking } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Loader2, X, Phone, Upload, CheckCircle2, MessageCircle, AlertCircle } from 'lucide-react';
import { Separator } from './ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { useBookings } from '@/hooks/use-bookings';
import { useExpertAvailability } from '@/hooks/use-expert-availability';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { calculateTotalPrice, validateBookingData, formatDuration } from '@/lib/booking-service';
import { Alert, AlertDescription } from './ui/alert';

const DURATIONS = [
  { duration: 15, price: 20 },
  { duration: 30, price: 40 },
  { duration: 45, price: 60 },
  { duration: 60, price: 80 },
];

type BookingDialogProps = {
  expert: Expert;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBookingSuccess?: (bookingId: string) => void;
};

export function BookingDialog({ expert, isOpen, onOpenChange, onBookingSuccess }: BookingDialogProps) {
  const [step, setStep] = useState(1);
  const { user } = useUser();
  const { toast } = useToast();
  const { createBooking, loading: bookingLoading } = useBookings();
  const { getAvailableSlots, loading: availabilityLoading } = useExpertAvailability();

  // Step 1
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [duration, setDuration] = useState('30');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  // Step 2
  const [goal, setGoal] = useState('');
  const [experience, setExperience] = useState<string | null>(null);

  // Step 3
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const price = useMemo(() => {
    return DURATIONS.find((d) => d.duration === Number(duration))?.price ?? 0;
  }, [duration]);

  const totalPrice = useMemo(() => {
    return calculateTotalPrice(price);
  }, [price]);

  const step1Valid = selectedDate && selectedTime && duration;
  const step2Valid = goal.trim().length >= 20;

  const ussdCode = `*126*9*677020718*${totalPrice.toFixed(0)}#`;
  const telLink = `tel:${ussdCode.replace(/#/g, '%23')}`;

  const whatsAppNumber = '237677020718';
  const whatsAppMessage = encodeURIComponent(
    `Hello, I have made a payment of $${totalPrice.toFixed(2)} for a session with ${expert.name}.\n\n` +
      `Booking Details:\n` +
      `-------------------\n` +
      `Mentor: ${expert.name}\n` +
      `Date: ${selectedDate}\n` +
      `Time: ${selectedTime}\n` +
      `Duration: ${duration} min\n` +
      `Goal: ${goal}\n` +
      `Experience Level: ${experience}\n\n` +
      `Please find the screenshot attached for verification. Thank you!`
  );
  const whatsAppLink = `https://wa.me/${whatsAppNumber}?text=${whatsAppMessage}`;

  // Load available time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      // Generate time slots (every 30 minutes from 9 AM to 6 PM)
      const slots = [];
      for (let hour = 9; hour < 18; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
          slots.push(time);
        }
      }
      setAvailableSlots(slots);
      setSelectedTime(null);
    }
  }, [selectedDate]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File size must be less than 5MB');
        return;
      }
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrorMessage(null);
    } else {
      setScreenshotFile(null);
      setScreenshotPreview(null);
    }
  };

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  const handlePaymentVerification = async () => {
    // Allow guest bookings: collect guest name/email if user is not authenticated
    if (!user && (!guestName.trim() || !guestEmail.trim())) {
      toast({
        variant: 'destructive',
        title: 'Missing contact information',
        description: 'Please provide your name and email to complete booking.',
      });
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      // Create booking data
      const startDateTime = new Date(`${selectedDate}T${selectedTime}`).toISOString();
      const endDate = new Date(`${selectedDate}T${selectedTime}`);
      endDate.setMinutes(endDate.getMinutes() + Number(duration));

      const bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'> = {
        studentId: user?.uid ?? `guest_${Date.now()}`,
        studentName: user?.displayName || guestName || 'Anonymous',
        studentEmail: user?.email || guestEmail || '',
        mentorId: expert.id,
        mentorName: expert.name,
        mentorImageUrl: expert.imageUrl,
        startTime: startDateTime,
        endTime: endDate.toISOString(),
        duration: Number(duration),
        totalPrice: totalPrice,
        topic: goal || 'Tutoring Session',
        goal: goal,
        status: 'pending',
        notes: `Experience Level: ${experience}\nAdditional Notes: ${notes}`,
      };

      // Validate booking data
      const validation = validateBookingData(bookingData);
      if (!validation.isValid) {
        setErrorMessage(validation.errors.join(', '));
        return;
      }

      // Create booking
      const bookingId = await createBooking(bookingData);

      if (!bookingId) {
        setErrorMessage('Failed to create booking. Please try again.');
        return;
      }

      // Show success
      setStep(4);
      onBookingSuccess?.(bookingId);

      toast({
        title: 'Success',
        description: 'Booking created successfully! Please send proof of payment via WhatsApp.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      setErrorMessage(message);
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        setStep(1);
        setSelectedDate(null);
        setSelectedTime(null);
        setDuration('30');
        setGoal('');
        setExperience(null);
        setNotes('');
        setScreenshotFile(null);
        setScreenshotPreview(null);
        setLoading(false);
        setErrorMessage(null);
      }, 300);
    }
    onOpenChange(open);
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="w-[95vw] max-w-4xl p-0 h-[90vh] max-h-[680px]">
          <form className="flex h-full flex-col overflow-hidden">
            {/* HEADER */}
            <header className="sticky top-0 z-10 border-b bg-background px-6 py-4">
              <div className="flex items-start justify-between">
                <div className='sr-only'>Book a session with {expert.name}</div>
                 <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={expert.imageUrl} alt={expert.name} />
                    <AvatarFallback>{expert.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold text-lg">{expert.name}</h2>
                    <p className="text-sm text-muted-foreground">{expert.role}</p>
                  </div>
                </div>
                <DialogClose asChild>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </Button>
                </DialogClose>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Step {step <= 3 ? step : 3} of 3
                </p>
                <div className="flex gap-1.5">
                  {[1,2,3].map(s => (
                    <div key={s} className={cn("h-1 w-12 rounded-full", step >= s ? 'bg-primary' : 'bg-muted')}></div>
                  ))}
                </div>
              </div>
            </header>

            {/* MAIN */}
            <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
              {errorMessage && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {/* STEP 1 */}
              {step === 1 && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <Label htmlFor="booking-date" className="font-medium">
                      Select Date *
                    </Label>
                    <Input
                      id="booking-date"
                      type="date"
                      className="mt-2"
                      value={selectedDate || ''}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <Label htmlFor="booking-duration" className="font-medium">
                      Duration *
                    </Label>
                    <RadioGroup value={duration} onValueChange={setDuration} className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                      {DURATIONS.map((d) => (
                        <div key={d.duration}>
                          <RadioGroupItem
                            value={String(d.duration)}
                            id={`duration-${d.duration}`}
                            className="sr-only peer"
                          />
                          <Label
                            htmlFor={`duration-${d.duration}`}
                            className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <span className="font-bold">{d.duration} min</span>
                            <span className="text-xs text-muted-foreground">${d.price}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="lg:col-span-2">
                    <Label htmlFor="booking-time" className="font-medium">
                      Available Time *
                    </Label>
                    <div className="mt-2 max-h-[220px] overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {availableSlots.length > 0 ? (
                        availableSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={cn(
                              'rounded-lg border px-3 py-2 text-sm text-center transition-colors',
                              selectedTime === slot
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-input bg-transparent hover:bg-accent hover:text-accent-foreground'
                            )}
                          >
                            {slot}
                          </button>
                        ))
                      ) : (
                        <p className="col-span-full text-sm text-muted-foreground">Select a date to see available times</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="mx-auto max-w-2xl space-y-6">
                  <div>
                    <Label htmlFor="session-goal" className="font-medium">
                      Session Goal *
                    </Label>
                    <Textarea
                      id="session-goal"
                      className="mt-2 w-full"
                      rows={4}
                      maxLength={500}
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="Describe what you want to achieve in this session..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {goal.length}/500 characters (minimum 20 required)
                    </p>
                  </div>

                  <div>
                    <Label className="font-medium">Experience Level *</Label>
                    <div className="mt-2 flex flex-wrap gap-3">
                      {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setExperience(level)}
                          className={cn(
                            'rounded-lg border px-4 py-2 text-sm transition-colors',
                            experience === level
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-input bg-transparent hover:bg-accent hover:text-accent-foreground'
                          )}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="session-notes" className="font-medium">
                      Additional Notes (Optional)
                    </Label>
                    <Textarea
                      id="session-notes"
                      className="mt-2 w-full"
                      rows={3}
                      maxLength={300}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any additional information for the mentor..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">{notes.length}/300 characters</p>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
                  {/* If user is not authenticated, collect guest contact info */}
                  {!user && (
                    <div className="mx-auto max-w-2xl space-y-4 lg:col-span-1">
                      <h3 className="font-medium text-lg">Your contact details</h3>
                      <div>
                        <Label htmlFor="guest-name">Full name</Label>
                        <Input id="guest-name" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="guest-email">Email</Label>
                        <Input id="guest-email" type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />
                      </div>
                    </div>
                  )}
                  <div className="space-y-6">
                    <h3 className="font-medium text-lg">Payment Procedure</h3>

                    <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Step 1: Make Payment</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <p className="text-muted-foreground">
                            Dial the code below on your mobile phone to pay for the session.
                          </p>
                          <div className="flex items-center gap-3 rounded-lg border bg-secondary p-3">
                            <code className="font-mono text-base font-semibold">{ussdCode}</code>
                            <a href={telLink} className="ml-auto">
                              <Button size="sm">
                                <Phone className="mr-2 h-4 w-4" />
                                Dial Now
                              </Button>
                            </a>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Step 2: Upload Proof of Payment</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <p className="text-muted-foreground">
                            After payment, take a screenshot of the confirmation message and upload it below.
                          </p>

                          <div className="space-y-2">
                            <Label
                              htmlFor="screenshot-upload"
                              className={cn(
                                'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50',
                                screenshotPreview && 'border-primary'
                              )}
                            >
                              {screenshotPreview ? (
                                <div className="flex flex-col items-center justify-center text-center">
                                  <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
                                  <p className="font-semibold text-sm">Image Selected!</p>
                                  <p className="text-xs text-muted-foreground">{screenshotFile?.name}</p>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center">
                                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                  <p className="text-sm font-semibold">Click to upload screenshot</p>
                                  <p className="text-xs text-muted-foreground">PNG, JPG, or GIF (Max 5MB)</p>
                                </div>
                              )}
                            </Label>
                            <Input
                              id="screenshot-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                              accept="image/*"
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div className="rounded-xl bg-muted/50 p-5 space-y-3 lg:sticky lg:top-0">
                    <h4 className="font-medium text-foreground">Booking Summary</h4>
                    <Separator />
                    <p className="flex justify-between text-sm">
                      <span>Date:</span>
                      <span className="font-medium">{selectedDate}</span>
                    </p>
                    <p className="flex justify-between text-sm">
                      <span>Time:</span>
                      <span className="font-medium">{selectedTime}</span>
                    </p>
                    <p className="flex justify-between text-sm">
                      <span>Duration:</span>
                      <span className="font-medium">{formatDuration(Number(duration))}</span>
                    </p>
                    <p className="flex justify-between text-sm">
                      <span>Experience:</span>
                      <span className="font-medium">{experience}</span>
                    </p>
                    <Separator />
                    <p className="flex justify-between text-sm">
                      <span>Base Price:</span>
                      <span className="font-medium">${price.toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between text-sm">
                      <span>Platform Fee (10%):</span>
                      <span className="font-medium">${(totalPrice - price).toFixed(2)}</span>
                    </p>
                    <Separator />
                    <p className="flex justify-between items-baseline font-semibold">
                      <span>Total:</span>
                      <span className="text-xl text-primary">${totalPrice.toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* SUCCESS */}
              {step === 4 && (
                <div className="flex h-full flex-col items-center justify-center text-center p-4">
                   <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                   </div>
                  <h2 className="text-2xl font-semibold">Session Booked Successfully!</h2>
                  <p className="mt-2 text-muted-foreground max-w-sm">
                    Your session is pending verification. To complete the process, please send your payment screenshot via WhatsApp for confirmation.
                  </p>
                  <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" className='w-full max-w-xs mt-6'>
                    <Button className='w-full'>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Send Proof via WhatsApp
                    </Button>
                  </a>
                  <Button variant="ghost" onClick={() => handleOpenChange(false)} className='mt-2'>Done</Button>
                </div>
              )}
            </main>

            {/* FOOTER */}
            {step <= 3 && (
              <footer className="sticky bottom-0 border-t bg-background px-6 py-4 flex justify-between items-center">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={step === 1}
                  onClick={() => setStep((s) => s - 1)}
                  className={cn(step === 1 && 'invisible')}
                >
                  Back
                </Button>

                {step === 3 ? (
                  <Button
                    type="button"
                    disabled={!screenshotFile || loading || bookingLoading}
                    onClick={handlePaymentVerification}
                  >
                    {loading || bookingLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" />
                        Verifying...
                      </>
                    ) : (
                      "I have paid, Verify & Complete"
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={
                      (step === 1 && !step1Valid) || (step === 2 && (!step2Valid || !experience)) ||
                      availabilityLoading ||
                      bookingLoading
                    }
                    onClick={() => setStep((s) => s + 1)}
                  >
                    Continue
                  </Button>
                )}
              </footer>
            )}
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
