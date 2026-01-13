'use client';

import { useEffect, useState } from 'react';
import { useMentor } from '@/hooks/use-mentor';
import { useBookings } from '@/hooks/use-bookings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, MessageSquare, Calendar } from 'lucide-react';
import type { Booking } from '@/lib/types';

interface StudentInfo {
  studentId: string;
  studentName: string;
  studentEmail: string;
  totalSessions: number;
  completedSessions: number;
  totalSpent: number;
  lastSessionDate: string | null;
}

export default function MentorStudentsPage() {
  const { user, profile, loading: mentorLoading } = useMentor();
  const { getMentorBookings, loading: bookingsLoading } = useBookings();
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mentorLoading && profile && user) {
      loadStudents();
    }
  }, [mentorLoading, profile, user]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const bookings = await getMentorBookings(user!.uid);

      // Group bookings by student
      const studentMap = new Map<string, Booking[]>();
      bookings.forEach((booking) => {
        if (!studentMap.has(booking.studentId)) {
          studentMap.set(booking.studentId, []);
        }
        studentMap.get(booking.studentId)?.push(booking);
      });

      // Calculate student info
      const studentList: StudentInfo[] = Array.from(studentMap.entries()).map(
        ([studentId, studentBookings]) => {
          const completedBookings = studentBookings.filter((b) => b.status === 'completed');
          const totalSpent = studentBookings.reduce((sum, b) => sum + b.totalPrice, 0);
          const lastSession = studentBookings
            .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
            .at(0);

          return {
            studentId,
            studentName: studentBookings[0].studentName,
            studentEmail: studentBookings[0].studentEmail,
            totalSessions: studentBookings.length,
            completedSessions: completedBookings.length,
            totalSpent,
            lastSessionDate: lastSession?.startTime || null,
          };
        }
      );

      setStudents(studentList.sort((a, b) => b.totalSessions - a.totalSessions));
    } catch (error) {
      console.error('Failed to load students:', error);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Students</h1>
        <p className="text-muted-foreground mt-1">Manage your student connections</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Students</CardTitle>
          <CardDescription>
            You have {students.length} student{students.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground">No students yet</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {students.map((student) => (
                <div
                  key={student.studentId}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold">{student.studentName}</h3>
                      <p className="text-sm text-muted-foreground">{student.studentEmail}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 bg-muted rounded">
                        <p className="text-muted-foreground text-xs mb-1">Total Sessions</p>
                        <p className="font-semibold text-lg">{student.totalSessions}</p>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <p className="text-muted-foreground text-xs mb-1">Completed</p>
                        <p className="font-semibold text-lg">{student.completedSessions}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                      <p className="font-semibold text-lg">${student.totalSpent.toFixed(2)}</p>
                    </div>

                    {student.lastSessionDate && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Last: {new Date(student.lastSessionDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2 border-t">
                      <button className="flex-1 h-8 px-3 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-sm flex items-center justify-center gap-1 disabled:opacity-50">
                        <MessageSquare className="h-3 w-3" />
                        Message
                      </button>
                    </div>
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
