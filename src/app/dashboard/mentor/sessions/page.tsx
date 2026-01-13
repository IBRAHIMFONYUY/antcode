'use client';

import { useEffect, useState } from 'react';
import { useMentor } from '@/hooks/use-mentor';
import { useBookings } from '@/hooks/use-bookings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Calendar, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Booking } from '@/lib/types';

type SessionStatus = 'all' | 'confirmed' | 'pending' | 'completed' | 'cancelled';

export default function MentorSessionsPage() {
  const { user, profile, loading: mentorLoading } = useMentor();
  const { getMentorBookings, updateBookingStatus, loading: bookingsLoading } = useBookings();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<SessionStatus>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mentorLoading && profile && user) {
      loadSessions();
    }
  }, [mentorLoading, profile, user]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const mentorBookings = await getMentorBookings(user!.uid);
      setBookings(mentorBookings);
      filterBookings(mentorBookings, activeTab);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load sessions';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = (allBookings: Booking[], status: SessionStatus) => {
    if (status === 'all') {
      setFilteredBookings(allBookings.sort(
        (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      ));
    } else {
      setFilteredBookings(
        allBookings
          .filter((b) => b.status === status)
          .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      );
    }
  };

  const handleTabChange = (newTab: SessionStatus) => {
    setActiveTab(newTab);
    filterBookings(bookings, newTab);
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      setLoading(true);
      await updateBookingStatus(bookingId, newStatus as any);
      await loadSessions();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update session status';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (mentorLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const statusCounts = {
    all: bookings.length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'completed':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Sessions</h1>
        <p className="text-muted-foreground mt-1">Manage all your teaching sessions</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Sessions</CardTitle>
          <CardDescription>
            You have {statusCounts.all} total sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as SessionStatus)}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                All ({statusCounts.all})
              </TabsTrigger>
              <TabsTrigger value="confirmed">
                Confirmed ({statusCounts.confirmed})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({statusCounts.pending})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({statusCounts.completed})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({statusCounts.cancelled})
              </TabsTrigger>
            </TabsList>

            {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-muted-foreground">No sessions found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold">{booking.studentName}</h3>
                            <p className="text-sm text-muted-foreground">{booking.studentEmail}</p>
                          </div>
                          <Badge variant={getStatusColor(booking.status) as any}>
                            {booking.status}
                          </Badge>
                        </div>

                        <div className="grid gap-2 text-sm mb-3">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(booking.startTime).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {new Date(booking.startTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            - {new Date(booking.endTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            ${booking.totalPrice.toFixed(2)}
                          </div>
                        </div>

                        <div className="mb-3 pb-3 border-t pt-3">
                          <p className="text-sm"><strong>Topic:</strong> {booking.topic}</p>
                          <p className="text-sm mt-1"><strong>Goal:</strong> {booking.goal}</p>
                          {booking.notes && (
                            <p className="text-sm mt-1"><strong>Notes:</strong> {booking.notes}</p>
                          )}
                        </div>

                        {booking.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(booking.id, 'confirmed')}
                              disabled={loading}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(booking.id, 'cancelled')}
                              disabled={loading}
                            >
                              Decline
                            </Button>
                          </div>
                        )}

                        {booking.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(booking.id, 'completed')}
                            disabled={loading}
                          >
                            Mark as Completed
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
