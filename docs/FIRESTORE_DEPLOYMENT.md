# Deploying Firestore Security Rules

This guide explains how to deploy the recommended Firestore security rules to your Firebase project.

## Step 1: Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
# or
curl -sL https://firebase.tools | bash
```

## Step 2: Authenticate with Firebase

```bash
firebase login
```

This will open a browser window to authenticate. Approve the request.

## Step 3: Initialize Firebase in Your Project (if not already done)

```bash
cd /path/to/antcode
firebase init firestore
```

You'll be prompted to:
- Select your Firebase project
- Choose default locations for Firestore security rules and indexes

If you already initialized, skip this step.

## Step 4: Create/Update Firestore Rules File

The rules file is typically at: `firestore.rules`

Replace the contents with the recommended rules from `docs/FIRESTORE_RULES.md`:

```bash
cp docs/FIRESTORE_RULES.md firestore.rules
# Or manually copy the rules content from FIRESTORE_RULES.md to firestore.rules
```

Alternatively, create/edit `firestore.rules` directly:

```bash
cat > firestore.rules << 'EOF'
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

    // Enrollments - only student can create/delete
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

    // Courses
    match /courses/{courseId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.token.role == 'mentor';
      allow update: if request.auth != null && request.auth.uid == resource.data.ownerId;
      allow delete: if request.auth != null && request.auth.uid == resource.data.ownerId;
    }

    // Helper function - check if student is enrolled in course
    function isEnrolled(studentId, courseId) {
      return exists(/databases/$(database)/documents/enrollments/$(studentId + '_' + courseId));
    }
  }
}
EOF
```

## Step 5: Deploy Rules to Firebase

```bash
firebase deploy --only firestore:rules
```

You should see output like:

```
i  deploying firestore
i  cloud.firestore: checking firestore.rules for compilation errors...
✔  cloud.firestore: rules file compiled successfully
i  cloud.firestore: uploading rules...
✔  Deploy complete!
```

## Step 6: Verify Rules are Active

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** → **Rules** tab
4. Verify the rules are displayed (should match your `firestore.rules` file)

## Step 7: Test Rules (Optional but Recommended)

### Test in Firestore Emulator (Local Development)

```bash
firebase emulators:start --only firestore
```

Then in your app, point to the emulator (check `src/firebase/config.ts` for `useEmulator` settings).

Run your app and test the flows:
- Unauthenticated user tries to create a document → **DENIED**
- Student tries to enroll → **ALLOWED**
- Mentor tries to answer a question → **ALLOWED**
- Student tries to answer → **DENIED** (only mentors can answer)

### Test in Production

Deploy the rules and manually test flows:
- Try actions in your app that should succeed/fail based on rules
- Check Firestore console for any "permission-denied" errors in the network tab

## Common Issues

### "Permission Denied" Errors

If you see `permission-denied` errors during testing:

1. **Check User Role**: Ensure user's Firestore profile has `role: 'mentor'` or `role: 'student'`
2. **Auth State**: Verify user is authenticated (check `request.auth` in rules)
3. **Document Path**: Verify the path matches the rule (e.g., `enrollments/{enrollmentId}`)
4. **Custom Claims**: If using custom claims for role, set them via Cloud Functions or Firebase Admin SDK

### Rules Won't Deploy

If you get a compilation error:

```bash
firebase deploy --only firestore:rules --debug
```

This shows detailed error messages. Common issues:
- Syntax error in `firestore.rules`
- Function reference error (e.g., undefined helper function)
- Path variable mismatch

### Indexes Not Auto-Created

If queries fail with "composite index needed", Firestore will prompt you to create an index in the Firebase Console or via:

```bash
firebase deploy --only firestore:indexes
```

## Next Steps

1. After deploying rules, test all app flows in the **Smoke Test** (`docs/SMOKE_TEST.md`)
2. Monitor Firestore rules usage in the [Firebase Console](https://console.firebase.google.com/) → **Firestore Database** → **Rules** tab
3. If rule violations occur, check app logs and adjust rules as needed

## Useful Resources

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/start)
- [Firebase CLI Documentation](https://firebase.google.com/docs/cli)
- [Firestore Rules Playground](https://firebase.google.com/docs/rules/unit-tests) (for local testing)

---

**Note**: These rules are **suggestions** based on the app architecture. Customize them based on your specific requirements and security model.
