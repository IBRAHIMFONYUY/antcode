'use client';

import { useEffect, useState } from 'react';
import { useMentor } from '@/hooks/use-mentor';
import { useTaskReview } from '@/hooks/use-task-review';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle, User, Calendar } from 'lucide-react';
import { reviewTaskSubmissionAction } from '@/app/actions/task-review';
import { formatTimestamp, toDate } from '@/lib/date-utils';
import type { TaskSubmission, TaskReview } from '@/lib/types';

export default function MentorTaskReviewPage() {
  const { user, profile, loading: mentorLoading } = useMentor();
  const { getMentorReviewQueue, saveTaskReview, loading: hookLoading } = useTaskReview();
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [reviews, setReviews] = useState<TaskReview[]>([]);
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);
  const [loadingSubmissionId, setLoadingSubmissionId] = useState<string | null>(null);
  const [reviewResults, setReviewResults] = useState<{
    [key: string]: {
      knowledgeGaps: string;
      targetedFeedback: string;
      overallAssessment: string;
    } | null;
  }>({});
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [activeTab, setActiveTab] = useState('pending');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mentorLoading && user) {
      console.log('[TaskReviewPage] Loading review queue for mentor:', user.uid);
      loadReviewQueue();
    }
  }, [mentorLoading, user]);

  const loadReviewQueue = async () => {
    try {
      if (!user) {
        console.error('[TaskReviewPage] No user available');
        return;
      }
      console.log('[TaskReviewPage] Calling getMentorReviewQueue...');
      const pendingSubmissions = await getMentorReviewQueue(user.uid);
      console.log('[TaskReviewPage] Received submissions:', pendingSubmissions.length);
      setSubmissions(pendingSubmissions);
      if (pendingSubmissions.length === 0) {
        setError('No submissions to review');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load submissions';
      console.error('[TaskReviewPage] Error loading submissions:', err);
      setError(message);
    }
  };

  const handleReviewSubmission = async (submission: TaskSubmission) => {
    setLoadingSubmissionId(submission.id);
    setError(null);

    try {
      const result = await reviewTaskSubmissionAction({
        taskDescription: `Student Task Submission`,
        studentSubmission: submission.submissionText || submission.submissionCode || '',
        relevantContext: `Student: ${submission.studentName}\nEmail: ${submission.studentEmail}`,
      });

      if (result) {
        setReviewResults({
          ...reviewResults,
          [submission.id]: {
            knowledgeGaps: result.knowledgeGaps,
            targetedFeedback: result.targetedFeedback,
            overallAssessment: result.overallAssessment,
          },
        });
        setRatings({
          ...ratings,
          [submission.id]: 3,
        });
        setExpandedSubmission(submission.id);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to review submission';
      setError(message);
    } finally {
      setLoadingSubmissionId(null);
    }
  };

  const handleSaveReview = async (submission: TaskSubmission) => {
    if (!user || !profile) return;

    const reviewData = reviewResults[submission.id];
    if (!reviewData) {
      setError('No review data available');
      return;
    }

    setLoadingSubmissionId(submission.id);
    setError(null);

    try {
      await saveTaskReview(
        submission.id,
        user.uid,
        profile.displayName || 'Unknown Mentor',
        submission.studentId,
        submission.taskId,
        {
          knowledgeGaps: reviewData.knowledgeGaps,
          targetedFeedback: reviewData.targetedFeedback,
          overallAssessment: reviewData.overallAssessment,
          rating: ratings[submission.id] || 3,
        }
      );

      // Remove from queue and reload
      setSubmissions(submissions.filter((s) => s.id !== submission.id));
      setReviewResults({
        ...reviewResults,
        [submission.id]: null,
      });
      setExpandedSubmission(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save review';
      setError(message);
    } finally {
      setLoadingSubmissionId(null);
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

  const pendingSubmissions = submissions.filter((s) => s.status === 'submitted');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Task Review Center</h1>
        <p className="text-muted-foreground mt-1">
          Review student submissions and provide AI-powered feedback
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingSubmissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {hookLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : pendingSubmissions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="h-12 w-12 text-green-600 mb-2 opacity-50" />
                <p className="text-muted-foreground">All caught up! No pending submissions.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingSubmissions.map((submission) => (
                <Card
                  key={submission.id}
                  className={expandedSubmission === submission.id ? 'ring-2 ring-primary' : ''}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <CardTitle className="text-base">{submission.studentName}</CardTitle>
                          <Badge variant="secondary">{submission.studentEmail}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Submitted {formatTimestamp(submission.submittedAt)}
                        </div>
                      </div>
                      <Badge>{submission.status}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Submission Preview */}
                    {expandedSubmission === submission.id && (
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Submission</h4>
                          <div className="bg-muted p-3 rounded text-sm max-h-48 overflow-y-auto whitespace-pre-wrap">
                            {submission.submissionText ||
                              submission.submissionCode ||
                              'No content'}
                          </div>
                        </div>

                        {/* Review Results */}
                        {reviewResults[submission.id] && (
                          <div className="space-y-3 pt-3 border-t">
                            <h4 className="font-semibold text-sm">AI Review</h4>

                            <div>
                              <label className="text-xs font-medium text-muted-foreground">
                                Knowledge Gaps
                              </label>
                              <p className="text-sm mt-1">
                                {reviewResults[submission.id]?.knowledgeGaps}
                              </p>
                            </div>

                            <div>
                              <label className="text-xs font-medium text-muted-foreground">
                                Targeted Feedback
                              </label>
                              <p className="text-sm mt-1">
                                {reviewResults[submission.id]?.targetedFeedback}
                              </p>
                            </div>

                            <div>
                              <label className="text-xs font-medium text-muted-foreground">
                                Overall Assessment
                              </label>
                              <p className="text-sm mt-1">
                                {reviewResults[submission.id]?.overallAssessment}
                              </p>
                            </div>

                            {/* Rating */}
                            <div>
                              <label className="text-xs font-medium text-muted-foreground">
                                Rating (1-5)
                              </label>
                              <select
                                value={ratings[submission.id] || 3}
                                onChange={(e) =>
                                  setRatings({
                                    ...ratings,
                                    [submission.id]: parseInt(e.target.value),
                                  })
                                }
                                className="mt-1 w-full px-3 py-2 border rounded-md bg-background text-foreground"
                              >
                                {[1, 2, 3, 4, 5].map((r) => (
                                  <option key={r} value={r}>
                                    {r} - {'⭐'.repeat(r)}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <Button
                              onClick={() => handleSaveReview(submission)}
                              disabled={loadingSubmissionId === submission.id}
                              className="w-full"
                            >
                              {loadingSubmissionId === submission.id ? (
                                <>
                                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                  Saving...
                                </>
                              ) : (
                                'Save Review'
                              )}
                            </Button>
                          </div>
                        )}

                        {!reviewResults[submission.id] && (
                          <Button
                            onClick={() => handleReviewSubmission(submission)}
                            disabled={loadingSubmissionId === submission.id}
                            className="w-full"
                            variant="default"
                          >
                            {loadingSubmissionId === submission.id ? (
                              <>
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                Generating Review...
                              </>
                            ) : (
                              'Generate AI Review'
                            )}
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Collapsed View */}
                    {expandedSubmission !== submission.id && (
                      <Button
                        onClick={() => setExpandedSubmission(submission.id)}
                        variant="outline"
                        className="w-full"
                      >
                        View & Review
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
