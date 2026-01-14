'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useTaskReview } from '@/hooks/use-task-review';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function StudentTaskSubmissionPage() {
  const { user, profile, loading: userLoading } = useUser();
  const { submitTaskForReview, loading } = useTaskReview();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    taskId: '',
    courseId: '',
    submissionText: '',
    submissionCode: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
  const firestore = useFirestore();

  useEffect(() => {
    // If a courseId is provided, verify enrollment
    const checkEnrollment = async () => {
      const courseId = formData.courseId?.trim();
      if (!courseId || !user || !firestore) {
        setIsEnrolled(null);
        return;
      }

      try {
        const q = query(collection(firestore, 'enrollments'), where('courseId', '==', courseId), where('studentId', '==', user.uid));
        const snap = await getDocs(q);
        setIsEnrolled(!snap.empty);
      } catch (err) {
        setIsEnrolled(false);
      }
    };

    checkEnrollment();
  }, [formData.courseId, user, firestore]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('Please log in to submit a task');
      return;
    }

    if (!formData.taskId.trim()) {
      setError('Task ID is required');
      return;
    }

    if (formData.courseId && isEnrolled === false) {
      setError('You are not enrolled in this course. Enroll before submitting tasks.');
      return;
    }

    if (!formData.submissionText.trim() && !formData.submissionCode.trim()) {
      setError('Please provide either text or code submission');
      return;
    }

    try {
      const submissionId = await submitTaskForReview({
        taskId: formData.taskId,
        studentId: user.uid,
        studentName: profile?.displayName || user.email || 'Anonymous',
        studentEmail: user.email || '',
        submissionText: formData.submissionText,
        submissionCode: formData.submissionCode,
        status: 'submitted',
      });

      if (submissionId) {
        setSubmitted(true);
        toast({
          title: 'Success',
          description: 'Your task has been submitted for review!',
        });

        // Reset form
        setFormData({
          taskId: '',
          courseId: '',
          submissionText: '',
          submissionCode: '',
        });

        setTimeout(() => setSubmitted(false), 3000);
      } else {
        setError('Failed to submit task. Please try again.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit task';
      setError(message);
    }
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Submit Task</h1>
        <p className="text-muted-foreground mt-1">
          Submit your completed task for mentor review and feedback
        </p>
      </div>

      {submitted && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Your task has been submitted successfully! A mentor will review it soon.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
          <CardDescription>Provide information about the task you're submitting</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="task-id">Task ID *</Label>
                <Input
                  id="task-id"
                  placeholder="e.g., TASK-001"
                  value={formData.taskId}
                  onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course-id">Course ID (Optional)</Label>
                <Input
                  id="course-id"
                  placeholder="e.g., COURSE-001"
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  disabled={loading}
                />
                {isEnrolled === false && (
                  <p className="text-sm text-destructive mt-1">You are not enrolled in this course. Please enroll to submit tasks.</p>
                )}
                {isEnrolled === true && (
                  <p className="text-sm text-success mt-1">Enrolled ✓ You may submit tasks for this course.</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="submission-text">Written Response</Label>
              <Textarea
                id="submission-text"
                placeholder="Enter your written response, explanation, or analysis here..."
                value={formData.submissionText}
                onChange={(e) => setFormData({ ...formData, submissionText: e.target.value })}
                rows={6}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">{formData.submissionText.length}/2000 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="submission-code">Code Submission</Label>
              <Textarea
                id="submission-code"
                placeholder="Paste your code here if applicable..."
                value={formData.submissionCode}
                onChange={(e) => setFormData({ ...formData, submissionCode: e.target.value })}
                rows={8}
                className="font-mono text-sm"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">{formData.submissionCode.length}/5000 characters</p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your submission will be reviewed by a mentor using AI-powered analysis to provide
                detailed feedback on knowledge gaps and areas for improvement.
              </AlertDescription>
            </Alert>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Task
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
