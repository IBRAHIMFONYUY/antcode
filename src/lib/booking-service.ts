import type { Booking } from '@/lib/types';

/**
 * Utility functions for booking operations
 */

/**
 * Format booking date and time for display
 */
export function formatBookingDateTime(dateTimeStr: string): string {
  try {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateTimeStr;
  }
}

/**
 * Check if a booking is in the future
 */
export function isUpcomingBooking(booking: Booking): boolean {
  const bookingDate = new Date(booking.startTime);
  return bookingDate > new Date();
}

/**
 * Check if a booking is in the past
 */
export function isPastBooking(booking: Booking): boolean {
  const bookingDate = new Date(booking.startTime);
  return bookingDate < new Date();
}

/**
 * Get booking status label with styling
 */
export function getBookingStatusInfo(
  status: Booking['status']
): { label: string; color: string; bgColor: string } {
  const statusMap = {
    pending: {
      label: 'Pending',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    confirmed: {
      label: 'Confirmed',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    completed: {
      label: 'Completed',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    cancelled: {
      label: 'Cancelled',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  };

  return statusMap[status] || statusMap.pending;
}

/**
 * Calculate booking duration in readable format
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Validate booking data before submission
 */
export function validateBookingData(data: Partial<Booking>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.studentId) errors.push('Student ID is required');
  if (!data.mentorId) errors.push('Mentor ID is required');
  if (!data.startTime) errors.push('Start time is required');
  if (!data.endTime) errors.push('End time is required');
  if (!data.duration || data.duration <= 0) errors.push('Duration must be greater than 0');
  if (!data.totalPrice || data.totalPrice < 0) errors.push('Price cannot be negative');
  if (!data.topic) errors.push('Topic is required');
  if (!data.goal) errors.push('Goal is required');

  const bookingDate = new Date(data.startTime || '');
  if (bookingDate < new Date()) {
    errors.push('Booking date must be in the future');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate total price including any applicable fees
 */
export function calculateTotalPrice(basePrice: number, feePercentage: number = 10): number {
  const fee = (basePrice * feePercentage) / 100;
  return basePrice + fee;
}

/**
 * Check if a booking can be cancelled
 */
export function canCancelBooking(booking: Booking, hoursBeforeNotice: number = 24): boolean {
  if (booking.status === 'cancelled' || booking.status === 'completed') {
    return false;
  }

  const bookingDate = new Date(booking.startTime);
  const now = new Date();
  const hoursDifference = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  return hoursDifference >= hoursBeforeNotice;
}
