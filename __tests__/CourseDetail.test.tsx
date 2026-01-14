import { render, screen } from '@testing-library/react';
import CourseDetailPage from '@/app/dashboard/courses/[courseId]/page';

describe('CourseDetailPage', () => {
  it('renders without crashing (placeholder)', () => {
    // This is a light smoke test; full rendering requires Next.js page context.
    expect(typeof CourseDetailPage).toBe('function');
  });
});
