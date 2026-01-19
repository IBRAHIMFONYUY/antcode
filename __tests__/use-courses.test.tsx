import { renderHook, act } from '@testing-library/react';
import { useCourses } from '@/hooks/use-courses';

// Note: These tests assume a test environment with Firestore mocks available.
// They serve as placeholders and examples for CI when Firestore is mocked.

describe('useCourses hook', () => {
  it('initializes with empty courses if Firestore unavailable', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useCourses());
    expect(result.current.loading).toBe(false);
    // Without Firestore mock, courses should be an array
    expect(Array.isArray(result.current.courses)).toBe(true);
  });
});
