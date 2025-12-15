'use server';

import { aiTaskReview, type AITaskReviewInput } from '@/ai/flows/ai-task-review';
import { z } from 'zod';

const aiReviewSchema = z.object({
  taskDescription: z.string(),
  studentSubmission: z.string(),
});

type FormState = {
  success: boolean;
  message: string;
  data: Awaited<ReturnType<typeof aiTaskReview>> | null;
};

export async function submitForReview(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = aiReviewSchema.safeParse({
    taskDescription: formData.get('taskDescription'),
    studentSubmission: formData.get('studentSubmission'),
  });

  if (!parsed.success) {
    return { success: false, message: 'Invalid form data.', data: null };
  }

  try {
    const input: AITaskReviewInput = {
      taskDescription: parsed.data.taskDescription,
      studentSubmission: parsed.data.studentSubmission,
      relevantContext: 'This is a task from the "Advanced React Patterns" course.',
    };
    
    const result = await aiTaskReview(input);

    return {
      success: true,
      message: 'Review completed successfully.',
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'An error occurred during AI review.',
      data: null,
    };
  }
}
