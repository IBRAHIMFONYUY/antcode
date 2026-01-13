# Booking System Documentation

## Overview

The booking system is a complete mentorship booking platform that allows students to:
- Browse available mentors
- View mentor availability slots
- Book sessions with mentors
- Manage their bookings
- Receive confirmation and details

Mentors can:
- Set their availability
- Manage bookings
- See upcoming sessions
- Track earnings from completed sessions

## Architecture

### Database Schema

#### Bookings Collection
```typescript
{
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  mentorId: string;
  mentorName: string;
  mentorImageUrl: string;
  startTime: string; // ISO format
  endTime: string; // ISO format
  duration: number; // minutes
  totalPrice: number;
  topic: string;
  goal: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Expert Availability Collection
```typescript
expertAvailability/{expertId}/slots/{slotId}
{
  id: string;
  expertId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isBooked: boolean;
  bookingId?: string;
  createdAt: Timestamp;
}
```

## API Reference

### useBookings Hook

**Methods:**

- `createBooking(bookingData)` - Create a new booking
- `getStudentBookings(studentId)` - Get all bookings for a student
- `getMentorBookings(mentorId)` - Get all bookings for a mentor
- `updateBookingStatus(bookingId, status)` - Update booking status
- `cancelBooking(bookingId)` - Cancel a booking
- `deleteBooking(bookingId)` - Delete a booking

**Example:**
```typescript
const { createBooking, getStudentBookings } = useBookings();

// Create booking
const bookingId = await createBooking({
  studentId: 'user-123',
  studentName: 'John Doe',
  studentEmail: 'john@example.com',
  mentorId: 'mentor-456',
  mentorName: 'Jane Smith',
  mentorImageUrl: 'https://...',
  startTime: '2026-01-20T10:00:00Z',
  endTime: '2026-01-20T10:30:00Z',
  duration: 30,
  totalPrice: 25.00,
  topic: 'React Basics',
  goal: 'Understand hooks',
  status: 'pending',
});

// Get student bookings
const bookings = await getStudentBookings('user-123');
```

### useExpertAvailability Hook

**Methods:**

- `addAvailabilitySlot(expertId, slot)` - Add availability slot
- `getAvailableSlots(expertId)` - Get all available slots for expert
- `bookSlot(expertId, slotId, bookingId)` - Book an available slot
- `releaseSlot(expertId, slotId)` - Release a booked slot
- `deleteSlot(expertId, slotId)` - Delete a slot

## User Flows

### Student Booking Flow
1. Student navigates to expert profile
2. Views expert availability calendar
3. Selects date, time, and duration
4. Enters topic and goals (Step 2)
5. Verifies payment details (Step 3)
6. Submits booking (Step 4)
7. Receives confirmation
8. Booking appears in /dashboard/bookings

### Mentor Session Management Flow
1. Mentor goes to /dashboard/mentor/sessions
2. Filters sessions by status
3. Views session details with student info
4. Can confirm pending sessions
5. Can mark sessions as completed after meeting
6. Earnings are calculated from completed sessions

## Error Handling

All booking operations use centralized error handling via `handleError()` utility:

```typescript
try {
  await createBooking(data);
} catch (err) {
  const appError = handleError(err);
  console.error(appError.message);
}
```

Error codes are mapped to user-friendly messages for Firebase errors.

## Best Practices

1. **Always validate booking data** before submission
2. **Check availability** before creating bookings
3. **Handle cancellation notices** (24-hour rule)
4. **Track booking status** for notifications
5. **Use timestamps** for audit trails
6. **Validate prices** to prevent discrepancies
