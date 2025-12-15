'use client';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { YourMentors } from '@/components/dashboard/your-mentors';
import { TimeSpending } from '@/components/dashboard/time-spending';
import { AttendanceChart } from '@/components/dashboard/attendance-chart';
import { YourProgress } from '@/components/dashboard/your-progress';
import { UpcomingCourses } from '@/components/dashboard/upcoming-courses';
import { ClassSchedule } from '@/components/dashboard/class-schedule';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Award } from 'lucide-react';


export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  if (loading) {
    return <div className='flex items-center justify-center h-full'><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (!user) {
    router.push('/login');
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Hi, {user.displayName ?? 'User'}!</h1>
        <p className="text-muted-foreground">Welcome Back to your dashboard</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="bg-card/80">
          <CardHeader className="flex-row items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardDescription>Design</CardDescription>
              <CardTitle>Video Editing</CardTitle>
            </div>
            <div className="ml-auto flex items-center gap-2">
                <Progress value={60} className="w-20 h-2" />
                <span className="font-semibold text-sm">60%</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">12/22 Lessons Watched</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80">
          <CardHeader className="flex-row items-center gap-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <Award className="h-6 w-6 text-accent" />
            </div>
            <div>
              <CardDescription>Design</CardDescription>
              <CardTitle>3D Motion</CardTitle>
            </div>
            <div className="ml-auto flex items-center gap-2">
                <Progress value={70} className="w-20 h-2" />
                <span className="font-semibold text-sm">70%</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">15/22 Lessons Watched</p>
          </CardContent>
        </Card>
      </div>

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
