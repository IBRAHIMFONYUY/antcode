import { ReviewForm } from "./review-form";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tasks } from "@/lib/data";
import { notFound } from "next/navigation";

export default function TaskReviewPage({ params }: { params: { id: string }}) {
    const task = tasks.find(t => t.id === params.id);
    if (!task) {
        notFound();
    }
    
    const studentSubmission = `
import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

export default useFetch;
    `;
    
    const taskDescription = `Create a custom React hook called 'useFetch' that takes a URL as an argument and returns an object with 'data', 'loading', and 'error' states. The hook should handle the entire data fetching lifecycle.`;

    return (
        <div className="grid gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold">AI Task Review</h1>
                <p className="text-muted-foreground">Leverage AI to analyze submitted tasks and generate feedback.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>{task.title}</CardTitle>
                            <CardDescription>{task.course}</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <ReviewForm taskDescription={taskDescription} studentSubmission={studentSubmission} />
                </div>
            </div>
        </div>
    );
}
