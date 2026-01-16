# Student Enrollment & Task Submission Flow - Test Guide

Complete test of the enrollment persistence and data sync system.

## 📋 Test Prerequisites

✅ You must have:
- [ ] Firebase project configured
- [ ] At least 1 course created by a mentor
- [ ] At least 1 task created for that course
- [ ] Student account (different from mentor)
- [ ] Browser DevTools open (F12) for console logs

---

## 🔄 Full Enrollment Flow Test

### Step 1: Login as Student
1. Go to `/dashboard`
2. If not logged in, go to `/login`
3. Create or login with a **student account** (not mentor)
4. Verify you see the student dashboard

**Expected**: Dashboard loads, you see "Courses", "Tasks", etc.

---

### Step 2: Browse Available Courses
1. Click **Courses** in sidebar → `/dashboard/courses`
2. You should see list of courses created by mentors

**Expected**: 
- [ ] Course cards appear
- [ ] Each card shows title and description
- [ ] "Open" button visible on each course

**Console Check** (F12 → Console):
```
[useCourses] Loading courses
[useCourses] Courses loaded: [array of courses]
```

---

### Step 3: Open Course Details
1. Click **"Open"** on a course
2. Should navigate to `/dashboard/courses/[courseId]`

**Expected**:
- [ ] Course title and description displayed
- [ ] List of tasks for this course shown
- [ ] "Enroll in Course" button visible (not "✓ Enrolled" yet)

**Console Check** (F12 → Console):
```
[CourseDetailPage] courseId: <some-id>
[CourseDetailPage] Checking enrollment for: { courseId: <id>, studentId: <your-uid> }
[CourseDetailPage] Enrollment result: { isEnrolled: false, docsCount: 0 }
```

---

### Step 4: Enroll in Course ⭐ PERSISTENCE TEST #1
1. Click **"Enroll in Course"** button

**Expected**:
- [ ] Button changes to show **"✓ Enrolled"** badge (green)
- [ ] Message: "You can now submit tasks for this course"
- [ ] Page stays loaded (no refresh needed)

**Console Check** (F12 → Console):
```
[CourseDetailPage] Creating enrollment: { enrollmentId: '<uid>_<courseId>', courseId: '<id>', studentId: '<uid>' }
[CourseDetailPage] Enrollment created successfully
```

**Firestore Check**:
1. Open [Firebase Console](https://console.firebase.google.com)
2. Select your project → Firestore Database
3. Click **"enrollments"** collection
4. You should see a new document with ID: `<your-uid>_<courseId>`
5. Document should contain:
   ```
   {
     "id": "<uid>_<courseId>",
     "courseId": "<courseId>",
     "studentId": "<your-uid>",
     "studentName": "<your-name>",
     "createdAt": <timestamp>
   }
   ```

✅ **If visible in Firestore, enrollment persists!**

---

### Step 5: Refresh Page - PERSISTENCE TEST #2
1. Press **F5** to refresh the page
2. Should still be on course detail page

**Expected**:
- [ ] Page reloads
- [ ] Enrollment check runs again
- [ ] **"✓ Enrolled"** badge appears immediately (NOT "Enroll in Course" button)

**Console Check** (F12 → Console):
```
[CourseDetailPage] Checking enrollment for: { courseId: <id>, studentId: <uid> }
[CourseDetailPage] Enrollment result: { isEnrolled: true, docsCount: 1 }
```

✅ **If badge shows after refresh, persistence works!**

---

### Step 6: Submit a Task - REAL-TIME SYNC TEST #1
1. On course detail page, find a task
2. Click **"Submit"** button on the task

**Expected**:
- [ ] Navigate to `/dashboard/tasks/submit?taskId=<id>`
- [ ] Task title, description, course name displayed
- [ ] "Code/Solution" textarea visible
- [ ] "Submit" button available

**Console Check** (F12 → Console):
```
[useCourse] Loading course: <courseId>
[useCourse] Data loaded: { course: <id>, tasksCount: 1 }
```

---

### Step 7: Enter Code and Submit Task
1. Click in **"Code or Solution"** textarea
2. Enter some test code:
   ```
   // My solution
   console.log('Hello World');
   ```
3. Optionally add notes in the notes textarea
4. Click **"Submit Task"** button

**Expected**:
- [ ] Loading spinner appears briefly
- [ ] Success toast: "Task submitted successfully!"
- [ ] Automatic redirect to `/dashboard/tasks`
- [ ] Page shows your submitted task in the table

**Console Check** (F12 → Console):
```
Task submission creates doc in taskSubmissions collection
```

**Firestore Check**:
1. Go to Firebase Console → Firestore
2. Click **"taskSubmissions"** collection
3. You should see a new document with:
   ```
   {
     "taskId": "<taskId>",
     "courseId": "<courseId>",
     "studentId": "<your-uid>",
     "code": "// My solution\nconsole.log('Hello World');",
     "notes": "<optional-notes>",
     "submittedAt": <timestamp>,
     "status": "submitted"
   }
   ```

✅ **If visible in Firestore, task submission persists!**

---

### Step 8: Verify Real-Time Updates - REAL-TIME SYNC TEST #2
1. You should now be on `/dashboard/tasks` page
2. Your submitted task should appear in the table

**Expected**:
- [ ] Task table shows:
  - | Task | Course | Status | Due Date | Action |
  - | Your Task | Course Name | Submitted | Date | View Submission |

**Firestore Check**:
- In Firestore Console, open your taskSubmission doc
- You should see all fields populated with your data

✅ **If task appears immediately (no refresh), real-time sync works!**

---

### Step 9: Full Refresh - REAL-TIME PERSISTENCE TEST #3
1. Go to `/dashboard/tasks`
2. Press **F5** to refresh the entire page

**Expected**:
- [ ] Page reloads
- [ ] Real-time listener reconnects
- [ ] Your submitted task still visible in table
- [ ] Status shows as "Submitted"

**Console Check** (F12 → Console):
```
Real-time listener re-established
Tasks loaded from Firestore
```

✅ **If task is still there, persistence is working!**

---

### Step 10: Check Task in Dashboard Home - REAL-TIME SYNC TEST #3
1. Click **Dashboard** in sidebar → `/dashboard`
2. Look for "Your Progress" or course progress cards

**Expected**:
- [ ] Course progress shows updated percentage
- [ ] If showing "1 task submitted / 1 total" → 100% progress
- [ ] Or similar calculation

✅ **If dashboard updates automatically, real-time sync works!**

---

## 🔐 Security & Data Integrity Tests

### Test Enrollment Validation
1. **Goal**: Verify you can ONLY submit tasks for courses you're enrolled in
2. **Setup**: Have 2 courses (enrolled in one, not other)
3. **Test**:
   - Try to submit a task from enrolled course → ✅ Should work
   - Try to submit a task from non-enrolled course → ❌ Should show enrollment error

**Expected Error Message**:
```
"You are not enrolled in this course"
or similar enrollment validation error
```

### Test Data Isolation
1. **Goal**: Verify students can ONLY see own data
2. **Setup**: 2 student accounts
3. **Test**:
   - Student A submits task
   - Login as Student B
   - Student B's `/dashboard/tasks` should NOT show Student A's submission

✅ **If isolated, data is secure!**

---

## 📊 Firestore Data Model Verification

Open Firebase Console and verify these collections exist:

```
✅ enrollments
  └─ Document: {studentId}_{courseId}
     ├─ courseId: string
     ├─ studentId: string
     ├─ studentName: string
     └─ createdAt: timestamp

✅ taskSubmissions
  └─ Document: auto-generated
     ├─ taskId: string
     ├─ courseId: string
     ├─ studentId: string (must match current user!)
     ├─ code: string (the submitted code)
     ├─ notes: string (optional)
     ├─ submittedAt: timestamp
     └─ status: 'submitted'

✅ tasks
  └─ Document: taskId
     ├─ title: string
     ├─ description: string
     ├─ courseId: string
     ├─ dueDate: timestamp
     └─ ...

✅ courses
  └─ Document: courseId
     ├─ title: string
     ├─ description: string
     ├─ ownerId: string (mentor uid)
     └─ ...
```

---

## ✅ Full Checklist

Complete this checklist to verify all functionality:

- [ ] **Enrollment Persists**
  - [ ] Enroll button works
  - [ ] Shows "✓ Enrolled" badge
  - [ ] Enrollment visible in Firestore
  - [ ] Persists after refresh

- [ ] **Task Submission**
  - [ ] Can submit task when enrolled
  - [ ] Task appears in `/dashboard/tasks`
  - [ ] Task visible in Firestore taskSubmissions
  - [ ] Status shows as "submitted"

- [ ] **Real-Time Sync**
  - [ ] Dashboard updates without refresh
  - [ ] Task appears immediately in table
  - [ ] Progress recalculates in real-time
  - [ ] Multiple pages stay in sync

- [ ] **Data Persistence**
  - [ ] Refresh page → data still there
  - [ ] Navigate away and back → data persists
  - [ ] Close browser and reopen → data still there
  - [ ] Firestore shows all documents

- [ ] **Security**
  - [ ] Can only submit enrolled tasks
  - [ ] Cannot see other student's submissions
  - [ ] Firestore rules prevent unauthorized access

---

## 🐛 Troubleshooting

### Issue: "Course not found" when opening course
- **Solution**: Check Firestore rules allow reading courses
- **Check**: Console logs show courseId being passed correctly
- **Fix**: Run: `firebase emulators:start` if using emulator

### Issue: Enrollment button doesn't work
- **Check**: Browser console (F12) for errors
- **Check**: Firestore rules allow creating enrollments collection
- **Solution**: Verify user is logged in (user.uid exists)

### Issue: Task doesn't appear after submission
- **Check**: Firestore taskSubmissions collection exists
- **Check**: Document was created with correct fields
- **Check**: Real-time listener is connected (check network tab)
- **Solution**: Refresh page to reload listener

### Issue: "You are not enrolled" when submitting task
- **Check**: Enrollment doc exists in Firestore with correct courseId
- **Check**: Enrollment courseId matches task courseId
- **Solution**: Go back and enroll again, verify Firestore doc created

---

## 📚 Additional Monitoring

### Console Logs to Watch For
```javascript
// Good signs:
[CourseDetailPage] Enrollment created successfully ✅
[CourseDetailPage] Enrollment result: { isEnrolled: true } ✅
[useCourse] Data loaded ✅

// Bad signs:
[CourseDetailPage] Enrollment check error ❌
Cannot read property 'uid' of null ❌
Query requires an index ❌
```

### Firestore Usage Monitoring
1. Firebase Console → Firestore → **Usage**
2. Monitor:
   - Read operations (should increase on page load)
   - Write operations (should increase on enroll/submit)
   - Errors (should be zero)

---

## 🎯 Success Criteria

All tests pass when:

✅ Student can enroll in course
✅ Enrollment is persisted in Firestore
✅ Enrollment persists after page refresh
✅ Student can submit task only if enrolled
✅ Task submission is saved in Firestore
✅ Task appears in real-time on `/dashboard/tasks`
✅ Dashboard progress updates automatically
✅ Data persists across browser sessions
✅ Data is isolated between students
✅ All Firestore collections properly structured
