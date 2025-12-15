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
