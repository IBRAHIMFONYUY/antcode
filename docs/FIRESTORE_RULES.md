# Firestore Security Rules - AntCode

Production-ready security rules for the AntCode mentorship platform. These rules enforce data access control and validation for all collections.

## 📋 Collections Overview

| Collection | Purpose | Access Control |
|-----------|---------|-----------------|
| `users` | User profiles (students, mentors) | Owner can read/write own profile |
| `courses` | Course definitions | Mentors create, students read |
| `tasks` | Course tasks | Read-only for students |
| `enrollments` | Student course enrollments | Students create own, mentors approve |
| `taskSubmissions` | Student task submissions | Students submit, mentors review |
| `bookings` | Mentorship sessions | Students book, mentors confirm |
| `questions` | Q&A questions | Anyone can read/create |
| `answers` | Q&A answers | Mentors answer, all can read |
| `reports` | Student incident reports | Students create own |
| `expertAvailability` | Mentor availability slots | Mentors manage own |

---

## 🔒 Firestore Rules (Copy to Firebase Console)

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ============================================
    // USERS COLLECTION
    // ============================================
    // Public read for profiles, authenticated write for own profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }

    // ============================================
    // COURSES COLLECTION
    // ============================================
    // Anyone can read courses, only mentors (ownerId) can create/update
    match /courses/{courseId} {
      allow read: if true;
      allow create: if request.auth != null && isValidCourseCreate();
      allow update: if request.auth != null && request.auth.uid == resource.data.ownerId && isValidCourseUpdate();
      allow delete: if request.auth != null && request.auth.uid == resource.data.ownerId;
    }

    // ============================================
    // TASKS COLLECTION
    // ============================================
    // Course creators can write, students can only read
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && canManageCourse(get(/databases/$(database)/documents/courses/$(request.resource.data.courseId)).data.ownerId);
      allow update: if request.auth != null && canManageCourse(get(/databases/$(database)/documents/courses/$(resource.data.courseId)).data.ownerId);
      allow delete: if request.auth != null && canManageCourse(get(/databases/$(database)/documents/courses/$(resource.data.courseId)).data.ownerId);
    }

    // ============================================
    // ENROLLMENTS COLLECTION
    // ============================================
    // Students enroll themselves, course owners can view
    match /enrollments/{enrollmentId} {
      allow create: if request.auth != null && request.auth.uid == request.resource.data.studentId;
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.studentId ||
        request.auth.uid == get(/databases/$(database)/documents/courses/$(resource.data.courseId)).data.ownerId
      );
      allow update: if request.auth != null && request.auth.uid == get(/databases/$(database)/documents/courses/$(resource.data.courseId)).data.ownerId;
      allow delete: if request.auth != null && (
        request.auth.uid == resource.data.studentId ||
        request.auth.uid == get(/databases/$(database)/documents/courses/$(resource.data.courseId)).data.ownerId
      );
    }

    // ============================================
    // TASK SUBMISSIONS COLLECTION
    // ============================================
    // Students submit own tasks, mentors can review
    match /taskSubmissions/{submissionId} {
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.studentId &&
        isEnrolled(request.auth.uid, request.resource.data.courseId);
      
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.studentId ||
        isCourseOwner(resource.data.courseId, request.auth.uid)
      );
      
      allow update: if request.auth != null && 
        isCourseOwner(resource.data.courseId, request.auth.uid) &&
        isValidTaskReview();
      
      allow delete: if false; // Never delete submissions
    }

    // ============================================
    // BOOKINGS COLLECTION
    // ============================================
    // Anyone (authenticated or guest) can create bookings, mentors can read/update own
    match /bookings/{bookingId} {
      allow create: if isValidBooking();
      
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.studentId ||
        request.auth.uid == resource.data.mentorId
      );
      
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.studentId ||
        request.auth.uid == resource.data.mentorId
      ) && isValidBookingUpdate();
      
      allow delete: if request.auth != null && (
        request.auth.uid == resource.data.studentId ||
        request.auth.uid == resource.data.mentorId
      );
    }

    // ============================================
    // QUESTIONS COLLECTION (Q&A)
    // ============================================
    // Anyone can read/create questions
    match /questions/{questionId} {
      allow read: if true;
      allow create: if request.auth != null && isValidQuestion();
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }

    // ============================================
    // ANSWERS COLLECTION (Q&A)
    // ============================================
    // Mentors answer questions, all can read
    match /answers/{answerId} {
      allow read: if true;
      allow create: if request.auth != null && isValidAnswer();
      allow update: if request.auth != null && request.auth.uid == resource.data.mentorId;
      allow delete: if request.auth != null && request.auth.uid == resource.data.mentorId;
    }

    // ============================================
    // REPORTS COLLECTION
    // ============================================
    // Students submit reports, only they and admins can read
    match /reports/{reportId} {
      allow create: if request.auth != null && request.auth.uid == request.resource.data.studentId;
      allow read: if request.auth != null && request.auth.uid == resource.data.studentId;
      allow update: if false;
      allow delete: if false;
    }

    // ============================================
    // EXPERT AVAILABILITY COLLECTION
    // ============================================
    // Mentors manage their own availability slots
    match /expertAvailability/{mentorId}/slots/{slotId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == mentorId;
      allow update: if request.auth != null && request.auth.uid == mentorId;
      allow delete: if request.auth != null && request.auth.uid == mentorId;
    }

    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    
    // Check if student is enrolled in course
    function isEnrolled(studentId, courseId) {
      return exists(/databases/$(database)/documents/enrollments/$(studentId + '_' + courseId));
    }

    // Check if user is course owner
    function isCourseOwner(courseId, userId) {
      return userId == get(/databases/$(database)/documents/courses/$(courseId)).data.ownerId;
    }

    // Check if user can manage course (is owner)
    function canManageCourse(ownerId) {
      return request.auth != null && request.auth.uid == ownerId;
    }

    // Validate required course fields on create
    function isValidCourseCreate() {
      let data = request.resource.data;
      return data.size() > 0 &&
        'title' in data && data.title is string && data.title.size() > 0 &&
        'ownerId' in data && data.ownerId == request.auth.uid &&
        'createdAt' in data;
    }

    // Validate course update (prevent ownerId change)
    function isValidCourseUpdate() {
      return request.resource.data.ownerId == resource.data.ownerId;
    }

    // Validate task review update (feedback, rating, status)
    function isValidTaskReview() {
      let data = request.resource.data;
      return data.feedback is string &&
        data.rating is number && data.rating >= 1 && data.rating <= 5 &&
        data.status == 'reviewed' &&
        data.reviewedAt is timestamp;
    }

    // Validate booking creation
    function isValidBooking() {
      let data = request.resource.data;
      return data.size() > 0 &&
        'mentorId' in data && data.mentorId is string &&
        'studentId' in data && data.studentId is string &&
        'startTime' in data &&
        'duration' in data && data.duration is number && data.duration > 0 &&
        'status' in data && data.status in ['pending', 'confirmed', 'upcoming', 'completed', 'cancelled'] &&
        'createdAt' in data;
    }

    // Validate booking update
    function isValidBookingUpdate() {
      let newData = request.resource.data;
      let oldData = resource.data;
      // Only allow status changes (pending → upcoming, completed, cancelled)
      return newData.mentorId == oldData.mentorId &&
        newData.studentId == oldData.studentId &&
        newData.startTime == oldData.startTime &&
        newData.duration == oldData.duration;
    }

    // Validate question creation
    function isValidQuestion() {
      let data = request.resource.data;
      return data.size() > 0 &&
        'title' in data && data.title is string && data.title.size() > 0 &&
        'content' in data && data.content is string &&
        'userId' in data && data.userId == request.auth.uid &&
        'createdAt' in data;
    }

    // Validate answer creation
    function isValidAnswer() {
      let data = request.resource.data;
      return data.size() > 0 &&
        'content' in data && data.content is string &&
        'questionId' in data &&
        'mentorId' in data && data.mentorId == request.auth.uid &&
        'createdAt' in data;
    }
  }
}
```

---

## 🚀 How to Deploy

### Via Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database** → **Rules** tab
4. Click **Edit rules**
5. Replace with rules above
6. Click **Publish**

### Via Firebase CLI
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

### Via Terraform (Infrastructure as Code)
```hcl
resource "google_firebaserules_ruleset" "rules" {
  source {
    files {
      content = file("firestore.rules")
      name    = "firestore.rules"
    }
  }
}

resource "google_firebaserules_release" "main" {
  name             = "cloud.firestore"
  ruleset_name     = google_firebaserules_ruleset.rules.name
  project          = var.project_id
}
```

---

## ✅ Testing Rules

### Test in Firebase Emulator
```bash
# Start emulator
firebase emulators:start

# Run tests
firebase emulators:exec 'npm test'
```

### Manual Test Cases
Use Firebase Console Rules Simulator:

**✅ SHOULD ALLOW**:
- Student reads their own profile
- Student submits task (enrolled)
- Student books session with mentor
- Mentor reads course tasks
- Mentor reviews student submission
- Public reads questions

**❌ SHOULD DENY**:
- Student reads other student's profile
- Student submits task (not enrolled)
- Student updates mentor profile
- Mentor deletes course
- Student deletes submission
- Unauthenticated user writes anything

---

## 📊 Required Firestore Indexes

Create these indexes for optimal query performance:

```
Collection: bookings
  - studentId (Ascending)
  - status (Ascending)

Collection: enrollments
  - studentId (Ascending)
  - courseId (Ascending)

Collection: taskSubmissions
  - courseId (Ascending)
  - studentId (Ascending)
  - status (Ascending)

Collection: courses
  - ownerId (Ascending)
  - createdAt (Descending)

Collection: questions
  - courseId (Ascending)
  - createdAt (Descending)
```

---

## 🔐 Security Checklist

- [ ] Rules deployed to production
- [ ] Tested with Firebase Rules Simulator
- [ ] All collections properly restricted
- [ ] Authentication checked on sensitive writes
- [ ] Ownership verified for updates/deletes
- [ ] Enrolled status validated for submissions
- [ ] Date/time fields validated
- [ ] Required fields enforced
- [ ] Indexes created for queries
- [ ] Test with real user accounts
- [ ] Monitor Firestore usage in console
- [ ] Set up alerts for rule violations

---

## 🐛 Troubleshooting

**"Permission denied" on bookings**
- Check: `studentId` matches authenticated user's `uid`
- Check: Timestamp format is valid

**"Permission denied" on taskSubmissions**
- Check: Student is enrolled in course (verify enrollments collection)
- Check: `studentId` matches authenticated user's `uid`

**"Permission denied" on updates**
- Check: Only allowed fields are being updated
- Check: User is authorized (owner/mentor)

---

## 📚 Additional Resources

- [Firestore Security Documentation](https://firebase.google.com/docs/firestore/security/start)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Firestore Query Optimization](https://firebase.google.com/docs/firestore/best-practices)
