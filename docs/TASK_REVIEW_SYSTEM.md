# AI Task Review System Documentation

## Overview

The AI Task Review System integrates Google Gemini 2.5 Flash via Genkit to provide intelligent, automated feedback on student task submissions. Mentors can generate AI reviews, customize ratings, and save comprehensive feedback.

## Architecture

### Components

#### Genkit Integration
- **Model**: Google Gemini 2.5 Flash
- **Provider**: Google AI
- **Location**: `/src/ai/genkit.ts`
- **Flow**: `/src/ai/flows/ai-task-review.ts`

#### Server Action
- **File**: `/src/app/actions/task-review.ts`
- **Function**: `reviewTaskSubmissionAction`
- **Purpose**: Safely call Genkit AI from client components

#### Hooks
- **useTaskReview**: CRUD operations for submissions and reviews
- **useUser**: Access to user/mentor profile data

### Pages

#### Student Task Submission (`/dashboard/tasks/submit`)
Where students submit completed tasks:
- Task ID input (required)
- Course ID input (optional)
- Written response textarea (2000 chars max)
- Code submission textarea (5000 chars max)
- Form validation
- Success confirmation
- Firestore persistence

#### Mentor Task Review (`/dashboard/mentor/task-review`)
Where mentors review and provide feedback:
- Queue of pending submissions
- Expandable submission cards
- View student submission content
- One-click AI review generation
- Review breakdown display:
  - Knowledge Gaps
  - Targeted Feedback
  - Overall Assessment
- 1-5 star rating selector
- Save Review button
- Auto-status update to "reviewed"

#### Student Feedback Review (`/dashboard/tasks/feedback`)
Where students view their feedback:
- List of all received reviews
- Sorted by most recent
- Color-coded sections:
  - Orange: Knowledge Gaps
  - Blue: Targeted Feedback
  - Green: Overall Assessment
- Mentor name and rating display
- Timestamp and review metadata
- Peer review indicator

## Database Schema

### TaskSubmissions Collection
```typescript
{
  id: string;
  taskId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submissionText: string;
  submissionCode?: string;
  fileUrl?: string;
  submittedAt: Timestamp;
  status: 'pending' | 'submitted' | 'reviewed';
}
```

### TaskReviews Collection
```typescript
{
  id: string;
  submissionId: string;
  taskId: string;
  mentorId: string;
  mentorName: string;
  studentId: string;
  knowledgeGaps: string;
  targetedFeedback: string;
  overallAssessment: string;
  rating: number; // 1-5
  isPeerReviewed?: boolean;
  reviewedAt: Timestamp;
  createdAt: Timestamp;
}
```

## AI Prompt Template

The AI is prompted with structured instructions:

```
You are an AI assistant helping mentors review student submissions for programming tasks.

Your goal is to identify knowledge gaps, provide targeted feedback, and offer an overall assessment.

Task Description: {taskDescription}
Student Submission: {studentSubmission}
Relevant Context: {relevantContext}

Based on this information, please provide:

1. Knowledge Gaps: Identify specific areas where the student lacks understanding.
2. Targeted Feedback: Offer concrete suggestions for improvement.
3. Overall Assessment: Give a summary of the student's performance and potential next steps.

Please write in a concise and professional manner.
```

## API Reference

### useTaskReview Hook

**Methods:**

```typescript
// Submit a task for review
submitTaskForReview(submissionData: Omit<TaskSubmission, 'id' | 'submittedAt'>): Promise<string | null>

// Get all pending submissions for a mentor
getMentorReviewQueue(mentorId: string): Promise<TaskSubmission[]>

// Save a completed review
saveTaskReview(
  submissionId: string,
  mentorId: string,
  mentorName: string,
  studentId: string,
  taskId: string,
  reviewData: {
    knowledgeGaps: string;
    targetedFeedback: string;
    overallAssessment: string;
    rating: number;
  }
): Promise<string | null>

// Get reviews for a specific submission
getSubmissionReviews(submissionId: string): Promise<TaskReview[]>

// Get all reviews created by a mentor
getMentorReviews(mentorId: string): Promise<TaskReview[]>

// Get all reviews for a student
getStudentReviews(studentId: string): Promise<TaskReview[]>
```

### Server Action: reviewTaskSubmissionAction

```typescript
async function reviewTaskSubmissionAction(
  input: {
    taskDescription: string;
    studentSubmission: string;
    relevantContext?: string;
  }
): Promise<{
  knowledgeGaps: string;
  targetedFeedback: string;
  overallAssessment: string;
} | null>
```

## User Flows

### Student Submission Flow
1. Student navigates to `/dashboard/tasks/submit`
2. Enters Task ID (e.g., "TASK-001")
3. Optionally enters Course ID
4. Types written response in textarea
5. Optionally pastes code in code textarea
6. Clicks "Submit Task"
7. Form validates required fields
8. Task submitted to Firestore `taskSubmissions` collection
9. Receives success toast confirmation
10. Submission appears in mentor's review queue

### Mentor Review Flow
1. Mentor navigates to `/dashboard/mentor/task-review`
2. Sees pending submissions list with student info
3. Clicks "View & Review" to expand submission
4. Reads the student's submitted work
5. Clicks "Generate AI Review"
   - Client calls `reviewTaskSubmissionAction` server action
   - Server calls Genkit AI with submission content
   - AI generates knowledge gaps, feedback, and assessment
   - Results displayed in review card
6. Adjusts star rating (default 3 stars)
7. Reviews AI suggestions and can edit if needed
8. Clicks "Save Review"
   - Saves review to `taskReviews` collection
   - Updates submission status to "reviewed"
   - Removes from pending queue
   - Displays success message

### Student Feedback Review Flow
1. Student navigates to `/dashboard/tasks/feedback`
2. Sees list of all received reviews
3. Reviews are sorted by most recent first
4. Each review shows:
   - Task identifier
   - Mentor name
   - Star rating
   - Knowledge gaps (orange section)
   - Feedback (blue section)
   - Assessment (green section)
   - Review timestamp
5. Can use feedback to improve future submissions

## Integration Example

```typescript
// In mentor task review component
import { reviewTaskSubmissionAction } from '@/app/actions/task-review';

const handleReviewSubmission = async (submission: TaskSubmission) => {
  const result = await reviewTaskSubmissionAction({
    taskDescription: `Student Task Submission`,
    studentSubmission: submission.submissionText || submission.submissionCode || '',
    relevantContext: `Student: ${submission.studentName}\nEmail: ${submission.studentEmail}`,
  });

  if (result) {
    // Display AI review
    setReviewResults({
      knowledgeGaps: result.knowledgeGaps,
      targetedFeedback: result.targetedFeedback,
      overallAssessment: result.overallAssessment,
    });
  }
};
```

## Error Handling

All task review operations include:
- Form validation before submission
- Firestore error mapping to user-friendly messages
- Toast notifications for success/failure
- Try-catch blocks with proper error propagation
- Loading states during AI processing

## Performance Considerations

1. **AI Generation Time**: Expect 2-5 seconds for AI review generation
2. **Submission Limits**: Currently no rate limiting (future enhancement)
3. **Database Queries**: Indexed by mentorId, studentId, taskId for efficiency
4. **Batch Processing**: Future enhancement for bulk review operations

## Future Enhancements

- [ ] Plagiarism detection via AI
- [ ] Rubric-based scoring system
- [ ] Batch review generation
- [ ] Email notifications for students
- [ ] Review comments and student replies
- [ ] Anonymous peer review mode
- [ ] Automated grading based on rubrics
- [ ] Integration with external code execution environments
- [ ] Custom AI prompts per course
- [ ] Review statistics and analytics

## Security & Privacy

1. **Data Isolation**: Students only see their own reviews
2. **Mentor Verification**: Only verified mentors can access review page
3. **Submission Privacy**: Submissions only visible to assigned mentor
4. **AI Context**: No sensitive data passed to AI beyond submission content
5. **Firestore Rules** (recommended):
   ```
   match /taskSubmissions/{document=**} {
     allow read: if request.auth.uid == resource.data.studentId;
     allow create: if request.auth.uid == request.resource.data.studentId;
   }
   
   match /taskReviews/{document=**} {
     allow read: if request.auth.uid == resource.data.studentId 
                    || request.auth.uid == resource.data.mentorId;
     allow create: if request.auth.uid == resource.data.mentorId;
   }
   ```

## Troubleshooting

### AI Review Generation Fails
- Check Genkit API key configuration
- Verify Google AI plugin is installed
- Ensure submission content is not empty
- Check Firestore connection

### Review Not Saving
- Verify mentor profile exists in Firestore
- Check Firestore write permissions
- Ensure all required fields are provided
- Check browser console for error details

### Student Not Seeing Reviews
- Verify student ID matches submission owner
- Check Firestore database for review document
- Confirm review was actually saved
- Check filter/status of reviews
