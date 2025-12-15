import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { courses, tasks } from '@/lib/data';
import Link from 'next/link';

export default function DashboardPage() {
  const recentTasks = tasks.slice(0, 3);
  
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Alex! Here&apos;s your progress.</p>
      </div>

      <section>
        <h2 className="font-headline text-2xl font-semibold mb-4">My Learning Paths</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col transition-transform transform hover:-translate-y-1">
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} aria-label={`${course.title} progress`} />
                 <p className="mt-2 text-sm text-muted-foreground">{course.tasksCompleted} / {course.totalTasks} tasks completed</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/dashboard/courses">Continue Learning</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
      
      <section>
        <h2 className="font-headline text-2xl font-semibold mb-4">Task Status</h2>
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentTasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell className="font-medium">{task.title}</TableCell>
                            <TableCell>{task.course}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    task.status === 'Reviewed' ? 'default' :
                                    task.status === 'Submitted' ? 'secondary' : 'outline'
                                }>{task.status}</Badge>
                            </TableCell>
                            <TableCell>{task.dueDate}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/dashboard/tasks">View</Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
      </section>
    </div>
  );
}
