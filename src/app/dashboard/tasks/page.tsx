import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { tasks } from "@/lib/data";
import Link from "next/link";

export default function TasksPage() {
  return (
    <div className="grid gap-8">
       <div>
        <h1 className="font-headline text-3xl font-bold">Tasks</h1>
        <p className="text-muted-foreground">Manage and track all your tasks across different courses.</p>
      </div>
      <Card>
        <CardContent className="pt-6">
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell className="font-medium">{task.title}</TableCell>
                            <TableCell>{task.course}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    task.status === 'Reviewed' ? 'default' :
                                    task.status === 'Submitted' ? 'secondary' : 'outline'
                                }>{task.status}</Badge>
                            </TableCell>
                            <TableCell>{task.dueDate}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/dashboard/tasks/${task.id}/review`}>
                                      {task.status === 'Submitted' ? "Review Task" : "View Task"}
                                    </Link>
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
