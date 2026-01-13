'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { useTaskReview } from '@/hooks/use-task-review';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Star, MessageSquare, Calendar, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatTimestamp, formatTime, toDate } from '@/lib/date-utils';
import type { TaskReview } from '@/lib/types';

export default function StudentFeedbackPage() {
  const { user, loading: userLoading } = useUser();
  const { getStudentReviews, loading } = useTaskReview();
  const [reviews, setReviews] = useState<TaskReview[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoading && user) {
      loadReviews();
    }
  }, [userLoading, user]);

  const loadReviews = async () => {
    try {
      if (!user) return;
      const studentReviews = await getStudentReviews(user.uid);
      setReviews(studentReviews.sort((a, b) => 
        toDate(b.reviewedAt).getTime() - toDate(a.reviewedAt).getTime()
      ));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load reviews';
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
        <h1 className="font-headline text-3xl font-bold">Your Feedback</h1>
        <p className="text-muted-foreground mt-1">
          View feedback and reviews on your submitted tasks
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-2 opacity-50" />
            <p className="text-muted-foreground">No feedback yet</p>
            <p className="text-sm text-muted-foreground">
              Submit a task to receive feedback from mentors
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-base">
                        Task Review
                      </CardTitle>
                      <Badge variant="outline">Task {review.taskId.slice(0, 8)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reviewed by {review.mentorName}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{review.rating}/5</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimestamp(review.reviewedAt)}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Knowledge Gaps */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Knowledge Gaps</h4>
                  <div className="bg-orange-50 border border-orange-200 p-3 rounded text-sm">
                    {review.knowledgeGaps}
                  </div>
                </div>

                {/* Targeted Feedback */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Feedback</h4>
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm">
                    {review.targetedFeedback}
                  </div>
                </div>

                {/* Overall Assessment */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Assessment</h4>
                  <div className="bg-green-50 border border-green-200 p-3 rounded text-sm">
                    {review.overallAssessment}
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex gap-4 text-xs text-muted-foreground pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatTimestamp(review.reviewedAt)} at {formatTime(review.reviewedAt)}
                  </div>
                  {review.isPeerReviewed && (
                    <Badge variant="secondary" className="text-xs">
                      Peer Reviewed
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
