'use client';

import { useEffect, useState } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { useMentor } from '@/hooks/use-mentor';
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

  useEffect(() => {
    if (!db) return;
    (async () => {
      const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const qs = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      // fetch answers for each question
      for (const qItem of qs) {
        const answersQ = query(collection(db, 'answers'), where('questionId', '==', qItem.id), orderBy('createdAt', 'asc'));
        const aSnap = await getDocs(answersQ);
        qItem.answers = aSnap.docs.map(a => ({ id: a.id, ...(a.data() as any) }));
      }
      setQuestions(qs);
    })();
  }, [db]);

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
      // reload questions
      const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const qs = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      for (const qItem of qs) {
        const answersQ = query(collection(db, 'answers'), where('questionId', '==', qItem.id), orderBy('createdAt', 'asc'));
        const aSnap = await getDocs(answersQ);
        qItem.answers = aSnap.docs.map(a => ({ id: a.id, ...(a.data() as any) }));
      }
      setQuestions(qs);
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
