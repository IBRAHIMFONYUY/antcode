'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Edit2, Trash2 } from 'lucide-react';
import { useMentor } from '@/hooks/use-mentor';
import { Loader2 } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  enrolledStudents: number;
  rating: number;
  price: number;
  isPublished: boolean;
}

export default function MentorCoursesPage() {
  const { profile, loading: mentorLoading } = useMentor();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  // Placeholder courses for now
  const mockCourses: Course[] = [
    {
      id: '1',
      title: 'React Advanced Patterns',
      description: 'Master advanced React patterns and best practices',
      category: 'React',
      level: 'advanced',
      enrolledStudents: 24,
      rating: 4.8,
      price: 99.99,
      isPublished: true,
    },
    {
      id: '2',
      title: 'Node.js Backend Development',
      description: 'Build scalable backend applications with Node.js',
      category: 'Backend',
      level: 'intermediate',
      enrolledStudents: 18,
      rating: 4.6,
      price: 79.99,
      isPublished: true,
    },
  ];

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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground mt-1">Manage your teaching courses</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Courses</CardTitle>
          <CardDescription>
            You have {mockCourses.length} course{mockCourses.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : mockCourses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground mb-4">No courses yet</p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Course
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {mockCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">{course.category}</Badge>
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                    {course.isPublished && (
                      <Badge variant="default">Published</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div className="p-2 bg-muted rounded">
                      <p className="text-muted-foreground text-xs mb-1">Enrolled</p>
                      <p className="font-semibold">{course.enrolledStudents}</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="text-muted-foreground text-xs mb-1">Rating</p>
                      <p className="font-semibold">{course.rating}/5</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="text-muted-foreground text-xs mb-1">Price</p>
                      <p className="font-semibold">${course.price}</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="text-muted-foreground text-xs mb-1">Revenue</p>
                      <p className="font-semibold">
                        ${(course.price * course.enrolledStudents).toFixed(2)}
                      </p>
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
