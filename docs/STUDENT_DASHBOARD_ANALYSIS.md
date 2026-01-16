# Student Dashboard - Comprehensive Analysis

## Overview
The student dashboard is a feature-rich hub for students to manage their courses, bookings, tasks, Q&A, and progress tracking. It features a responsive sidebar, real-time data updates, and integration with Firestore for data persistence.

---

## Architecture

### Layout Structure
**File**: `src/app/dashboard/layout.tsx`

```
DashboardLayout (parent)
  └── DashboardLayoutContent
      ├── SidebarProvider
      ├── Sidebar (conditional: MentorDashboardSidebar OR DashboardSidebar)
      ├── DashboardHeader
      └── main (children pages)
```

**Key Features**:
- **Conditional Rendering**: Detects user role via `useMentor()` hook and renders appropriate sidebar (mentor vs student)
- **Responsive**: Uses SidebarProvider for collapsible/expandable sidebar on mobile
- **Header**: Shared header component across all dashboard routes

### Sidebar Navigation
**File**: `src/components/dashboard/sidebar.tsx`

**Navigation Items** (7 main routes):
| Icon | Title | Route | Purpose |
|------|-------|-------|---------|
| LayoutDashboard | Dashboard | `/dashboard` | Home/overview |
| BookOpen | My Courses | `/dashboard/courses` | Browse & enroll in courses |
| BookMarked | My Bookings | `/dashboard/bookings` | View mentor session bookings |
| ListTodo | Tasks | `/dashboard/tasks` | Submit & track tasks |
| BarChart2 | Reports | `/dashboard/reports` | Submit reports |
| MessageCircle | Ask | `/dashboard/ask` | Post questions to mentors |
| Calendar | Mentorship | `/dashboard/sessions` | View mentorship sessions |

**Bottom Navigation**:
- Profile → redirects to Settings
- Settings → user preferences
- Logout → sign out & redirect to login

**UI Features**:
- Responsive collapse/expand (toggles sidebar width)
- Active route highlighting
- Mobile-aware (no toggle button on mobile)
- Dark mode support

---

## Dashboard Pages (Student-Facing)

### 1. Dashboard Home (`/dashboard`)
**File**: `src/app/dashboard/page.tsx`

**Purpose**: Overview of student's progress and upcoming activities

**Components**:
- **Welcome Section**: Greeting with student name
- **Course Progress Cards**: 
  - Video Editing (60% progress, 12/22 lessons)
  - 3D Motion (70% progress, 15/22 lessons)
  - [Status: Mock data from component props]

- **Metrics Grid** (3 columns):
  - `<TimeSpending />`: Time spent learning
  - `<YourProgress />`: Overall progress tracker
  - `<YourMentors />`: List of assigned mentors

- **Analytics Grid** (3 columns):
  - `<AttendanceChart />`: Session attendance visualization
  - `<UpcomingCourses />`: Next courses to take
  - `<ClassSchedule />`: Upcoming class schedule

**Data Flow**:
```
useUser() → profile.role check
           ↓
           if role === 'mentor' → redirect to /dashboard/mentor
           ↓
           else → render student dashboard
```

**Status**: ✅ Implemented | ⏳ Mostly mock data (replace with real Firestore queries)

---

### 2. Courses (`/dashboard/courses`)
**File**: `src/app/dashboard/courses/page.tsx`

**Purpose**: Browse and discover courses created by mentors

**Features**:
- **Course List**: Grid of 2 columns (responsive)
- **Course Card** displays:
  - Title
  - Description
  - Progress percentage
  - "Open" link to course detail

**Data Source**:
- `useCourses()` hook → queries Firestore `courses` collection
- Real-time data binding via `getAllCourses(db)` in course-service

**Interactions**:
```
Click "Open" 
  ↓
Navigate to /dashboard/courses/[courseId]
  ↓
See course details + tasks
  ↓
Click "Enroll in Course"
  ↓
Creates enrollment record in Firestore
```

**Status**: ✅ Implemented & Firestore-integrated

---

### 3. Course Detail (`/dashboard/courses/[courseId]`)
**File**: `src/app/dashboard/courses/[courseId]/page.tsx`

**Purpose**: View course content and manage enrollment

**Layout**:
```
Course Title & Description
  ↓
Enrollment Status + CTA
  ├─ Loading → Spinner + "Loading enrollment status..."
  ├─ Enrolled → Green badge "✓ Enrolled" + "You can now submit tasks"
  └─ Not Enrolled → Button "Enroll in Course" + explanatory text

Lessons & Tasks Section
  ↓
Task Cards (grid layout)
  ├─ Title
  ├─ Due Date
  ├─ Status
  ├─ "Submit" button → /dashboard/tasks/submit?taskId=...
  └─ "View Feedback" link → /dashboard/tasks/feedback?taskId=...
```

**Enrollment Flow**:
```
Click "Enroll in Course"
  ↓
Call handleEnroll()
  ↓
Create doc in Firestore: enrollments/{studentId}_{courseId}
  ↓
Set enrolled = true
  ↓
Show confirmation badge
```

**Data Model** (Enrollment):
```javascript
// Collection: enrollments
// Doc ID: {studentId}_{courseId}
{
  id: "uid_courseId",
  courseId: "course123",
  studentId: "student_uid",
  studentName: "John Doe",
  createdAt: <timestamp>
}
```

**Status**: ✅ Fully implemented with real Firestore integration

---

### 4. Tasks (`/dashboard/tasks`)
**File**: `src/app/dashboard/tasks/page.tsx`

**Purpose**: Manage and track tasks across all enrolled courses

**Layout**:
```
Table with columns:
├─ Task (title)
├─ Course (course name)
├─ Status (badge: "Pending", "Submitted", "Reviewed")
├─ Due Date
└─ Action (button: "Review Task" or "View Task")
```

**Data Source**:
- `tasks` array from `src/lib/data.ts` (mock data)
- [TODO: Replace with real Firestore `taskSubmissions` collection query]

**Task Statuses**:
| Status | Badge Color | Action Button |
|--------|------------|-----------------|
| Pending | outline | "View Task" |
| Submitted | secondary | "Review Task" |
| Reviewed | default | "View Task" |

**Interactions**:
```
Click "Review Task" or "View Task"
  ↓
Navigate to /dashboard/tasks/{taskId}/review or /dashboard/tasks/{taskId}/view
```

**Status**: ⏳ UI implemented | ⏳ Mock data (needs Firestore integration)

---

### 5. Bookings (`/dashboard/bookings`)
**File**: `src/app/dashboard/bookings/page.tsx`

**Purpose**: Manage mentor session bookings

**Features**:
- **Tabbed Interface**: 4 tabs
  - Upcoming (count badge)
  - Pending (count badge)
  - Completed (count badge)
  - Cancelled (count badge)

- **Booking Card** displays:
  - Mentor info (name, avatar, expertise)
  - Date & time
  - Duration
  - Status badge
  - Price
  - Action buttons (Join, Cancel, etc.)

**Data Flow**:
```
useBookings().getStudentBookings(user.uid)
  ↓
Query Firestore: bookings where studentId === user.uid
  ↓
Fetch all bookings
  ↓
Filter by status (upcoming, pending, completed, cancelled)
  ↓
Render tabs
```

**Booking Status Flow**:
```
pending → upcoming → completed
    ↓
  cancelled
```

**Interactions**:
- **Cancel Booking**: 
  - Click cancel button
  - Confirmation dialog
  - Call updateBookingStatus(bookingId, 'cancelled')
  - Update UI

- **Join Session**: [TODO: Integrate with video call provider]

**Status**: ✅ Fully implemented with real Firestore integration

---

### 6. Q&A / Ask (`/dashboard/ask`)
**File**: `src/app/dashboard/ask/page.tsx`

**Purpose**: Post questions for mentors to answer

**Layout**:
```
Form Section:
  ├─ Input: Question (textarea, required)
  └─ Button: "Post Question"

Questions Feed (real-time):
  ├─ Student Name
  ├─ Posted Time
  ├─ Question Text
  └─ [TODO: Add reply thread]
```

**Form Handling**:
```
Submit Question
  ↓
Call submitQuestion(db, { text, studentId, studentName, createdAt })
  ↓
Add to Firestore: questions/{auto-id}
  ↓
Toast: "Question posted"
  ↓
Clear form
```

**Data Model** (Question):
```javascript
// Collection: questions
{
  id: "<auto-id>",
  text: "How do I implement...",
  studentId: "uid",
  studentName: "John Doe",
  createdAt: <timestamp>,
  [TODO: add mentorReply field]
}
```

**Real-time Updates**:
- Uses `useRealtimeCollection('questions', { orderBy: { field: 'createdAt', direction: 'desc' }, limit: 100 })`
- Questions fetch with latest first
- Auto-updates when mentor replies

**Status**: ✅ Implemented with real-time Firestore binding

---

### 7. Reports (`/dashboard/reports`)
**File**: `src/app/dashboard/reports/page.tsx`

**Purpose**: Submit issue reports or feedback to mentors

**Layout**:
```
Form Section:
  ├─ Title (text input, required)
  ├─ Description (textarea, required)
  └─ Button: "Submit Report"
```

**Form Handling**:
```
Submit Report
  ↓
Call submitReport(db, { title, description, studentId, studentName, createdAt })
  ↓
Add to Firestore: reports/{auto-id}
  ↓
Toast: "Report submitted"
  ↓
Clear form
```

**Data Model** (Report):
```javascript
// Collection: reports
{
  id: "<auto-id>",
  title: "Issue with course content",
  description: "...",
  studentId: "uid",
  studentName: "John Doe",
  createdAt: <timestamp>,
  [TODO: add status, resolution fields]
}
```

**Status**: ✅ Implemented | ⏳ No feedback loop yet

---

### 8. Sessions (`/dashboard/sessions`)
**File**: `src/app/dashboard/sessions/page.tsx`

**Purpose**: View upcoming and past mentorship sessions

**Layout**:
```
Table with columns:
├─ Mentor (name + avatar)
├─ Date & Time
├─ Duration
├─ Status (badge)
└─ Action (button: "Join Call" or "View Details")
```

**Data Source**:
- `sessions` array from `src/lib/data.ts` (mock data)
- [TODO: Replace with real Firestore `bookings` collection query filtered by status='completed']

**Session Statuses**:
| Status | Badge Color | Action |
|--------|------------|--------|
| Upcoming | secondary | "Join Call" |
| Completed | default | "View Details" |
| Cancelled | destructive | "View Details" |

**Status**: ⏳ UI implemented | ⏳ Mock data (needs Firestore integration)

---

### 9. Settings (`/dashboard/settings`)
**File**: `src/app/dashboard/settings/page.tsx`

**Purpose**: User preferences and account settings

**Features**:
- [Details to be determined based on actual implementation]

**Status**: ⏳ Route exists, needs implementation

---

### 10. Profile (`/dashboard/profile`)
**File**: `src/app/dashboard/profile/page.tsx`

**Current Implementation**:
```typescript
// Redirects to Settings
useEffect(() => {
  router.replace('/dashboard/settings');
}, [router]);
```

**Status**: ⏳ Redirects to Settings (awaiting profile page design)

---

## Real-time Hooks & Services

### Core Hooks

#### 1. `useCourses()` & `useCourse(courseId)`
**File**: `src/hooks/use-courses.ts`

```typescript
// Get all courses
const { courses, loading } = useCourses();

// Get single course + tasks
const { course, tasks, loading } = useCourse(courseId);
```

**Data Sources**:
- `getAllCourses(db)` → queries `courses` collection
- `getCourseById(db, courseId)` → fetches specific course
- `getTasksForCourse(db, courseId)` → fetches tasks for course

---

#### 2. `useBookings()`
**File**: `src/hooks/use-bookings.ts`

```typescript
const {
  createBooking,
  updateBookingStatus,
  getStudentBookings,
  loading,
  error
} = useBookings();
```

**Methods**:
- `createBooking(bookingData)` → add new booking
- `updateBookingStatus(bookingId, status)` → update status (pending → upcoming → completed → cancelled)
- `getStudentBookings(studentId)` → fetch all student bookings
- `getAvailableSlots(mentorId)` → get mentor availability
- `getMentorBookings(mentorId)` → fetch mentor's bookings

---

#### 3. `useRealtimeCollection()`
**File**: `src/hooks/use-realtime.ts`

Generic hook for real-time Firestore data binding:

```typescript
const { data, loading, error } = useRealtimeCollection(
  'questions',
  {
    where: [{ field: 'studentId', operator: '==', value: userId }],
    orderBy: { field: 'createdAt', direction: 'desc' },
    limit: 50
  }
);
```

**Options**:
- `where`: Array of filter conditions
- `orderBy`: Sort order (field, direction)
- `limit`: Result limit

**Used For**:
- Questions (Ask page)
- Task submissions
- Notifications
- Bookings (real-time status updates)

---

#### 4. `useQuestions()` & `useSubmissions()`
**File**: `src/hooks/use-questions.ts` & `src/hooks/use-submissions.ts`

Real-time listeners for specific data:

```typescript
// Questions posted by student
const { questions, loading } = useQuestions(studentId);

// Task submissions for student
const { submissions, loading } = useSubmissions(studentId);
```

---

#### 5. `useNotifications()`
**File**: `src/hooks/use-notifications.ts`

Aggregates real-time data for notification badges:

```typescript
const { 
  unansweredQuestionsCount,
  pendingSubmissionsCount,
  newBookingsCount
} = useNotifications(userId);
```

**Usage**: Updates badge counts in sidebar/header

---

#### 6. `useWaitForProfile()`
**File**: `src/hooks/use-wait-for-profile.tsx`

Robust profile loading for auth pages:

```typescript
const { ready, timedOut } = useWaitForProfile();
```

**Purpose**: Wait for Firestore user doc to populate after signup/login
**Timeout**: 8 seconds with toast alert if timeout

---

### Service Functions

#### `course-service.ts`
**File**: `src/lib/course-service.ts`

Key functions:
- `getAllCourses(db)` → fetch all courses
- `getCourseById(db, courseId)` → get single course
- `getTasksForCourse(db, courseId)` → fetch tasks
- `submitQuestion(db, payload)` → add question
- `submitReport(db, payload)` → add report
- `submitTask(db, payload)` → submit task
- `getTaskSubmissions(db, taskId)` → fetch submissions

---

#### `booking-service.ts`
**File**: `src/lib/booking-service.ts`

Key utilities:
- `formatBookingDateTime()` → format date/time
- `getBookingStatusInfo()` → status color/label
- `formatDuration()` → format duration string
- `canCancelBooking()` → check if cancellable

---

## Data Flow Diagrams

### Course Enrollment Flow
```
Student views /dashboard/courses
        ↓
useCourses() fetches from Firestore
        ↓
Student clicks course → /dashboard/courses/[courseId]
        ↓
useCourse(courseId) loads course + tasks
        ↓
Check enrollment status in enrollments collection
        ↓
If not enrolled:
  - Show "Enroll in Course" button
  - Click → handleEnroll()
  - Create doc in enrollments collection
  - Show "✓ Enrolled" badge
        ↓
Can now submit tasks
```

### Task Submission Flow
```
Student enrolled in course
        ↓
Clicks course → sees tasks
        ↓
Clicks "Submit" on task
        ↓
Navigate to /dashboard/tasks/submit?taskId=...
        ↓
Fill submission form
        ↓
Click "Submit Task"
        ↓
Validate enrollment: is student enrolled in course?
        ↓
If yes:
  - Add to taskSubmissions collection
  - Show "Task submitted" toast
  - Redirect to tasks page
        ↓
Mentor sees pending submission
  - Reviews + provides feedback
  - Updates status to "reviewed"
```

### Real-time Q&A Flow
```
Student posts question on /dashboard/ask
        ↓
submitQuestion() → add to Firestore
        ↓
useRealtimeCollection listens on questions
        ↓
Mentor logs in → sees question in their Ask page
        ↓
Mentor posts reply
        ↓
Question doc updated in Firestore
        ↓
Student sees reply real-time (via onSnapshot)
```

---

## State Management Strategy

### Global State (Firebase)
- User auth state via `useUser()` hook
- Role detection via `useMentor()` hook
- Real-time data via Firestore listeners (`onSnapshot`)

### Component State
- Form inputs (question, title, description)
- Loading states
- UI toggles (tabs, modals, confirmations)

### No Redux/Zustand
- Relies on React hooks + Firestore real-time bindings
- Lightweight and Firebase-native

---

## Responsive Design

### Breakpoints
- **Mobile** (< 768px): Single column, collapsed sidebar
- **Tablet** (768px - 1024px): 2 columns
- **Desktop** (> 1024px): 3 columns, expanded sidebar

### Mobile-Specific Features
- `useIsMobile()` hook to detect screen size
- Sidebar collapse toggle removed on mobile
- Cards stack vertically
- Tables may scroll horizontally

---

## TODO / Pending Features

### High Priority
- [ ] Replace mock data in Tasks page with Firestore queries
- [ ] Replace mock data in Sessions page with Firestore queries
- [ ] Implement Settings page (user preferences)
- [ ] Add real video call integration (for "Join Call" button)
- [ ] Add task submission UI (`/dashboard/tasks/submit`)
- [ ] Add feedback view UI (`/dashboard/tasks/feedback`)

### Medium Priority
- [ ] Add course search/filter on Courses page
- [ ] Add course categories and sorting
- [ ] Add progress tracking visualization (charts)
- [ ] Add email notifications for course updates
- [ ] Add attendance tracking for sessions

### Low Priority
- [ ] Add course reviews/ratings from students
- [ ] Add certificate generation on course completion
- [ ] Add course recommendations based on progress
- [ ] Add leaderboard for top students
- [ ] Add discussion forums per course

---

## Performance Considerations

### Current Optimizations
- Real-time listeners with `limit` to prevent loading too much data
- Lazy loading of course details (only on page view)
- Sidebar collapse for mobile (reduces render overhead)

### Future Optimizations
- [ ] Add pagination for questions and bookings
- [ ] Implement virtual scrolling for large lists
- [ ] Cache course data with SWR or React Query
- [ ] Debounce search inputs

---

## Testing Checklist

### Manual Smoke Tests
- [ ] Student can enroll in course
- [ ] Real-time questions update without page refresh
- [ ] Task submission validates enrollment
- [ ] Booking cancellation works
- [ ] Sidebar collapses on mobile
- [ ] All navigation links work

### Jest Unit Tests
- [ ] useCourses() hook fetches and filters correctly
- [ ] useBookings() creates and updates bookings
- [ ] Enrollment validation prevents unauthorized submissions
- [ ] Real-time updates trigger re-renders

---

## Summary

The student dashboard is a comprehensive learning platform with:
✅ 9 main pages with responsive UI
✅ Real-time Firestore data binding
✅ Enrollment system for courses
✅ Task submission workflow
✅ Booking management
✅ Q&A real-time updates
✅ Mobile-responsive design

**Next Steps**: 
1. Replace remaining mock data with Firestore queries
2. Implement task submission & feedback UIs
3. Add settings page
4. Run comprehensive smoke tests
5. Deploy Firestore security rules
