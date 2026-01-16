'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { useFirestore } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

interface TaskSubmission {
  id: string;
  taskId: string;
  courseId: string;
  studentId: string;
  code: string;
  notes?: string;
  submittedAt: Timestamp;
  status: 'submitted' | 'reviewed' | 'pending';
  feedback?: string;
  rating?: number;
  mentorName?: string;
  reviewedAt?: Timestamp;
}

interface Task {
  id: string;
  title: string;
  description: string;
  courseId: string;
  dueDate: Timestamp;
}

export default function TaskFeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const submissionId = params?.id as string;
  const [submission, setSubmission] = useState<TaskSubmission | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firestore || !user || !submissionId) {
      setLoading(false);
      return;
    }

    const loadSubmission = async () => {
      try {
        setLoading(true);
        const subDoc = await getDoc(doc(firestore, 'taskSubmissions', submissionId));

        if (!subDoc.exists()) {
          setError('Submission not found');
          setLoading(false);
          return;
        }

        const subData = subDoc.data() as any;

        // Verify ownership
        if (subData.studentId !== user.uid) {
          setError('You do not have permission to view this submission');
          setLoading(false);
          return;
        }

        setSubmission({
          id: submissionId,
          ...subData,
        });

        // Load task details
        const taskDoc = await getDoc(doc(firestore, 'tasks', subData.taskId));
        if (taskDoc.exists()) {
          setTask({
            id: subData.taskId,
            ...taskDoc.data(),
          } as Task);
        }
      } catch (err) {
        console.error('Error loading submission:', err);
        setError('Failed to load submission');
      } finally {
        setLoading(false);
      }
    };

    loadSubmission();
  }, [firestore, user, submissionId]);

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <div className="text-center">Please log in to view feedback.</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!submission || !task) {
    return <div className="text-center">Submission not found</div>;
  }

  const submittedDate = submission.submittedAt ? new Date(submission.submittedAt.seconds * 1000) : null;
  const reviewedDate = submission.reviewedAt ? new Date(submission.reviewedAt.seconds * 1000) : null;
  const isReviewed = submission.status === 'reviewed';

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{task.title}</h1>
        <p className="text-muted-foreground mt-2">{task.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {isReviewed ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Reviewed</span>
                </>
              ) : (
                <>
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium">Pending Review</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{submittedDate?.toLocaleDateString()}</p>
            <p className="text-xs text-muted-foreground">{submittedDate?.toLocaleTimeString()}</p>
          </CardContent>
        </Card>

        {isReviewed && submission.rating && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{submission.rating}/5</p>
              <p className="text-xs text-muted-foreground">by {submission.mentorName || 'Mentor'}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Submission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-2">Code/Solution</h3>
            <pre className="bg-muted p-4 rounded overflow-auto max-h-96 text-sm">
              <code>{submission.code}</code>
            </pre>
          </div>

          {submission.notes && (
            <div>
              <h3 className="font-semibold text-sm mb-2">Your Notes</h3>
              <p className="text-sm bg-muted p-4 rounded">{submission.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {isReviewed && submission.feedback && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">Mentor Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-900">{submission.feedback}</p>
            {reviewedDate && (
              <p className="text-xs text-green-700 mt-4">
                Reviewed on {reviewedDate.toLocaleDateString()} at {reviewedDate.toLocaleTimeString()}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {!isReviewed && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Your submission is being reviewed by a mentor. You'll receive feedback shortly.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        {!isReviewed && (
          <Button asChild>
            <Link href={`/dashboard/tasks/submit?taskId=${task.id}`}>Edit & Resubmit</Link>
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link href="/dashboard/tasks">Back to Tasks</Link>
        </Button>
      </div>
    </div>
  );
}
