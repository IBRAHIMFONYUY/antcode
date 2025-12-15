'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitForReview } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { WandSparkles, Loader2, Info, Lightbulb, Target } from 'lucide-react';

type ReviewFormProps = {
    taskDescription: string;
    studentSubmission: string;
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <WandSparkles className="mr-2 h-4 w-4" />}
            Generate AI Feedback
        </Button>
    );
}

export function ReviewForm({ taskDescription, studentSubmission }: ReviewFormProps) {
    const initialState = { success: false, message: '', data: null };
    const [state, formAction] = useFormState(submitForReview, initialState);

    return (
        <div className="grid gap-6">
            <form action={formAction} className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Task Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <input type="hidden" name="taskDescription" value={taskDescription} />
                        <p className="text-muted-foreground">{taskDescription}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Student Submission</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea name="studentSubmission" readOnly defaultValue={studentSubmission} className="font-code h-80 bg-background/50" />
                    </CardContent>
                </Card>
                
                <div className="flex justify-end">
                    <SubmitButton />
                </div>
            </form>

            {state.data && (
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><WandSparkles className="text-primary"/>AI Generated Feedback</CardTitle>
                        <CardDescription>
                            Here is the AI analysis of the student&apos;s submission.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid gap-2">
                             <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="text-accent"/>Knowledge Gaps</h3>
                             <p className="text-muted-foreground whitespace-pre-line">{state.data.knowledgeGaps}</p>
                        </div>
                        <div className="grid gap-2">
                            <h3 className="font-semibold flex items-center gap-2"><Target className="text-accent"/>Targeted Feedback</h3>
                            <p className="text-muted-foreground whitespace-pre-line">{state.data.targetedFeedback}</p>
                        </div>
                        <div className="grid gap-2">
                            <h3 className="font-semibold flex items-center gap-2"><Info className="text-accent"/>Overall Assessment</h3>
                            <p className="text-muted-foreground whitespace-pre-line">{state.data.overallAssessment}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
            {!state.success && state.message && (
                <p className="text-destructive">{state.message}</p>
            )}
        </div>
    );
}
