'use client';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const chartData = [
  { month: 'Jan', time: 10 },
  { month: 'Feb', time: 15 },
  { month: 'Mar', time: 30 },
  { month: 'Apr', time: 55 },
  { month: 'May', time: 40 },
];

const chartConfig = {
  time: {
    label: 'Time (hours)',
    color: 'hsl(var(--primary))',
  },
};

export function TimeSpending() {
  return (
    <Card className="col-span-1">
      <CardHeader className="flex-row items-center">
        <div className="grid gap-1">
            <CardTitle>Time Spending</CardTitle>
        </div>
        <Select>
            <SelectTrigger className="w-auto ml-auto">
                <SelectValue placeholder="March" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="jan">January</SelectItem>
                <SelectItem value="feb">February</SelectItem>
                <SelectItem value="mar">March</SelectItem>
                <SelectItem value="apr">April</SelectItem>
                <SelectItem value="may">May</SelectItem>
            </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart accessibilityLayer data={chartData}>
             <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} unit="H" />
            <Tooltip
              cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '3 3' }}
              content={({ active, payload, label }) =>
                active && payload && payload.length ? (
                  <div className="p-2 rounded-lg bg-background border">
                    <p className="font-bold">{`${label}`}</p>
                    <p className="text-sm text-primary">{`${payload[0].value}H ${Math.floor(Math.random() * 59)}M`}</p>
                  </div>
                ) : null
              }
            />
            <defs>
                <linearGradient id="fillTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
            </defs>
            <Area
              dataKey="time"
              type="natural"
              fill="url(#fillTime)"
              stroke="hsl(var(--primary))"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
