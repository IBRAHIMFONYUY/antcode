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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { courses } from "@/lib/data";

export default function MyCoursesPage() {
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">My Courses</h1>
        <p className="text-muted-foreground">All your enrolled learning paths in one place.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <Progress value={course.progress} />
              <p className="mt-2 text-sm text-muted-foreground">{course.tasksCompleted} / {course.totalTasks} tasks completed</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Continue Learning</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
