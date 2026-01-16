'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { useUser } from '@/firebase';
import { useFirestore } from '@/firebase';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Booking {
  id: string;
  mentorId: string;
  startTime: { seconds: number };
  status: 'upcoming' | 'completed' | 'cancelled';
  duration?: number;
}

interface Session {
  id: string;
  mentor: {
    id: string;
    name: string;
    imageUrl: string;
  };
  dateTime: Date;
  duration: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export default function SessionsPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firestore || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Subscribe to bookings for this student (completed sessions)
    const q = query(collection(firestore, 'bookings'), where('studentId', '==', user.uid));
    
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const bookings = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          })) as Booking[];

          // Enrich with mentor details
          const enrichedSessions: Session[] = [];
          for (const booking of bookings) {
            try {
              // Get mentor details
              const mentorDoc = await getDoc(doc(firestore, 'users', booking.mentorId));
              const mentorData = mentorDoc.data();

              // Determine status based on date
              const startTime = new Date(booking.startTime.seconds * 1000);
              const now = new Date();
              let status: 'upcoming' | 'completed' | 'cancelled' = booking.status || 'cancelled';
              
              if (status !== 'cancelled') {
                if (startTime > now) {
                  status = 'upcoming';
                } else {
                  status = 'completed';
                }
              }

              enrichedSessions.push({
                id: booking.id,
                mentor: {
                  id: booking.mentorId,
                  name: mentorData?.displayName || mentorData?.name || 'Unknown Mentor',
                  imageUrl: mentorData?.avatar || '',
                },
                dateTime: startTime,
                duration: booking.duration || 60,
                status: status,
              });
            } catch (err) {
              console.error('Error enriching session:', err);
            }
          }

          setSessions(enrichedSessions);
        } catch (err) {
          console.error('Error loading sessions:', err);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to load sessions. Please try again.',
          });
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Firestore listener error:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load sessions.',
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, user, toast]);

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <div className="text-center">Please log in to view sessions.</div>;
  }

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Mentorship Sessions</h1>
        <p className="text-muted-foreground">Manage your upcoming and past 1-on-1 sessions.</p>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No sessions yet. Book a session with a mentor!</p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/bookings">View Bookings</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mentor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={session.mentor.imageUrl} alt={session.mentor.name} />
                          <AvatarFallback>{session.mentor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{session.mentor.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{format(session.dateTime, "PPP p")}</TableCell>
                    <TableCell>{session.duration} min</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          session.status === 'completed' ? 'default' :
                          session.status === 'upcoming' ? 'secondary' : 'destructive'
                        }
                      >
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        disabled={session.status !== 'upcoming'}
                      >
                        {session.status === 'upcoming' ? (
                          <Link href={`/dashboard/sessions/${session.id}/call`}>
                            Join Call
                          </Link>
                        ) : (
                          <span>View Details</span>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
