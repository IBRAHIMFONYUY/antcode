'use server';

import { aiTaskReview } from '@/ai/flows/ai-task-review';
import type { AITaskReviewInput, AITaskReviewOutput } from '@/ai/flows/ai-task-review';
import { handleError, logError } from '@/utils/error-handler';

export async function reviewTaskSubmissionAction(
  input: AITaskReviewInput
): Promise<AITaskReviewOutput | null> {
  try {
    const result = await aiTaskReview(input);
    return result;
  } catch (err) {
    const appError = handleError(err);
    logError(appError);
    throw appError;
  }
}
