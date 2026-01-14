'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { submitQuestion } from '@/lib/course-service';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { serverTimestamp, collection, query, where, orderBy, getDocs } from 'firebase/firestore';

export default function AskPage() {
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (!db) return;
    // load recent public questions
    (async () => {
      try {
        const col = collection(db, 'questions');
        const q = query(col, orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setQuestions(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
      } catch (err) {
        // ignore
      }
    })();
  }, [db]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user) return;
    setLoading(true);
    try {
      const payload = {
        text: question,
        studentId: user.uid,
        studentName: user.displayName,
        createdAt: serverTimestamp(),
      };
      await submitQuestion(db, payload);
      toast({ title: 'Question posted', description: 'Your question was posted.' });
      setQuestion('');
    } catch (err) {
      toast({ variant: 'destructive', title: 'Failed', description: 'Could not post question.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Ask a Question</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="question">Question</Label>
          <Textarea id="question" value={question} onChange={(e) => setQuestion(e.target.value)} required rows={4} />
        </div>
        <Button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post Question'}</Button>
      </form>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Recent Questions</h2>
        <div className="space-y-3 mt-3">
          {questions.map(q => (
            <div key={q.id} className="p-3 border rounded">
              <div className="font-medium">{q.studentName ?? 'Anonymous'}</div>
              <div className="text-sm text-muted-foreground">{new Date(q.createdAt?.seconds ? q.createdAt.seconds * 1000 : Date.now()).toLocaleString()}</div>
              <div className="mt-2">{q.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
