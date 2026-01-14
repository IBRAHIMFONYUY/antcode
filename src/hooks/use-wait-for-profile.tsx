"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';

type Options = {
  /** If true, consider profile ready only when `profile.techCareer` exists. */
  requireTechCareer?: boolean;
  /** Timeout in milliseconds to wait for profile before marking timed out. 0 = disabled */
  timeoutMs?: number;
};

/**
 * Hook that waits for the authenticated user's profile to be available in `useUser`.
 * Returns readiness state and a timed-out flag so callers can react (e.g. show toast).
 */
export function useWaitForProfile(options: Options = {}) {
  const { requireTechCareer = false, timeoutMs = 8000 } = options;
  const { user, profile, loading } = useUser();

  const [ready, setReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    // Reset when user changes
    setReady(false);
    setTimedOut(false);
  }, [user?.uid]);

  useEffect(() => {
    if (!user) return;

    // If useUser is still loading, wait
    if (loading) return;

    if (!profile) {
      // profile not yet available
      return;
    }

    if (requireTechCareer) {
      if (profile.techCareer) setReady(true);
    } else {
      setReady(true);
    }
  }, [user, profile, loading, requireTechCareer]);

  useEffect(() => {
    if (!user) return;
    if (ready) return;
    if (!timeoutMs || timeoutMs <= 0) return;

    const t = setTimeout(() => setTimedOut(true), timeoutMs);
    return () => clearTimeout(t);
  }, [user, ready, timeoutMs]);

  return { user, profile, loading, ready, timedOut } as const;
}
