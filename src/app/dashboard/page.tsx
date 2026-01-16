'use client';
import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Loader2, BookOpen, Video, Award } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { YourMentors } from '@/components/dashboard/your-mentors';
import { TimeSpending } from '@/components/dashboard/time-spending';
import { AttendanceChart } from '@/components/dashboard/attendance-chart';
import { YourProgress } from '@/components/dashboard/your-progress';
import { UpcomingCourses } from '@/components/dashboard/upcoming-courses';
import { ClassSchedule } from '@/components/dashboard/class-schedule';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';

interface EnrolledCourse {
  id: string;
  title: string;
  progress: number;
  icon: any;
}

export default function DashboardPage() {
  const { user, profile, loading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    if (!loading && profile?.role === 'mentor') {
      router.push('/dashboard/mentor');
    }
  }, [loading, profile, router]);

  // Load enrolled courses with progress
  useEffect(() => {
    if (!firestore || !user) {
      setCoursesLoading(false);
      return;
    }

    const loadEnrolledCourses = async () => {
      try {
        setCoursesLoading(true);
        // Get student's enrollments
        const enrollmentsQuery = query(
          collection(firestore, 'enrollments'),
          where('studentId', '==', user.uid)
        );
        const enrollmentDocs = await getDocs(enrollmentsQuery);

        const courses: EnrolledCourse[] = [];
        for (const enrollDoc of enrollmentDocs.docs) {
          const enrollment = enrollDoc.data();
          try {
            // Get course details
            const courseDoc = await getDoc(doc(firestore, 'courses', enrollment.courseId));
            if (courseDoc.exists()) {
              const courseData = courseDoc.data();
              
              // Calculate progress from task submissions
              const submissionsQuery = query(
                collection(firestore, 'taskSubmissions'),
                where('courseId', '==', enrollment.courseId),
                where('studentId', '==', user.uid)
              );
              const submissionDocs = await getDocs(submissionsQuery);
              
              // Get total tasks for this course
              const tasksQuery = query(
                collection(firestore, 'tasks'),
                where('courseId', '==', enrollment.courseId)
              );
              const taskDocs = await getDocs(tasksQuery);
              
              const progress = taskDocs.size > 0 ? Math.round((submissionDocs.size / taskDocs.size) * 100) : 0;

              courses.push({
                id: enrollment.courseId,
                title: courseData.title || 'Unknown Course',
                progress,
                icon: Video, // Default icon
              });
            }
          } catch (err) {
            console.error('Error loading course details:', err);
          }
        }

        setEnrolledCourses(courses.slice(0, 2)); // Show top 2
      } catch (err) {
        console.error('Error loading enrollments:', err);
      } finally {
        setCoursesLoading(false);
      }
    };

    loadEnrolledCourses();
  }, [firestore, user]);

  if (loading) {
    return <div className='flex items-center justify-center h-full'><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (!user) {
    return <div className='flex items-center justify-center h-full'><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (profile?.role === 'mentor') {
    return <div className='flex items-center justify-center h-full'><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Hi, {user.displayName ?? 'User'}!</h1>
        <p className="text-muted-foreground">Welcome Back to your dashboard</p>
      </div>

      {coursesLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : enrolledCourses.length === 0 ? (
        <Card className="bg-card/80">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">No courses enrolled yet</p>
            <Link href="/dashboard/courses">
              <Button>Explore Courses</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {enrolledCourses.map((course) => (
            <Card key={course.id} className="bg-card/80">
              <CardHeader className="flex-row items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Video className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardDescription>In Progress</CardDescription>
                  <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Progress value={course.progress} className="w-20 h-2" />
                  <span className="font-semibold text-sm">{course.progress}%</span>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <TimeSpending />
        <YourProgress />
        <YourMentors />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <AttendanceChart />
        <UpcomingCourses />
        <ClassSchedule />
      </div>

    </div>
  );
}      
  
