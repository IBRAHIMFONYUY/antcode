# Mentor Dashboard Documentation

## Overview

The mentor dashboard provides comprehensive tools for mentors to manage their tutoring business, including:
- Session management
- Student relationship tracking
- Earnings analytics
- Course management
- Profile settings
- Task review capabilities

## Architecture

### User Types
Mentors are identified by `profile.role === 'mentor'` in the UserProfile type.

### Components

#### MentorDashboardLayout
Access control wrapper that:
- Checks if user is a mentor
- Redirects non-mentors to `/dashboard`
- Shows loading state during verification
- Wraps all mentor pages

#### MentorDashboardSidebar
Navigation component with links to:
- Dashboard (overview)
- Sessions
- Students
- Courses
- Task Review
- Earnings
- Settings
- Logout

### Pages

#### Dashboard (`/dashboard/mentor`)
Main overview page showing:
- Upcoming sessions count
- Total active students
- Total earnings from completed sessions
- Mentor rating
- Profile summary with expertise badges
- 5 most recent upcoming sessions

#### Sessions (`/dashboard/mentor/sessions`)
Session management with:
- Filterable tabs: All, Confirmed, Pending, Completed, Cancelled
- Session count per status
- Student details per session
- Status change actions
- Pending confirmation/decline buttons
- Mark completed button for confirmed sessions

#### Students (`/dashboard/mentor/students`)
Student tracking showing:
- Student name and email
- Total sessions and completed count
- Revenue from each student
- Last session date
- Grid/card layout for easy browsing
- Message button for communication

#### Courses (`/dashboard/mentor/courses`)
Course management (template for future expansion):
- List of created courses
- Course details: title, description, level, enrollments
- Rating and pricing info
- Revenue per course
- Edit and delete actions
- Create new course button

#### Earnings (`/dashboard/mentor/earnings`)
Financial analytics with:
- Total earnings card
- Pending earnings card
- Completed sessions count
- Average session price
- 6-month earnings chart with visualization
- Recent transactions list with payment status

#### Settings (`/dashboard/mentor/settings`)
Profile configuration:
- Profile picture display
- Display name editing
- Hourly rate configuration
- Bio text (500 char limit)
- Expertise areas management
- Multi-select from predefined list
- Save changes with validation

#### Task Review (`/dashboard/mentor/task-review`)
AI-powered task review center:
- Pending submissions queue
- AI-generated reviews with three components:
  - Knowledge gaps identification
  - Targeted feedback
  - Overall assessment
- 1-5 star rating system
- Save review to Firestore
- Status tracking

## Database Schema

### Mentor Profile Extension
```typescript
// Extended UserProfile for mentors
{
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'mentor';
  bio?: string;
  expertise: string[];
  hourlyRate: number;
  availability: Record<string, boolean>;
  totalStudents: number;
  totalSessions: number;
  rating: number;
  reviews: number;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}
```

## User Flows

### Session Management
1. Mentor views /dashboard/mentor/sessions
2. Filters by status (pending, confirmed, etc.)
3. Expands session to see full details
4. Takes action:
   - Confirm pending session
   - Mark confirmed session as completed
   - Decline/cancel session
5. System updates booking status
6. Student receives notification (future feature)

### Earnings Tracking
1. Mentor goes to /dashboard/mentor/earnings
2. Sees summary of total and pending earnings
3. Views 6-month earnings trend
4. Reviews recent transactions
5. Can export earnings report (future feature)

### Task Review
1. Mentor navigates to /dashboard/mentor/task-review
2. Sees queue of pending student submissions
3. Clicks "View & Review" on submission
4. Reads student's submitted work
5. Clicks "Generate AI Review"
6. System generates AI feedback using Genkit
7. Mentor reviews AI suggestions
8. Can adjust rating (1-5 stars)
9. Clicks "Save Review"
10. Review saved to Firestore
11. Submission removed from queue

### Profile Setup
1. Mentor clicks Settings link
2. Fills in display name and bio
3. Sets hourly rate
4. Adds areas of expertise from dropdown
5. Saves changes
6. Profile updated in real-time

## API Integration

### useBookings Hook
- `getMentorBookings(mentorId)` - Fetch all mentor's bookings
- `updateBookingStatus(bookingId, status)` - Change booking status

### useMentor Hook
- Returns mentor-specific data from user profile
- Checks `profile.role === 'mentor'`
- Provides `isMentor` boolean for conditional rendering

### useTaskReview Hook
- `getMentorReviewQueue(mentorId)` - Get pending submissions
- `saveTaskReview(...)` - Save review after AI generation

## Error Handling

All mentor operations use centralized error handling:
- Form validation before submission
- Firestore error mapping
- User-friendly error messages
- Toast notifications for feedback

## Security Considerations

1. **Access Control**: MentorDashboardLayout verifies mentor role
2. **Data Isolation**: Mentors only see their own bookings/reviews
3. **Firestore Rules** (recommended):
   ```
   match /bookings/{document=**} {
     allow read: if request.auth.uid == resource.data.studentId 
                    || request.auth.uid == resource.data.mentorId;
     allow create: if request.auth.uid == request.resource.data.studentId;
     allow update: if request.auth.uid == resource.data.mentorId;
   }
   ```

## Performance Optimization

1. Bookings are sorted by date for better UX
2. Student grouping to avoid duplicate data
3. Lazy loading for pagination (future)
4. Caching of frequently accessed mentor data (future)

## Future Enhancements

- [ ] Messaging system for mentor-student communication
- [ ] Payment processing and payouts
- [ ] Calendar view for availability
- [ ] Automatic notifications for session reminders
- [ ] Export earnings reports as PDF
- [ ] Course creation and management full UI
- [ ] Review analytics and student feedback
- [ ] Batch operations on multiple sessions
