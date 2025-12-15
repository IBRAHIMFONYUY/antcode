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
    if (!auth || !firestore) {
      if (!auth && !pathname.startsWith('/login') && !pathname.startsWith('/signup')) {
        // router.push('/login');
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        setLoading(true);
        if (user) {
          setUser(user);
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
             const userProfile = userDoc.data() as UserProfile;
             setProfile(userProfile);
            // Redirect to onboarding if techCareer is missing
            if (!userProfile.techCareer && !pathname.startsWith('/onboarding')) {
              router.push('/onboarding');
            }
          } else {
            // This case might happen for Google sign-in before the doc is created.
            // Redirecting to onboarding which handles doc creation.
            if (!pathname.startsWith('/onboarding') && !pathname.startsWith('/signup')) {
               router.push('/onboarding');
            }
          }
        } else {
          setUser(null);
          setProfile(null);
          // Only redirect if not on a public page
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
