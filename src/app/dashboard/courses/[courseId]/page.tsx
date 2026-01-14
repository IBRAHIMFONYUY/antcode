'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCourse } from '@/hooks/use-courses';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params?.courseId ?? null;
  const { course, tasks, loading } = useCourse(courseId);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!course) return <div className="text-center">Course not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <p className="text-muted-foreground">{course.description}</p>
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
