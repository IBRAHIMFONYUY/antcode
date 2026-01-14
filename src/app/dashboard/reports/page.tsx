'use client';

import { useState } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { submitReport } from '@/lib/course-service';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { serverTimestamp } from 'firebase/firestore';

export default function ReportsPage() {
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user) return;
    setLoading(true);
    try {
      const payload = {
        title,
        description,
        studentId: user.uid,
        studentName: user.displayName,
        createdAt: serverTimestamp(),
      };
      await submitReport(db, payload);
      toast({ title: 'Report submitted', description: 'Your report has been submitted.' });
      setTitle('');
      setDescription('');
    } catch (err) {
      toast({ variant: 'destructive', title: 'Submission failed', description: 'Could not submit report.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Submit Report</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={6} />
        </div>
        <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Report'}</Button>
      </form>
    </div>
  );
}
