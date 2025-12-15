'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Design', value: 400, color: 'hsl(var(--accent))' },
  { name: 'Development', value: 300, color: 'hsl(var(--primary))' },
  { name: 'Remaining', value: 300, color: 'hsl(var(--secondary))' },
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  if (index === 0) { // Only for 'Total Achievement'
    return (
      <g>
        <text x={cx} y={cy - 5} fill="white" textAnchor="middle" dominantBaseline="central" className="text-lg font-bold">
          Total
        </text>
        <text x={cx} y={cy + 15} fill="white" textAnchor="middle" dominantBaseline="central" className="text-md">
          Achievement
        </text>
      </g>
    );
  }
  return null;
};


export function YourProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
        <CardDescription>Your total course progress here</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="h-[180px] w-[180px] relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <defs>
                        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="hsl(var(--primary) / 0.3)" />
                        </filter>
                    </defs>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        cornerRadius={10}
                        filter="url(#shadow)"
                    >
                        {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-accent"></div>
                <span>Design</span>
            </div>
             <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                <span>Development</span>
            </div>
        </div>
        <div className="w-full mt-6 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-accent"></div>
                    </div>
                    <div>
                        <p className="font-semibold">Motion Design</p>
                        <p className="text-xs text-muted-foreground">20/60 Watched</p>
                    </div>
                </div>
            </div>
             <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-primary"></div>
                    </div>
                    <div>
                        <p className="font-semibold">Development</p>
                        <p className="text-xs text-muted-foreground">35/60 Watched</p>
                    </div>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
