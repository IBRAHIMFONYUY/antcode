'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { upcomingCoursesData } from "@/lib/data";
import { MoreHorizontal, Clock } from "lucide-react";
import Image from "next/image";

export function UpcomingCourses() {
    return (
        <Card>
            <CardHeader className="flex-row items-center">
                <div className="grid gap-1">
                    <CardTitle>Upcoming Courses</CardTitle>
                </div>
                <Button asChild size="icon" variant="ghost" className="ml-auto h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="grid gap-4">
                {upcomingCoursesData.map((course) => (
                    <div key={course.id} className="p-4 rounded-lg bg-secondary space-y-3">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-background">
                                <course.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold">{course.title}</p>
                                <p className="text-sm text-muted-foreground">{course.date}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{course.time}</span>
                            </div>
                            <div className="flex -space-x-2">
                                {course.attendees.map((attendee, index) => (
                                    <Image 
                                        key={index}
                                        src={attendee} 
                                        alt={`Attendee ${index + 1}`}
                                        width={24}
                                        height={24}
                                        className="rounded-full border-2 border-secondary"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
