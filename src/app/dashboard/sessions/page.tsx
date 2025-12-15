import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sessions } from "@/lib/data";
import { format } from "date-fns";

export default function SessionsPage() {
  return (
    <div className="grid gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Mentorship Sessions</h1>
        <p className="text-muted-foreground">Manage your upcoming and past 1-on-1 sessions.</p>
      </div>
      <Card>
        <CardContent className="pt-6">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Mentor</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sessions.map((session) => (
                        <TableRow key={session.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={session.mentor.imageUrl} alt={session.mentor.name} />
                                        <AvatarFallback>{session.mentor.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{session.mentor.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>{format(new Date(session.dateTime), "PPP p")}</TableCell>
                            <TableCell>{session.duration} min</TableCell>
                            <TableCell>
                                <Badge variant={
                                    session.status === 'Completed' ? 'default' :
                                    session.status === 'Upcoming' ? 'secondary' : 'destructive'
                                }>{session.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                  {session.status === 'Upcoming' ? "Join Call" : "View Details"}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
