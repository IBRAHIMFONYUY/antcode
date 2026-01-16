'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { useFirestore } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { VideoCall } from '@/components/video-call';

interface Booking {
  id: string;
  mentorId: string;
  studentId: string;
  startTime: any;
  duration: number;
  status: string;
}

interface MentorInfo {
  displayName: string;
  avatar?: string;
}

export default function VideoCallPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const bookingId = params?.bookingId as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [mentorInfo, setMentorInfo] = useState<MentorInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firestore || !user || !bookingId) {
      setLoading(false);
      return;
    }

    const loadBooking = async () => {
      try {
        setLoading(true);
        const bookingDoc = await getDoc(doc(firestore, 'bookings', bookingId));

        if (!bookingDoc.exists()) {
          setError('Booking not found');
          return;
        }

        const bookingData = bookingDoc.data() as any;

        // Verify student owns this booking
        if (bookingData.studentId !== user.uid) {
          setError('You do not have permission to join this call');
          return;
        }

        // Check if session is within reasonable time window (must be close to start time)
        const startTime = new Date(bookingData.startTime.seconds * 1000);
        const now = new Date();
        const minutesUntilStart = (startTime.getTime() - now.getTime()) / 60000;

        if (minutesUntilStart < -bookingData.duration - 5) {
          // More than 5 minutes after session end
          setError('This session has already ended');
          return;
        }

        if (minutesUntilStart > 15) {
          // More than 15 minutes before session start
          setError('This session has not started yet. Please try again closer to the session time.');
          return;
        }

        setBooking({
          id: bookingId,
          ...bookingData,
        });

        // Get mentor info
        const mentorDoc = await getDoc(doc(firestore, 'users', bookingData.mentorId));
        if (mentorDoc.exists()) {
          setMentorInfo({
            displayName: mentorDoc.data().displayName || 'Mentor',
            avatar: mentorDoc.data().avatar,
          });
        }
      } catch (err) {
        console.error('Error loading booking:', err);
        setError('Failed to load session');
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [firestore, user, bookingId]);

  const handleEndCall = async () => {
    if (!firestore || !bookingId) return;

    try {
      // Update booking status to completed
      await updateDoc(doc(firestore, 'bookings', bookingId), {
        status: 'completed',
        endedAt: new Date(),
      });

      // Redirect to sessions page
      router.push('/dashboard/sessions');
    } catch (err) {
      console.error('Error ending call:', err);
      setError('Failed to end call. Please try again.');
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
    return <div className="text-center">Please log in to join a call.</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!booking || !mentorInfo) {
    return <div className="text-center">Session not found</div>;
  }

  const startTime = new Date(booking.startTime.seconds * 1000);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Video Session</h1>
        <p className="text-muted-foreground mt-2">Connecting with {mentorInfo.displayName}</p>
      </div>

      <VideoCall
        bookingId={booking.id}
        mentorName={mentorInfo.displayName}
        sessionTime={startTime}
        onEndCall={handleEndCall}
      />
    </div>
  );
}
