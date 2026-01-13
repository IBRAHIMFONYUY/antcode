# Setup & Testing Guide

## Project Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project
- Google AI API key

### Installation

```bash
# Clone repository
git clone https://github.com/IBRAHIMFONYUY/antcode.git
cd antcode

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create `.env.local` with:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Genkit AI Configuration
GOOGLE_GENKIT_API_KEY=your_google_ai_key
```

### Running Locally

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

Server runs on `http://localhost:3000`

## Testing Strategy

### Manual Testing Checklist

#### Authentication Flow
- [ ] Student can sign up
- [ ] Student can log in
- [ ] Student can reset password
- [ ] Mentor can sign up with role selection
- [ ] Mentor can log in
- [ ] Invalid credentials show error

#### Booking System
- [ ] Student can view available mentors
- [ ] Student can select date/time from calendar
- [ ] Booking dialog flows through 4 steps
- [ ] Booking is created in Firestore
- [ ] Booking appears in student's bookings page
- [ ] Student can cancel booking (with 24-hour notice)
- [ ] Mentor can see incoming bookings
- [ ] Mentor can confirm/deny pending bookings

#### Mentor Dashboard
- [ ] Mentor sees overview with stats
- [ ] Session list shows all bookings filtered by status
- [ ] Student list shows grouped by unique students
- [ ] Earnings page calculates correctly
- [ ] Settings page saves profile changes
- [ ] Expertise can be added/removed

#### Task Review System
- [ ] Student can submit task with text or code
- [ ] Mentor can view pending submissions
- [ ] AI review generates in 2-5 seconds
- [ ] Review saves with rating
- [ ] Student can see received reviews
- [ ] Review data displays correctly

#### Error Handling
- [ ] Firebase errors show user-friendly messages
- [ ] Form validation prevents invalid submissions
- [ ] Network errors handled gracefully
- [ ] Loading states display correctly

### Test Data Setup

#### Create Test Student Account
```
Email: student@test.com
Password: TestPassword123!
Role: Student
```

#### Create Test Mentor Account
```
Email: mentor@test.com
Password: TestPassword123!
Role: Mentor
Display Name: John Mentor
Hourly Rate: $50
Expertise: React, Node.js, TypeScript
```

#### Create Test Booking
```
Student: student@test.com
Mentor: John Mentor
Date: Tomorrow
Time: 10:00 AM
Duration: 30 minutes
Topic: React Basics
Goal: Learn about hooks
Price: $25.00
```

#### Create Test Task Submission
```
Task ID: TASK-001
Student: student@test.com
Submission: "Function explanation..."
Code: "const myFunction = () => { ... }"
```

### Performance Testing

#### Load Testing
- Monitor response times for API calls
- Check Firestore quota usage
- Test with multiple concurrent users

#### Browser DevTools
```javascript
// Check performance metrics
performance.getEntriesByType('navigation')
performance.getEntriesByType('resource')
```

#### Lighthouse Audit
```bash
# Run Lighthouse
npm run lighthouse
```

Target scores:
- Performance: > 80
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### Security Testing

#### OWASP Top 10 Checks
- [ ] SQL Injection - Not applicable (Firestore)
- [ ] Cross-Site Scripting (XSS) - Test with special characters
- [ ] Cross-Site Request Forgery (CSRF) - Firebase handles
- [ ] Broken Authentication - Test with invalid tokens
- [ ] Sensitive Data Exposure - Check HTTPS usage
- [ ] Authorization Bypass - Test role-based access

#### Firestore Security Rules Testing
```bash
# Test rules locally
firebase emulators:start --project antcode

# Run security rules tests
firebase test:rules
```

### End-to-End Testing Scenarios

#### Scenario 1: Complete Booking Flow
1. Student logs in
2. Browses mentors
3. Selects availability slot
4. Goes through booking wizard (4 steps)
5. Submits booking
6. Mentor receives and confirms
7. Booking appears in both dashboards
8. Student cancels booking
9. Booking status updates for both

#### Scenario 2: Task Review Workflow
1. Student submits task with code
2. Submission appears in mentor review queue
3. Mentor expands submission and reviews code
4. Clicks "Generate AI Review"
5. AI provides feedback (5-10 seconds)
6. Mentor adjusts rating
7. Mentor saves review
8. Student receives notification (future)
9. Student views feedback
10. Feedback displays all components correctly

#### Scenario 3: Multi-Mentor Management
1. Mentor A creates bookings with 3 students
2. Mentor A views dashboard stats
3. Earnings show correct calculations
4. Mentor B has no bookings (0 stats)
5. Each mentor only sees their own data

### Browser Compatibility Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Responsive Design Testing

Test breakpoints:
- [ ] Mobile: 375px (iPhone SE)
- [ ] Tablet: 768px (iPad)
- [ ] Desktop: 1024px+ (MacBook)
- [ ] Large: 1440px (4K)

## Debugging

### Firebase Emulator Setup

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Start emulator
firebase emulators:start

# Run with emulator in code
// Use FIREBASE_EMULATOR_HOST environment variable
```

### Browser Console Tips

```javascript
// Check user auth state
firebase.auth().currentUser

// Check Firestore data
db.collection('users').get()

// Monitor Real-time Updates
db.collection('bookings')
  .where('mentorId', '==', 'mentor-123')
  .onSnapshot(snapshot => console.log(snapshot.docs))
```

### Common Issues & Solutions

**Issue**: Bookings not showing up
- Solution: Check user.uid matches studentId
- Check Firestore security rules
- Verify data was actually written

**Issue**: AI review takes too long
- Solution: Check Google AI API key
- Check internet connection
- Review Genkit error logs

**Issue**: Mentor role not detected
- Solution: Check profile.role field in Firestore
- Verify UserProfile type updated
- Check useMentor hook logic

**Issue**: Timestamps show wrong date
- Solution: Check time zone settings
- Use toDate() helper from date-utils
- Verify Firestore uses server timestamps

## Deployment

### Vercel Deployment

```bash
# Connect repository
vercel link

# Deploy
vercel deploy

# Preview deployment
vercel deploy --prod
```

### Firebase Hosting

```bash
# Build project
npm run build

# Deploy
firebase deploy

# Check deployment
firebase hosting:channel:list
```

### Environment Setup for Production

```env
# Use production Firebase project
NEXT_PUBLIC_FIREBASE_PROJECT_ID=antcode-prod

# Enable strict mode
NEXT_ENV=production

# Configure error tracking
SENTRY_AUTH_TOKEN=your_token
```

## Continuous Integration

### GitHub Actions Setup

Create `.github/workflows/test.yml`:

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - run: npm test
```

## Monitoring

### Error Tracking

Use Sentry for error monitoring:
```bash
npm install @sentry/nextjs
```

### Analytics

Track user flows with:
- Firebase Analytics
- Google Analytics 4
- Mixpanel

### Logs

Monitor logs with:
- Firebase Cloud Logging
- Datadog
- CloudWatch

## Metrics to Track

- Booking conversion rate
- Average session duration
- Mentor engagement rate
- Task review completion rate
- System uptime
- Error rate
- API response time
- User satisfaction (NPS)

## Maintenance

### Regular Tasks
- [ ] Review Firestore quota usage monthly
- [ ] Audit security rules quarterly
- [ ] Update dependencies monthly
- [ ] Review error logs weekly
- [ ] Backup Firestore data
- [ ] Monitor cost trends
