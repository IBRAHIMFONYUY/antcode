# AntCodeHub — Smoke Test Checklist

This document outlines a manual smoke test flow to validate core functionality end-to-end before deployment.

## Prerequisites

- Firebase project set up and connected
- Firestore initialized with test data (or emulator running)
- Dev server running: `npm run dev`
- Two browsers or incognito windows (for simultaneous mentor/student testing)

## Test Data Setup (Optional)

For faster testing, seed your Firestore with:
- **Courses**: Add 1-2 courses via Firestore console with `title`, `description`, `ownerId` (mentor UID)
- **Mentors**: Create test mentor accounts and set `role: 'mentor'` in their user profile
- **Students**: Create test student accounts (or use signup flow)

---

## Test Flow

### 1. **Signup & Onboarding**
- [ ] Navigate to `/signup`
- [ ] Fill in full name, email, password, phone, tech career
- [ ] Submit and verify redirect to dashboard (or onboarding if incomplete)
- [ ] Verify user profile appears in Firestore `users/{uid}`
- [ ] Test Google Sign-up (if configured)

### 2. **Login & Redirection**
- [ ] Logout and go to `/login`
- [ ] Login with email/password
- [ ] Verify student redirects to `/dashboard` (student sidebar)
- [ ] Logout and login as mentor
- [ ] Verify mentor redirects to `/dashboard/mentor` (mentor sidebar visible)
- [ ] Test Google Sign-In

### 3. **Student Flow**

#### 3a. Browse & Enroll in Courses
- [ ] Navigate to `/dashboard/courses` (My Courses)
- [ ] See list of available courses
- [ ] Click on a course → `/dashboard/courses/[courseId]`
- [ ] Click "Enroll in Course" button
- [ ] Verify enrollment doc created in Firestore `enrollments` collection
- [ ] Verify button changes to "✓ Enrolled" and message updates

#### 3b. Submit a Task
- [ ] On enrolled course detail, click "Submit" on a task
- [ ] Fill in submission form and submit
- [ ] Verify taskSubmissions doc created in Firestore with `studentId`, `courseId`, `taskId`
- [ ] See success toast

#### 3c. View Reports
- [ ] Navigate to `/dashboard/reports`
- [ ] See list of submitted reports
- [ ] Verify real-time updates if submission made in another tab

#### 3d. Ask a Question
- [ ] Navigate to `/dashboard/ask`
- [ ] Type a question and submit
- [ ] Verify question appears in Firestore `questions` collection
- [ ] Question should appear in real-time on page

#### 3e. View Bookings
- [ ] Navigate to `/dashboard/bookings`
- [ ] See list of scheduled mentor sessions

### 4. **Guest Booking Flow**
- [ ] Go to landing page `/`
- [ ] Click "Book a Mentor" without being logged in
- [ ] Fill in guest name, email, booking details
- [ ] Submit booking
- [ ] Verify booking doc created in Firestore with `studentId: guest_{timestamp}`
- [ ] Verify WhatsApp button opens new tab to `wa.me`

### 5. **Mentor Flow**

#### 5a. View Sessions
- [ ] Login as mentor
- [ ] Navigate to `/dashboard/mentor/sessions`
- [ ] See list of bookings (student bookings)
- [ ] Click "Confirm" or "Decline" on pending bookings
- [ ] Verify Firestore booking status updated

#### 5b. View Students
- [ ] Navigate to `/dashboard/mentor/students`
- [ ] See list of students who booked or enrolled in your courses

#### 5c. View Questions & Answer
- [ ] Navigate to `/dashboard/mentor/questions`
- [ ] See real-time list of unanswered questions from students
- [ ] Click on a question and type an answer
- [ ] Submit answer
- [ ] Verify answer doc created in Firestore `answers` collection with `mentorId`
- [ ] Verify real-time badge count updates in sidebar (Questions nav item)

#### 5d. Review Task Submissions
- [ ] Navigate to `/dashboard/mentor/task-review`
- [ ] See list of pending task submissions from enrolled students
- [ ] Click to review and provide feedback
- [ ] Verify real-time badge count updates in sidebar (Task Review nav item)

#### 5e. View Earnings
- [ ] Navigate to `/dashboard/mentor/earnings`
- [ ] See dashboard or list of completed sessions and earnings

### 6. **Real-time Features**
- [ ] Open `/dashboard/mentor/questions` in one tab
- [ ] Open `/dashboard/ask` in another tab (student)
- [ ] Submit a question as student
- [ ] Verify it appears instantly in mentor tab (no page refresh)
- [ ] Answer as mentor
- [ ] Verify answer appears instantly in student tab

### 7. **Error Handling**
- [ ] Try to submit a task without enrollment → should show error "Not enrolled in course"
- [ ] Try to access `/dashboard/mentor/*` as student → should redirect to `/dashboard`
- [ ] Try to logout and access protected pages → should redirect to `/login`
- [ ] Simulate network error during form submission → should show error toast

### 8. **UI/UX**
- [ ] Verify all pages load without console errors
- [ ] Verify sidebar highlights active page
- [ ] Verify mobile responsiveness (test on mobile or responsive mode)
- [ ] Verify buttons disable during loading
- [ ] Verify toasts appear for success/error messages
- [ ] Verify loader spinners appear during data fetch

---

## Expected Results

All tests should **PASS** without errors. If any test fails:

1. Check browser console for JavaScript errors
2. Check Firestore rules in `docs/FIRESTORE_RULES.md` — may need deployment
3. Verify Firebase config is correct
4. Check network tab for failed API calls
5. Review component TypeScript errors with `npm run build`

## Post-Test Checklist

- [ ] No console errors or warnings in browser
- [ ] No unhandled promise rejections
- [ ] Data persists on page refresh
- [ ] Real-time updates work across tabs
- [ ] Build passes: `npm run build`

---

## Quick Start Commands

```bash
# Start dev server
npm run dev

# Run TypeScript check
npm run build

# View Firestore in console (if using emulator)
# Open http://localhost:4000 (Firestore emulator UI)
```

## Notes

- **Auth State**: Sessions persist via browser storage; logout clears session
- **Real-time**: Uses Firestore `onSnapshot`; ensure network is stable
- **Guest Bookings**: Uses email for contact; WhatsApp requires E.164 format phone number
- **Enrollment**: Required before task submission; enforced in Firestore rules

---

Enjoy testing! 🚀
