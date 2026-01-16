'use client';

import { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { useUser } from '@/firebase';
import { useFirestore } from '@/firebase';
import { collection, query, where, onSnapshot, getDocs, doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudentTask {
  id: string;
  taskId: string;
  courseId: string;
  studentId: string;
  status: 'pending' | 'submitted' | 'reviewed';
  submittedAt?: Date;
  feedback?: string;
  title: string;
  course: string;
  dueDate: string;
}

export default function TasksPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<StudentTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firestore || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Subscribe to task submissions for this student
    const q = query(collection(firestore, 'taskSubmissions'), where('studentId', '==', user.uid));
    
    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        try {
          const submissions = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));

          // Enrich with course and task details
          const enrichedTasks: StudentTask[] = [];
          for (const sub of submissions) {
            try {
              // Get course name
              const courseDoc = await getDoc(doc(firestore, 'courses', sub.courseId));
              const courseName = courseDoc.data()?.title || 'Unknown Course';

              // Get task details
              const taskDoc = await getDoc(doc(firestore, 'tasks', sub.taskId));
              const taskData = taskDoc.data();
              const taskTitle = taskData?.title || 'Unknown Task';
              const dueDate = taskData?.dueDate ? new Date(taskData.dueDate.seconds * 1000).toLocaleDateString() : 'N/A';

              enrichedTasks.push({
                id: sub.id,
                taskId: sub.taskId,
                courseId: sub.courseId,
                studentId: sub.studentId,
                status: sub.status || 'pending',
                submittedAt: sub.submittedAt ? new Date(sub.submittedAt.seconds * 1000) : undefined,
                feedback: sub.feedback,
                title: taskTitle,
                course: courseName,
                dueDate: dueDate,
              });
            } catch (err) {
              console.error('Error enriching task:', err);
            }
          }

          setTasks(enrichedTasks);
        } catch (err) {
          console.error('Error loading tasks:', err);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to load tasks. Please try again.',
          });
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Firestore listener error:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load tasks.',
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, user, toast]);

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <div className="text-center">Please log in to view tasks.</div>;
  }

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Tasks</h1>
        <p className="text-muted-foreground">Manage and track all your tasks across different courses.</p>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No tasks yet. Enroll in a course to get started!</p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/courses">Browse Courses</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{task.course}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          task.status === 'reviewed' ? 'default' :
                          task.status === 'submitted' ? 'secondary' : 'outline'
                        }
                      >
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/tasks/submit?taskId=${task.taskId}`}>
                          {task.status === 'submitted' ? 'View Submission' : 'Submit Task'}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
