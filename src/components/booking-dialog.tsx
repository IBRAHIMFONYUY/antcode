'use client';

import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import type { Expert } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Loader2, X } from 'lucide-react';
import { Separator } from './ui/separator';

const DURATIONS = [
  { duration: 15, price: 20 },
  { duration: 30, price: 40 },
  { duration: 45, price: 60 },
  { duration: 60, price: 80 },
];

const TIME_SLOTS = [
  '10:00 AM',
  '10:15 AM',
  '10:30 AM',
  '10:45 AM',
  '11:00 AM',
  '11:15 AM',
  '11:30 AM',
];

type BookingDialogProps = {
  expert: Expert;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function BookingDialog({ expert, isOpen, onOpenChange }: BookingDialogProps) {
  const [step, setStep] = useState(1);

  // Step 1
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [duration, setDuration] = useState('30');
  const [time, setTime] = useState<string | null>(null);

  // Step 2
  const [goal, setGoal] = useState('');
  const [experience, setExperience] = useState<string | null>(null);

  // Step 3
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const price = useMemo(() => {
    return DURATIONS.find((d) => d.duration === Number(duration))?.price ?? 0;
  }, [duration]);

  const step1Valid = selectedDate && time && duration;
  const step2Valid = goal.trim().length >= 20;

  function handlePayment() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 2000);
  }
  
  // Reset state when modal is closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        setStep(1);
        setSelectedDate(null);
        setDuration('30');
        setTime(null);
        setGoal('');
        setExperience(null);
        setAgreed(false);
        setLoading(false);
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
              {/* STEP 1 */}
              {step === 1 && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h3 className="mb-3 font-medium text-foreground">Select Date</h3>
                    <Input
                      type="date"
                      className="w-full"
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div>
                    <h3 className="mb-3 font-medium text-foreground">Duration</h3>
                    <RadioGroup
                      value={duration}
                      onValueChange={setDuration}
                      className="grid grid-cols-2 md:grid-cols-4 gap-2"
                    >
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
                    <h3 className="mb-3 font-medium text-foreground">Available Time</h3>
                    <div className="max-h-[220px] overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTime(slot)}
                          className={cn(
                            'rounded-lg border px-3 py-2 text-sm text-center transition-colors',
                            time === slot
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-input bg-transparent hover:bg-accent hover:text-accent-foreground'
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="mx-auto max-w-2xl space-y-6">
                  <div>
                    <Label htmlFor='session-goal' className="font-medium">
                      Session Goal *
                    </Label>
                    <Textarea
                      id='session-goal'
                      className="mt-2 w-full"
                      rows={4}
                      maxLength={500}
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="Describe what you want to achieve..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum 20 characters
                    </p>
                  </div>

                  <div>
                    <Label className="font-medium">Experience Level</Label>
                    <div className="mt-2 flex flex-wrap gap-3">
                      {['Beginner', 'Intermediate', 'Advanced'].map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setExperience(l)}
                          className={cn(
                            'rounded-lg border px-4 py-2 text-sm',
                            experience === l
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-input bg-transparent hover:bg-accent hover:text-accent-foreground'
                          )}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
                  <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                    <h3 className="font-medium">Payment Details</h3>
                    <Input placeholder="Card Number" />
                    <div className="flex gap-3">
                      <Input placeholder="MM / YY" />
                      <Input placeholder="CVV" />
                    </div>
                    <Input placeholder="Cardholder Name" />

                    <div className="flex items-start space-x-2 pt-2">
                       <Checkbox 
                        id="terms"
                        checked={agreed}
                        onCheckedChange={(checked) => setAgreed(!!checked)}
                      />
                      <Label htmlFor="terms" className="text-sm text-muted-foreground">
                        I agree to the <a href="#" className="underline text-primary">Terms</a> & <a href="#" className="underline text-primary">Cancellation Policy</a>
                      </Label>
                    </div>

                  </div>

                  <div className="rounded-xl bg-muted/50 p-5 space-y-3 lg:sticky lg:top-0">
                    <h4 className="font-medium text-foreground">Booking Summary</h4>
                    <Separator/>
                    <p className='flex justify-between text-sm'><span>Date:</span> <span className='font-medium'>{selectedDate}</span></p>
                    <p className='flex justify-between text-sm'><span>Time:</span> <span className='font-medium'>{time}</span></p>
                    <p className='flex justify-between text-sm'><span>Duration:</span> <span className='font-medium'>{duration} min</span></p>
                    <Separator/>
                    <p className="flex justify-between items-baseline font-semibold"><span>Total:</span> <span className='text-xl text-primary'>${price}</span></p>
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
                  <h2 className="text-2xl font-semibold">Session Booked 🎉</h2>
                  <p className="mt-2 text-muted-foreground max-w-sm">
                    A calendar invite and confirmation email have been sent to you.
                  </p>
                  <Button onClick={() => handleOpenChange(false)} className='mt-6'>Done</Button>
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
                    disabled={!agreed || loading}
                    onClick={handlePayment}
                  >
                    {loading ? <><Loader2 className="animate-spin mr-2"/>Processing...</> : `Confirm & Pay $${price}`}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={
                      (step === 1 && !step1Valid) || (step === 2 && !step2Valid)
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
