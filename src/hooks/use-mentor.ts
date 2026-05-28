'use client';

import { useUser } from '@/firebase';
import type { UserProfile } from '@/firebase/auth/use-user';

export function useMentor() {
  const { user, profile, loading } = useUser();

  const isMentor = profile?.role === 'mentor';
  const isStudent = profile?.role === 'student';
  const isAdmin = profile?.role === 'admin';

  const mentorData = isMentor
    ? {
        expertise: profile?.expertise || [],
        hourlyRate: profile?.hourlyRate || 0,
        availability: profile?.availability || {},
        totalStudents: profile?.totalStudents || 0,
        totalSessions: profile?.totalSessions || 0,
        rating: profile?.rating || 0,
        reviews: profile?.reviews || 0,
      }
    : null;

  return {
    user,
    profile,
    loading,
    isMentor,
    isStudent,
    isAdmin,
    mentorData,
  };
}
