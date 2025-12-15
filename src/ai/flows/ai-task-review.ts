'use server';

/**
 * @fileOverview This file defines the AI task review flow for mentors to analyze student-submitted tasks and provide feedback.
 *
 * - aiTaskReview - A function that handles the AI task review process.
 * - AITaskReviewInput - The input type for the aiTaskReview function.
 * - AITaskReviewOutput - The return type for the aiTaskReview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AITaskReviewInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task assigned to the student.'),
  studentSubmission: z.string().describe('The student\'s submitted solution to the task.'),
  relevantContext: z
    .string()
    .optional()
    .describe('Any relevant context or background information for the task.'),
});

export type AITaskReviewInput = z.infer<typeof AITaskReviewInputSchema>;

const AITaskReviewOutputSchema = z.object({
  knowledgeGaps: z.string().describe('Identified knowledge gaps in the student\'s submission.'),
  targetedFeedback: z.string().describe('Specific and actionable feedback for the student.'),
  overallAssessment: z.string().describe('An overall assessment of the student\'s work.'),
});

export type AITaskReviewOutput = z.infer<typeof AITaskReviewOutputSchema>;

export async function aiTaskReview(input: AITaskReviewInput): Promise<AITaskReviewOutput> {
  return aiTaskReviewFlow(input);
}

const aiTaskReviewPrompt = ai.definePrompt({
  name: 'aiTaskReviewPrompt',
  input: {schema: AITaskReviewInputSchema},
  output: {schema: AITaskReviewOutputSchema},
  prompt: `You are an AI assistant helping mentors review student submissions for programming tasks.

  Your goal is to identify knowledge gaps, provide targeted feedback, and offer an overall assessment.

  Consider the task description, student submission, and any relevant context provided.

  Task Description: {{{taskDescription}}}
  Student Submission: {{{studentSubmission}}}
  Relevant Context: {{{relevantContext}}}

  Based on this information, please provide:

  1.  Knowledge Gaps: Identify specific areas where the student lacks understanding.
  2.  Targeted Feedback: Offer concrete suggestions for improvement.
  3.  Overall Assessment: Give a summary of the student's performance and potential next steps.
  Please write in a concise and professional manner.
`,
});

const aiTaskReviewFlow = ai.defineFlow(
  {
    name: 'aiTaskReviewFlow',
    inputSchema: AITaskReviewInputSchema,
    outputSchema: AITaskReviewOutputSchema,
  },
  async input => {
    const {output} = await aiTaskReviewPrompt(input);
    return output!;
  }
);
