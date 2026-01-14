'use client';

import { useEffect, useState } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useMentor } from '@/hooks/use-mentor';
import { useRealtimeCollection } from '@/hooks/use-realtime';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function MentorQuestionsPage() {
  const db = useFirestore();
  const { user } = useUser();
  const { isMentor, loading: mentorLoading } = useMentor();
  const { toast } = useToast();

  const [questions, setQuestions] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Use realtime listeners for questions and answers
  const { data: questionsData, loading: questionsLoading } = useRealtimeCollection('questions', { orderBy: { field: 'createdAt', direction: 'desc' }, limit: 100 });
  const { data: answersData } = useRealtimeCollection('answers', { orderBy: { field: 'createdAt', direction: 'asc' }, limit: 500 });

  useEffect(() => {
    if (!questionsData) return;
    // attach answers to questions
    const qs = questionsData.map((qItem: any) => ({
      ...qItem,
      answers: answersData.filter((a: any) => a.questionId === qItem.id) || [],
    }));
    setQuestions(qs);
  }, [questionsData, answersData]);

  if (mentorLoading) return null;
  if (!isMentor) return <div className="text-center text-muted-foreground">Access denied.</div>;

  const handleReply = async (questionId: string) => {
    if (!db || !user) return;
    if (!reply.trim()) return;
    setLoading(true);
    try {
      const ansRef = await addDoc(collection(db, 'answers'), {
        questionId,
        text: reply,
        mentorId: user.uid,
        mentorName: user.displayName,
        createdAt: serverTimestamp(),
      });
      setReply('');
      setActiveQuestion(null);
      toast({ title: 'Answer posted' });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Failed to post answer' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Questions</h1>
      <div className="grid gap-4">
        {questions.map(q => (
          <Card key={q.id}>
            <CardHeader>
              <CardTitle>{q.studentName ?? 'Anonymous'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{new Date(q.createdAt?.seconds ? q.createdAt.seconds * 1000 : Date.now()).toLocaleString()}</p>
              <div className="mt-2">{q.text}</div>

              <div className="mt-4 space-y-3">
                {q.answers?.map((a: any) => (
                  <div key={a.id} className="p-3 bg-muted rounded">
                    <div className="text-sm font-medium">{a.mentorName}</div>
                    <div className="text-xs text-muted-foreground">{new Date(a.createdAt?.seconds ? a.createdAt.seconds * 1000 : Date.now()).toLocaleString()}</div>
                    <div className="mt-2">{a.text}</div>
                  </div>
                ))}

                {activeQuestion === q.id ? (
                  <div className="space-y-2">
                    <Textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={3} />
                    <div className="flex gap-2">
                      <Button onClick={() => handleReply(q.id)} disabled={loading}>Post Answer</Button>
                      <Button variant="ghost" onClick={() => { setActiveQuestion(null); setReply(''); }}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    <Button onClick={() => setActiveQuestion(q.id)}>Answer</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
