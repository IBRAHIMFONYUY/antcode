/**
 * Convert Firestore timestamp to Date
 */
export function toDate(
  timestamp: Date | { seconds: number; nanoseconds: number } | undefined
): Date {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  if ('seconds' in timestamp) {
    return new Date(timestamp.seconds * 1000);
  }
  return new Date();
}

/**
 * Format a date string for display
 */
export function formatDateString(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format a timestamp for display
 */
export function formatTimestamp(
  timestamp: Date | { seconds: number; nanoseconds: number }
): string {
  return toDate(timestamp).toLocaleDateString();
}

/**
 * Format time portion of a timestamp
 */
export function formatTime(
  timestamp: Date | { seconds: number; nanoseconds: number }
): string {
  return toDate(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}
