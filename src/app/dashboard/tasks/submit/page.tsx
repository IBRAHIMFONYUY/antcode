'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { useFirestore } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  courseId: string;
  dueDate: Date;
}

interface Course {
  id: string;
  title: string;
}

export default function TaskSubmitPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const taskId = searchParams.get('taskId');
  const [task, setTask] = useState<Task | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [code, setCode] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [enrolled, setEnrolled] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load task details
  useEffect(() => {
    if (!firestore || !user || !taskId) {
      setLoading(false);
      return;
    }

    const loadTask = async () => {
      try {
        setLoading(true);
        const taskDoc = await getDoc(doc(firestore, 'tasks', taskId));
        
        if (!taskDoc.exists()) {
          setError('Task not found');
          setLoading(false);
          return;
        }

        const taskData = taskDoc.data();
        setTask({
          id: taskId,
          title: taskData.title,
          description: taskData.description,
          courseId: taskData.courseId,
          dueDate: taskData.dueDate ? new Date(taskData.dueDate.seconds * 1000) : new Date(),
        });

        // Load course details
        const courseDoc = await getDoc(doc(firestore, 'courses', taskData.courseId));
        if (courseDoc.exists()) {
          setCourse({
            id: taskData.courseId,
            title: courseDoc.data().title,
          });
        }

        // Check enrollment
        const enrollmentsQuery = query(
          collection(firestore, 'enrollments'),
          where('courseId', '==', taskData.courseId),
          where('studentId', '==', user.uid)
        );
        const enrollmentSnap = await getDocs(enrollmentsQuery);
        setEnrolled(enrollmentSnap.docs.length > 0);
      } catch (err) {
        console.error('Error loading task:', err);
        setError('Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [firestore, user, taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !firestore || !taskId || !task) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Missing required information',
      });
      return;
    }

    if (!code.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please enter your code or solution',
      });
      return;
    }

    setSubmitting(true);
    try {
      // Create submission in Firestore
      await addDoc(collection(firestore, 'taskSubmissions'), {
        taskId,
        courseId: task.courseId,
        studentId: user.uid,
        studentName: user.displayName || user.email || 'Student',
        code,
        notes,
        submittedAt: serverTimestamp(),
        status: 'submitted',
      });

      toast({
        title: 'Success',
        description: 'Task submitted successfully!',
      });

      // Redirect to tasks page
      router.push('/dashboard/tasks');
    } catch (err) {
      console.error('Submission error:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit task. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <div className="text-center">Please log in to submit tasks.</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!task) {
    return <div className="text-center">Task not found</div>;
  }

  if (enrolled === false) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You must be enrolled in the course to submit tasks. Please enroll first.
        </AlertDescription>
      </Alert>
    );
  }

  const isOverdue = new Date() > task.dueDate;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{task.title}</h1>
        <p className="text-muted-foreground mt-2">{task.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Course</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{course?.title || 'Loading...'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Due Date</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`font-medium ${isOverdue ? 'text-destructive' : ''}`}>
              {task.dueDate.toLocaleDateString()}
              {isOverdue && ' (Overdue)'}
            </p>
          </CardContent>
        </Card>
      </div>

      {isOverdue && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This task is overdue. Submissions are still accepted but marked as late.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="code" className="text-base">Your Solution *</Label>
          <p className="text-sm text-muted-foreground mb-2">Paste your code, link to repository, or describe your solution</p>
          <Textarea
            id="code"
            placeholder="// Paste your solution here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            rows={12}
            className="font-mono text-sm"
          />
        </div>

        <div>
          <Label htmlFor="notes" className="text-base">Notes (Optional)</Label>
          <p className="text-sm text-muted-foreground mb-2">Add any additional comments or explanation</p>
          <Textarea
            id="notes"
            placeholder="My approach was..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitting ? 'Submitting...' : 'Submit Task'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={submitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
