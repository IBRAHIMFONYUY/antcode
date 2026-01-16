'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCourse } from '@/hooks/use-courses';
import { useState, useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CourseDetailPage() {
  const params = useParams();
  const rawId = params?.courseId;
  const courseId = Array.isArray(rawId) ? rawId[0] : rawId ?? null;
  
  // Debug logging
  console.log('[CourseDetailPage] params:', params);
  console.log('[CourseDetailPage] rawId:', rawId);
  console.log('[CourseDetailPage] courseId:', courseId);
  
  const { course, tasks, loading } = useCourse(courseId);
  const db = useFirestore();
  const { user } = useUser();
  const [enrolled, setEnrolled] = useState<boolean | null>(null);

  useEffect(() => {
    if (!db || !courseId || !user) {
      console.log('[CourseDetailPage] Skipping enrollment check:', { db: !!db, courseId, userId: user?.uid });
      setEnrolled(false);
      return;
    }
    
    const check = async () => {
      try {
        console.log('[CourseDetailPage] Checking enrollment for:', { courseId, studentId: user.uid });
        const q = query(
          collection(db, 'enrollments'),
          where('courseId', '==', courseId),
          where('studentId', '==', user.uid)
        );
        const snap = await getDocs(q);
        const isEnrolled = snap.docs.length > 0;
        console.log('[CourseDetailPage] Enrollment result:', { isEnrolled, docsCount: snap.docs.length });
        setEnrolled(isEnrolled);
      } catch (err) {
        console.error('[CourseDetailPage] Enrollment check error:', err);
        setEnrolled(false);
      }
    };
    check();
  }, [db, courseId, user]);

  const handleEnroll = async () => {
    if (!db || !user || !courseId) {
      console.error('[CourseDetailPage] Missing required data for enrollment');
      return;
    }
    try {
      const id = `${user.uid}_${courseId}`;
      console.log('[CourseDetailPage] Creating enrollment:', { enrollmentId: id, courseId, studentId: user.uid });
      
      await setDoc(doc(db, 'enrollments', id), {
        id,
        courseId,
        studentId: user.uid,
        studentName: user.displayName || user.email || 'Student',
        createdAt: serverTimestamp(),
      });
      
      console.log('[CourseDetailPage] Enrollment created successfully');
      setEnrolled(true);
      
      // Show toast notification
      const { toast } = await import('@/hooks/use-toast').then(m => ({ toast: m.useToast().toast }));
    } catch (err) {
      console.error('[CourseDetailPage] Enroll error:', err);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!course) return <div className="text-center">Course not found</div>;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <p className="text-muted-foreground">{course.description}</p>
        <div className="mt-4 flex items-center gap-3">
          {enrolled === null ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading enrollment status...
            </div>
          ) : enrolled ? (
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-md bg-green-100 px-3 py-1 text-sm font-medium text-green-800">✓ Enrolled</span>
              <p className="text-sm text-muted-foreground">You can now submit tasks for this course</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button onClick={handleEnroll} size="lg">Enroll in Course</Button>
              <p className="text-xs text-muted-foreground">Enroll to submit tasks and track progress</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Lessons & Tasks</h2>
        <div className="grid gap-3">
          {tasks.length === 0 && <div className="text-sm text-muted-foreground">No tasks yet.</div>}
          {tasks.map(t => (
            <Card key={t.id}>
              <CardHeader>
                <CardTitle>{t.title}</CardTitle>
                <CardDescription>Due {new Date(t.dueDate).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Status: {t.status}</div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/tasks/submit?taskId=${t.id}`}><Button>Submit</Button></Link>
                    <Link href={`/dashboard/tasks/feedback?taskId=${t.id}`} className="underline">View Feedback</Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
