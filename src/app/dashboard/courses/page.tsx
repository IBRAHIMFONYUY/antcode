'use client';

import Link from 'next/link';
import { useCourses } from '@/hooks/use-courses';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function CoursesPage() {
  const { courses, loading } = useCourses();

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Courses</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {courses.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle>{c.title}</CardTitle>
              <CardDescription>{c.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Progress: {c.progress ?? 0}%</div>
                <Link href={`/dashboard/courses/${c.id}`} className="underline">Open</Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
