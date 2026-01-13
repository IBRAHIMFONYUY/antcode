# API Reference Guide

## Authentication

### useUser Hook
Provides user authentication and profile data.

```typescript
import { useUser } from '@/firebase/auth/use-user';

const { user, profile, loading } = useUser();
// user: Firebase User object
// profile: UserProfile type
// loading: boolean
```

**UserProfile Type:**
```typescript
{
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'student' | 'mentor';
  techCareer?: string;
  bio?: string;
  phoneNumber?: string;
  
  // Mentor-specific
  expertise?: string[];
  hourlyRate?: number;
  availability?: Record<string, boolean>;
  totalStudents?: number;
  totalSessions?: number;
  rating?: number;
  reviews?: number;
}
```

### useMentor Hook
Mentor-specific data with role verification.

```typescript
import { useMentor } from '@/hooks/use-mentor';

const { user, profile, loading, isMentor, mentorData } = useMentor();
// isMentor: boolean
// mentorData: { expertise, hourlyRate, availability, totalStudents, totalSessions, rating, reviews }
```

## Booking API

### useBookings Hook

```typescript
import { useBookings } from '@/hooks/use-bookings';

const {
  loading,
  error,
  createBooking,
  getStudentBookings,
  getMentorBookings,
  updateBookingStatus,
  cancelBooking,
  deleteBooking
} = useBookings();
```

**Creating a Booking:**
```typescript
const bookingId = await createBooking({
  studentId: 'user-123',
  studentName: 'John Doe',
  studentEmail: 'john@example.com',
  mentorId: 'mentor-456',
  mentorName: 'Jane Smith',
  mentorImageUrl: 'https://example.com/avatar.jpg',
  startTime: '2026-01-20T10:00:00Z',
  endTime: '2026-01-20T10:30:00Z',
  duration: 30,
  totalPrice: 25.00,
  topic: 'React Basics',
  goal: 'Understand hooks',
  status: 'pending',
});
```

**Getting Bookings:**
```typescript
const studentBookings = await getStudentBookings('user-123');
const mentorBookings = await getMentorBookings('mentor-456');
```

**Updating Status:**
```typescript
await updateBookingStatus('booking-123', 'confirmed');
```

**Canceling/Deleting:**
```typescript
await cancelBooking('booking-123');
await deleteBooking('booking-123');
```

### useExpertAvailability Hook

```typescript
import { useExpertAvailability } from '@/hooks/use-expert-availability';

const {
  loading,
  error,
  addAvailabilitySlot,
  getAvailableSlots,
  bookSlot,
  releaseSlot,
  deleteSlot
} = useExpertAvailability();
```

**Adding Slots:**
```typescript
const slotId = await addAvailabilitySlot('mentor-456', {
  date: '2026-01-20',
  startTime: '10:00',
  endTime: '10:30',
});
```

**Getting Slots:**
```typescript
const slots = await getAvailableSlots('mentor-456');
```

**Booking/Releasing:**
```typescript
await bookSlot('mentor-456', 'slot-123', 'booking-789');
await releaseSlot('mentor-456', 'slot-123');
```

## Task Review API

### useTaskReview Hook

```typescript
import { useTaskReview } from '@/hooks/use-task-review';

const {
  loading,
  error,
  submitTaskForReview,
  getMentorReviewQueue,
  saveTaskReview,
  getSubmissionReviews,
  getMentorReviews,
  getStudentReviews
} = useTaskReview();
```

**Submitting Task:**
```typescript
const submissionId = await submitTaskForReview({
  taskId: 'TASK-001',
  studentId: 'user-123',
  studentName: 'John Doe',
  studentEmail: 'john@example.com',
  submissionText: 'My solution...',
  submissionCode: 'const x = 5;',
  status: 'submitted',
});
```

**Getting Review Queue:**
```typescript
const submissions = await getMentorReviewQueue('mentor-456');
```

**Saving Review:**
```typescript
const reviewId = await saveTaskReview(
  'submission-123',
  'mentor-456',
  'Jane Smith',
  'user-123',
  'TASK-001',
  {
    knowledgeGaps: 'Missing understanding of...',
    targetedFeedback: 'Try to...',
    overallAssessment: 'Good effort...',
    rating: 4
  }
);
```

**Getting Reviews:**
```typescript
const submissionReviews = await getSubmissionReviews('submission-123');
const mentorReviews = await getMentorReviews('mentor-456');
const studentReviews = await getStudentReviews('user-123');
```

### reviewTaskSubmissionAction

Server action to call AI review generation.

```typescript
import { reviewTaskSubmissionAction } from '@/app/actions/task-review';

const result = await reviewTaskSubmissionAction({
  taskDescription: 'Task details...',
  studentSubmission: 'Student solution...',
  relevantContext: 'Additional context...'
});

// Returns:
// {
//   knowledgeGaps: string;
//   targetedFeedback: string;
//   overallAssessment: string;
// }
```

## Utility Functions

### Error Handling

```typescript
import { handleError, logError } from '@/utils/error-handler';

try {
  // operation
} catch (err) {
  const appError = handleError(err);
  logError(appError);
  // appError: { code, message, statusCode }
}
```

### Booking Service Utilities

```typescript
import {
  formatBookingDateTime,
  isUpcomingBooking,
  isPastBooking,
  getBookingStatusInfo,
  formatDuration,
  validateBookingData,
  calculateTotalPrice,
  canCancelBooking
} from '@/lib/booking-service';
```

**Example Usage:**
```typescript
const formatted = formatBookingDateTime('2026-01-20T10:00:00Z');
const isUpcoming = isUpcomingBooking(booking);
const info = getBookingStatusInfo('confirmed'); // { label, color, bgColor }
const canCancel = canCancelBooking(booking, 24); // 24-hour notice
const validation = validateBookingData(bookingData);
```

### Date Utilities

```typescript
import {
  toDate,
  formatDateString,
  formatTimestamp,
  formatTime
} from '@/lib/date-utils';
```

**Example Usage:**
```typescript
const date = toDate(firestoreTimestamp); // Convert Firestore timestamp to Date
const formatted = formatTimestamp(timestamp); // '1/20/2026'
const time = formatTime(timestamp); // '10:00 AM'
```

## Firebase Integration

### useAuth
Get Firebase Auth instance.

```typescript
import { useAuth } from '@/firebase';

const auth = useAuth();
```

### useFirestore
Get Firestore database instance.

```typescript
import { useFirestore } from '@/firebase';

const firestore = useFirestore();
```

## UI Components

### Custom Hooks

```typescript
import { useToast } from '@/hooks/use-toast';
import { useMobile } from '@/hooks/use-mobile';

const { toast } = useToast();
const isMobile = useMobile();

// Toast usage:
toast({
  title: 'Success',
  description: 'Operation completed',
  variant: 'default', // or 'destructive'
});
```

## Type Definitions

```typescript
// Core Types
import type {
  Booking,
  BookingStatus,
  ExpertAvailabilitySlot,
  ExpertAvailability,
  StudentTask,
  TaskSubmission,
  TaskReview,
  TaskStatus,
  UserProfile
} from '@/lib/types';
```

## Best Practices

1. **Always check loading state** before rendering
2. **Handle errors gracefully** with user-friendly messages
3. **Validate data** before API calls
4. **Use proper TypeScript types** for type safety
5. **Close subscriptions** in useEffect cleanup
6. **Memoize callbacks** to prevent unnecessary re-renders
7. **Use error boundaries** for error handling
8. **Test with different user roles** (student vs mentor)

## Rate Limiting

Currently no rate limiting implemented. Consider adding:
- Per-user request limits
- Per-endpoint rate limiting
- Firestore quota management

## Pagination

Not yet implemented. For large datasets, consider:
- Implementing cursor-based pagination
- Using Firestore's `limit()` and `startAfter()`
- Infinite scroll with `useInfiniteQuery`

## Caching

Currently uses Firebase's built-in caching. Consider:
- React Query for client-side caching
- Revalidation strategies
- Cache invalidation patterns
