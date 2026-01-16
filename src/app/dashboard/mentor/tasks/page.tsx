'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { useMentor } from '@/hooks/use-mentor';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  status: string;
  createdAt: any;
}

export default function MentorTasksPage() {
  const { profile, loading: mentorLoading, user } = useMentor();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    dueDate: '',
  });

  // Load mentor's courses and tasks
  useEffect(() => {
    if (!firestore || !user) return;
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load courses
        const coursesQuery = query(collection(firestore, 'courses'), where('ownerId', '==', user.uid));
        const coursesSnap = await getDocs(coursesQuery);
        const loadedCourses = coursesSnap.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
        })) as Course[];
        setCourses(loadedCourses);

        // Load tasks for these courses
        const tasksQuery = query(collection(firestore, 'tasks'), where('ownerId', '==', user.uid));
        const tasksSnap = await getDocs(tasksQuery);
        
        const loadedTasks = tasksSnap.docs.map(doc => {
          const data = doc.data();
          const course = loadedCourses.find(c => c.id === data.courseId);
          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            courseId: data.courseId,
            courseName: course?.title || 'Unknown Course',
            dueDate: data.dueDate ? new Date(data.dueDate.seconds * 1000).toLocaleDateString() : 'N/A',
            status: data.status || 'active',
            createdAt: data.createdAt,
          } as Task;
        });
        setTasks(loadedTasks);
      } catch (err) {
        console.error('Load data error', err);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load courses and tasks.',
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [firestore, user, toast]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !user) return;

    if (!formData.title || !formData.description || !formData.courseId || !formData.dueDate) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Parse due date
      const dueDate = new Date(formData.dueDate);
      
      await addDoc(collection(firestore, 'tasks'), {
        title: formData.title,
        description: formData.description,
        courseId: formData.courseId,
        ownerId: user.uid,
        dueDate: dueDate,
        status: 'active',
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Task Created',
        description: 'Your task has been created successfully.',
      });

      // Reset form and close dialog
      setFormData({ title: '', description: '', courseId: '', dueDate: '' });
      setIsDialogOpen(false);

      // Reload tasks
      const tasksQuery = query(collection(firestore, 'tasks'), where('ownerId', '==', user.uid));
      const tasksSnap = await getDocs(tasksQuery);
      
      const coursesQuery = query(collection(firestore, 'courses'), where('ownerId', '==', user.uid));
      const coursesSnap = await getDocs(coursesQuery);
      const loadedCourses = coursesSnap.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
      })) as Course[];
      
      const loadedTasks = tasksSnap.docs.map(doc => {
        const data = doc.data();
        const course = loadedCourses.find(c => c.id === data.courseId);
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          courseId: data.courseId,
          courseName: course?.title || 'Unknown Course',
          dueDate: data.dueDate ? new Date(data.dueDate.seconds * 1000).toLocaleDateString() : 'N/A',
          status: data.status || 'active',
          createdAt: data.createdAt,
        } as Task;
      });
      setTasks(loadedTasks);
    } catch (err) {
      console.error('Create task error', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create task. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!firestore || !confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteDoc(doc(firestore, 'tasks', taskId));
      
      toast({
        title: 'Task Deleted',
        description: 'Task has been removed.',
      });

      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      console.error('Delete task error', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete task.',
      });
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Course Tasks</h1>
          <p className="text-muted-foreground mt-1">Create and manage tasks for your courses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Task</DialogTitle>
              <DialogDescription>
                Add a new task to one of your courses. Students enrolled in the course will see this task.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <Label htmlFor="courseId">Course *</Label>
                <Select value={formData.courseId} onValueChange={(value) => setFormData({ ...formData, courseId: value })}>
                  <SelectTrigger id="courseId">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {courses.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    You need to create a course first. <Link href="/dashboard/mentor/courses" className="underline">Create course →</Link>
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Implement a React Component"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Task Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what students need to do..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || courses.length === 0}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Task
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Create a course first to add tasks</p>
              <Button asChild>
                <Link href="/dashboard/mentor/courses">Go to Courses</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
            <CardDescription>
              You have {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No tasks yet. Create your first task!</p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Task
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>{task.courseName}</TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{task.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
