'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useBookings } from '@/hooks/use-bookings';
import { Loader2, Calendar, Clock, DollarSign, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  formatBookingDateTime,
  getBookingStatusInfo,
  formatDuration,
  canCancelBooking,
} from '@/lib/booking-service';
import type { Booking } from '@/lib/types';

export default function BookingsPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { getStudentBookings, updateBookingStatus, loading } = useBookings();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [canceling, setCanceling] = useState<string | null>(null);

  useEffect(() => {
    if (user && !userLoading) {
      loadBookings();
    }
  }, [user, userLoading]);

  const loadBookings = async () => {
    if (!user) return;
    const data = await getStudentBookings(user.uid);
    setBookings(data);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCanceling(bookingId);
    try {
      const success = await updateBookingStatus(bookingId, 'cancelled');
      if (success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
        );
      }
    } finally {
      setCanceling(null);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const upcomingBookings = bookings.filter((b) => new Date(b.startTime) > new Date() && b.status !== 'cancelled');
  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled');
  const pendingBookings = bookings.filter((b) => b.status === 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">Manage and track your mentor sessions</p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">No bookings yet</h3>
            <p className="text-muted-foreground mb-4">Start by booking a session with one of our experts</p>
            <Button onClick={() => router.push('/dashboard/experts')}>Browse Experts</Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={() => handleCancelBooking(booking.id)}
                  isCanceling={canceling === booking.id}
                  canCancelBooking={canCancelBooking(booking)}
                />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No upcoming sessions</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingBookings.length > 0 ? (
              pendingBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={() => handleCancelBooking(booking.id)}
                  isCanceling={canceling === booking.id}
                  canCancelBooking={canCancelBooking(booking)}
                />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock3 className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No pending bookings</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedBookings.length > 0 ? (
              completedBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No completed sessions</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {cancelledBookings.length > 0 ? (
              cancelledBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No cancelled bookings</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

interface BookingCardProps {
  booking: Booking;
  onCancel?: () => void;
  isCanceling?: boolean;
  canCancelBooking?: boolean;
}

function BookingCard({ booking, onCancel, isCanceling = false, canCancelBooking = false }: BookingCardProps) {
  const statusInfo = getBookingStatusInfo(booking.status);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{booking.mentorName}</CardTitle>
            <CardDescription>Mentor Session</CardDescription>
          </div>
          <Badge variant="outline" className={`${statusInfo.color} ${statusInfo.bgColor}`}>
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {booking.notes && (
          <Alert>
            <AlertDescription>{booking.notes}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date & Time
            </p>
            <p className="font-medium">{formatBookingDateTime(booking.startTime)}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Duration
            </p>
            <p className="font-medium">{formatDuration(booking.duration)}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Price
            </p>
            <p className="font-medium">${booking.totalPrice.toFixed(2)}</p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium">{statusInfo.label}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {canCancelBooking && onCancel && (
            <Button variant="destructive" size="sm" onClick={onCancel} disabled={isCanceling}>
              {isCanceling ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Cancelling...
                </>
              ) : (
                'Cancel Booking'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
