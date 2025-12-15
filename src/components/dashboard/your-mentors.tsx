'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { dashboardMentors } from "@/lib/data";
import { MoreHorizontal } from "lucide-react";

export function YourMentors() {
    return (
        <Card className="col-span-1">
            <CardHeader className="flex-row items-center">
                <div className="grid gap-1">
                    <CardTitle>Your Mentors</CardTitle>
                </div>
                <Button asChild size="icon" variant="ghost" className="ml-auto h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="grid gap-6">
                {dashboardMentors.map((mentor) => (
                    <div key={mentor.id} className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={mentor.imageUrl} alt={mentor.name} />
                            <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">{mentor.name}</p>
                            <p className="text-sm text-muted-foreground">{mentor.role}</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">Follow</Button>
                    </div>
                ))}
                 <Button variant="outline" className="w-full">See All</Button>
            </CardContent>
        </Card>
    );
}
