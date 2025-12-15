'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const chartData = [
  { month: 'Jan', attendance: 65 },
  { month: 'Feb', attendance: 72 },
  { month: 'Mar', attendance: 80 },
  { month: 'Apr', attendance: 60 },
  { month: 'May', attendance: 40 },
  { month: 'Jun', attendance: 35 },
  { month: 'Jul', attendance: 100 },
  { month: 'Aug', attendance: 90 },
  { month: 'Sep', attendance: 75 },
  { month: 'Oct', attendance: 45 },
  { month: 'Nov', attendance: 80 },
  { month: 'Dec', attendance: 95 },
];

const chartConfig = {
  attendance: {
    label: 'Attendance',
    color: 'hsl(var(--primary))',
  },
};

export function AttendanceChart() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex-row items-center">
        <div className="grid gap-1">
            <CardTitle>Attendance</CardTitle>
        </div>
         <Select>
            <SelectTrigger className="w-auto ml-auto">
                <SelectValue placeholder="2024" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} unit="%" />
                <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                />
                <Legend 
                    content={({ payload }) => (
                        <div className="flex gap-4 justify-center text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary/30" />Low</div>
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary/60" />High</div>
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" />Average</div>
                        </div>
                    )}
                />
                <Bar 
                    dataKey="attendance" 
                    radius={[5, 5, 0, 0]}
                    fill="hsl(var(--primary))"
                    fillOpacity={0.8}
                >
                </Bar>
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
