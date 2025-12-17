'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';
import { usePathname, useRouter } from 'next/navigation';

export type UserProfile = {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'student' | 'mentor';
  techCareer?: string;
  createdAt: Date;
  bio?: string;
};


export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Start loading and wait for Firebase services to be available.
    setLoading(true);

    if (!auth || !firestore) {
      // If Firebase services are not ready, we wait.
      // The effect will re-run when the provider initializes them.
      // We shouldn't redirect here, as it might be a temporary state.
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          setUser(user);
          try {
            const userDocRef = doc(firestore, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const userProfile = userDoc.data() as UserProfile;
              setProfile(userProfile);
              // Redirect to onboarding if techCareer is missing, but not if we're already there.
              if (!userProfile.techCareer && !pathname.startsWith('/onboarding')) {
                router.push('/onboarding');
              }
            } else {
              // This can happen with social auth on first login.
              // Redirect to a page that will create the user document.
              if (!pathname.startsWith('/onboarding') && !pathname.startsWith('/signup')) {
                router.push('/onboarding');
              }
            }
          } catch (error: any) {
             // This is where the 'client is offline' error would be caught.
             // We'll log it and let the loading state continue,
             // hoping persistence or reconnection will resolve it.
            console.error('Firestore fetch error:', error);
            if (error.code === 'unavailable') { // More specific check for offline error
                // Don't set user to null, just wait for network.
                // The app will show a loader.
                return;
            }
          }
        } else {
          setUser(null);
          setProfile(null);
          // Only redirect if on a protected route.
           if (!['/login', '/signup', '/'].includes(pathname) && !pathname.startsWith('/experts') && !pathname.startsWith('/courses')) {
             router.push('/login');
           }
        }
        setLoading(false);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth, firestore, router, pathname]);

  return { user, profile, loading };
}
