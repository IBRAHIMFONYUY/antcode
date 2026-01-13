'use client';

import { useMentor } from '@/hooks/use-mentor';
import { useBookings } from '@/hooks/use-bookings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Users, Clock, TrendingUp, Star, CalendarDays, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import type { Booking } from '@/lib/types';

export default function MentorDashboardPage() {
  const { user, profile, loading: mentorLoading } = useMentor();
  const { getMentorBookings, loading: bookingsLoading } = useBookings();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    upcomingSessions: 0,
    totalStudents: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
    if (!mentorLoading && profile && user) {
      const loadBookings = async () => {
        try {
          const mentorBookings = await getMentorBookings(user.uid);
          setBookings(mentorBookings);

          // Calculate stats
          const upcomingSessions = mentorBookings.filter((b) => b.status === 'confirmed').length;
          const totalStudents = new Set(mentorBookings.map((b) => b.studentId)).size;
          const totalEarnings = mentorBookings
            .filter((b) => b.status === 'completed')
            .reduce((sum, b) => sum + b.totalPrice, 0);

          setStats({
            upcomingSessions,
            totalStudents,
            totalEarnings,
          });
        } catch (error) {
          console.error('Failed to load mentor bookings:', error);
        }
      };

      loadBookings();
    }
  }, [mentorLoading, profile, user, getMentorBookings]);

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

  const upcomingBookings = bookings
    .filter((b) => b.status === 'confirmed')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Welcome back, {profile.displayName}!</h1>
          <p className="text-muted-foreground mt-1">
            Here's your teaching overview for today
          </p>
        </div>
        <Link href="/dashboard/mentor/settings">
          <Button variant="outline">Edit Profile</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingSessions}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Active students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Completed sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.rating?.toFixed(1) || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Student reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.photoURL} alt={profile.displayName} />
              <AvatarFallback>{profile.displayName?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-3 flex-1">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Display Name</p>
                <p className="text-lg font-semibold">{profile.displayName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hourly Rate</p>
                <p className="text-lg font-semibold">${profile.hourlyRate}/hour</p>
              </div>
              {profile.expertise && profile.expertise.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.expertise.slice(0, 5).map((exp) => (
                      <Badge key={exp} variant="secondary">
                        {exp}
                      </Badge>
                    ))}
                    {profile.expertise.length > 5 && (
                      <Badge variant="secondary">+{profile.expertise.length - 5} more</Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>
              {upcomingBookings.length} sessions scheduled
            </CardDescription>
          </div>
          <Link href="/dashboard/mentor/sessions">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground">No upcoming sessions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{booking.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.startTime).toLocaleDateString()}{' '}
                      {new Date(booking.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{booking.topic}</p>
                  </div>
                  <Badge
                    variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                  >
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
