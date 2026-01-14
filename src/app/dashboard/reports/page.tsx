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
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { month: 'January', tasks: 12 },
  { month: 'February', tasks: 19 },
  { month: 'March', tasks: 15 },
  { month: 'April', tasks: 22 },
  { month: 'May', tasks: 18 },
  { month: 'June', tasks: 25 },
];

const chartConfig = {
  tasks: {
    label: 'Tasks Completed',
    color: 'hsl(var(--primary))',
  },
};

export default function ReportsPage() {
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Visualize your learning progress and achievements.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks Completed Over Time</CardTitle>
          <CardDescription>A monthly breakdown of your task completion rate.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="tasks" fill="var(--color-tasks)" radius={8} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
