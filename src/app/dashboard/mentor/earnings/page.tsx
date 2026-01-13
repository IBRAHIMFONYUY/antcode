'use client';

import { useEffect, useState } from 'react';
import { useMentor } from '@/hooks/use-mentor';
import { useBookings } from '@/hooks/use-bookings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, DollarSign, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Booking } from '@/lib/types';

interface EarningsData {
  totalEarnings: number;
  pendingEarnings: number;
  completedSessions: number;
  averageSessionPrice: number;
  monthlyEarnings: { month: string; amount: number }[];
}

export default function MentorEarningsPage() {
  const { user, profile, loading: mentorLoading } = useMentor();
  const { getMentorBookings, loading: bookingsLoading } = useBookings();
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mentorLoading && profile && user) {
      loadEarnings();
    }
  }, [mentorLoading, profile, user]);

  const loadEarnings = async () => {
    try {
      setLoading(true);
      const mentorBookings = await getMentorBookings(user!.uid);
      setBookings(mentorBookings);

      const completedBookings = mentorBookings.filter((b) => b.status === 'completed');
      const pendingBookings = mentorBookings.filter((b) => b.status === 'confirmed' || b.status === 'pending');

      const totalEarnings = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
      const pendingEarnings = pendingBookings.reduce((sum, b) => sum + b.totalPrice, 0);

      // Calculate monthly earnings
      const monthlyMap = new Map<string, number>();
      completedBookings.forEach((booking) => {
        const date = new Date(booking.startTime);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + booking.totalPrice);
      });

      const monthlyEarnings = Array.from(monthlyMap.entries())
        .map(([month, amount]) => ({
          month,
          amount,
        }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-6); // Last 6 months

      setEarnings({
        totalEarnings,
        pendingEarnings,
        completedSessions: completedBookings.length,
        averageSessionPrice:
          completedBookings.length > 0 ? totalEarnings / completedBookings.length : 0,
        monthlyEarnings,
      });
    } catch (error) {
      console.error('Failed to load earnings:', error);
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

  if (!profile || !earnings) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Earnings</h1>
          <p className="text-muted-foreground mt-1">Track your income and payouts</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Earnings Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earnings.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Completed sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earnings.pendingEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earnings.completedSessions}</div>
            <p className="text-xs text-muted-foreground">Total sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earnings.averageSessionPrice.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per session</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Earnings Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Earnings</CardTitle>
          <CardDescription>Earnings over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {earnings.monthlyEarnings.map((item) => {
                const maxAmount = Math.max(...earnings.monthlyEarnings.map((m) => m.amount));
                const percentage = (item.amount / maxAmount) * 100;
                return (
                  <div key={item.month}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{new Date(item.month + '-01').toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}</span>
                      <span className="font-semibold">${item.amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your completed sessions earnings</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {bookings
                .filter((b) => b.status === 'completed')
                .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                .slice(0, 10)
                .map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{booking.studentName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.startTime).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${booking.totalPrice.toFixed(2)}</p>
                      <Badge variant="outline">Paid</Badge>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
