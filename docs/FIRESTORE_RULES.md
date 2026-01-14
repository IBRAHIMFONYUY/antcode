# Suggested Firestore Security Rules

Below are recommended Firestore security rules to enforce server-side validation and authorization for the main collections used by AntCode.

Note: These are example rules — adapt them to your actual field names and app logic before deploying.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users - only allow read to authenticated users, and allow writes for own profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
    }

    // Bookings - allow anyone to create a booking (guests allowed), but only owner or mentor can update
    match /bookings/{bookingId} {
      allow create: if true; // allow guests to create bookings
      allow read: if request.auth != null || resource.data.studentId.matches('^guest_');
      allow update: if request.auth != null && (request.auth.uid == resource.data.studentId || request.auth.uid == resource.data.mentorId);
      allow delete: if false;
    }

    // Enrollments - only course owner or student can create/delete
    match /enrollments/{enrollmentId} {
      allow create: if request.auth != null && (request.auth.uid == request.resource.data.studentId);
      allow read: if request.auth != null;
      allow delete: if request.auth != null && (request.auth.uid == resource.data.studentId || request.auth.uid == get(/databases/$(database)/documents/courses/$(resource.data.courseId)).data.ownerId);
    }

    // Tasks and submissions - only enrolled students can submit
    match /taskSubmissions/{submissionId} {
      allow create: if request.auth != null && isEnrolled(request.auth.uid, request.resource.data.courseId);
      allow read: if request.auth != null && (request.auth.uid == resource.data.studentId || request.auth.uid == resource.data.mentorId);
      allow update: if request.auth != null && (request.auth.uid == resource.data.mentorId);
    }

    // Questions - anyone can create (including guests), mentors can answer
    match /questions/{qId} {
      allow create: if true;
      allow read: if true;
      allow update: if false;
    }

    match /answers/{aId} {
      allow create: if request.auth != null && request.auth.token.role == 'mentor';
      allow read: if true;
      allow delete: if request.auth != null && request.auth.uid == resource.data.mentorId;
    }

    // Helper function (pseudo) - implement as appropriate in rules
    function isEnrolled(studentId, courseId) {
      return exists(/databases/$(database)/documents/enrollments/$(studentId + '_' + courseId));
    }
  }
}
```

Security guidance:
- Prefer authenticated-only writes for sensitive resources (profiles, reviews).
- Validate required fields and types using `request.resource.data` checks.
- Index queries used in your frontend (e.g., where + orderBy) to avoid Firestore errors.
