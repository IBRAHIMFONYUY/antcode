'use client';

import { useMemo } from 'react';
import { useUser } from '@/firebase';
import { useRealtimeCollection } from './use-realtime';

export function useNotifications() {
  const { user } = useUser();

  // all recent questions and answers
  const { data: questions } = useRealtimeCollection('questions', { orderBy: { field: 'createdAt', direction: 'desc' }, limit: 200 });
  const { data: answers } = useRealtimeCollection('answers', { orderBy: { field: 'createdAt', direction: 'asc' }, limit: 500 });

  const { data: submissions } = useRealtimeCollection('taskSubmissions', { orderBy: { field: 'submittedAt', direction: 'desc' }, limit: 500 });

  const unansweredQuestionsCount = useMemo(() => {
    if (!questions) return 0;
    return questions.filter((q: any) => !answers.some((a: any) => a.questionId === q.id)).length;
  }, [questions, answers]);

  const pendingSubmissionsCount = useMemo(() => {
    if (!submissions) return 0;
    return submissions.filter((s: any) => s.status === 'submitted').length;
  }, [submissions]);

  return {
    unansweredQuestionsCount,
    pendingSubmissionsCount,
  };
}
