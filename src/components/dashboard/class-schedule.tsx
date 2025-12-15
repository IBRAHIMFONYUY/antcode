'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { format, addMonths, subMonths, getDaysInMonth, getDay, startOfMonth, getDate } from 'date-fns';

export function ClassSchedule() {
    const [currentDate, setCurrentDate] = useState(new Date());
    
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getDay(startOfMonth(currentDate));
    const today = getDate(new Date());
    const currentMonthAndYear = new Date().getFullYear() === currentDate.getFullYear() && new Date().getMonth() === currentDate.getMonth();

    const scheduledDays = [6, 7, 8, 9, 10, 13, 20, 21, 22, 23, 24, 27];

    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDayOfMonth });


    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Class Schedule</CardTitle>
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{format(currentDate, 'MMMM yyyy')}</p>
                    <div className="flex">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
                    <div>Sat</div>
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                </div>
                <div className="grid grid-cols-7 gap-2 mt-2">
                    {emptyDays.map((_, i) => <div key={`empty-${i}`}></div>)}
                    {daysArray.map((day) => {
                        const isScheduled = scheduledDays.includes(day);
                        const isToday = currentMonthAndYear && day === today;
                        return (
                            <div 
                                key={day} 
                                className={`
                                    h-9 w-9 flex items-center justify-center rounded-lg text-sm
                                    ${isToday ? 'bg-primary text-primary-foreground' : 'bg-secondary'}
                                `}
                            >
                                {isScheduled ? <div className="h-1.5 w-1.5 rounded-full bg-accent"></div> : day}
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
