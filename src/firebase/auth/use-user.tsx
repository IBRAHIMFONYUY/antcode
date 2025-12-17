'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, onSnapshot, DocumentData } from 'firebase/firestore';
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
      // Firebase services are not ready, wait for the provider to initialize them.
      return;
    }

    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // User is logged in, set up a real-time listener for their profile.
        const userDocRef = doc(firestore, 'users', user.uid);
        
        const profileUnsubscribe = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userProfile = doc.data() as UserProfile;
            setProfile(userProfile);
            
            if (!userProfile.techCareer && !pathname.startsWith('/onboarding')) {
              router.push('/onboarding');
            }
          } else {
             // This can happen with social auth on first login.
             // The signup/onboarding flow will create the document.
             if (!pathname.startsWith('/onboarding') && !pathname.startsWith('/signup')) {
                router.push('/onboarding');
             }
          }
          setLoading(false);
        }, (error) => {
          // onSnapshot's error listener handles permission issues, etc.
          // It's less likely to be an "offline" error here, as listeners handle that.
          console.error("Firestore snapshot error:", error);
          setUser(null);
          setProfile(null);
          setLoading(false);
        });

        // Return the unsubscribe function for the profile listener
        return () => profileUnsubscribe();

      } else {
        // User is logged out
        setUser(null);
        setProfile(null);
        setLoading(false);
        if (!['/login', '/signup', '/', '/#about', '/#features', '/#faq', '/#why-choose-us'].includes(pathname) && !pathname.startsWith('/experts') && !pathname.startsWith('/courses')) {
             router.push('/login');
        }
      }
    }, (error) => {
      // Auth state error
      console.error('Auth state change error:', error);
      setLoading(false);
    });

    // Return the unsubscribe function for the auth listener
    return () => authUnsubscribe();

  }, [auth, firestore, router, pathname]);

  return { user, profile, loading };
}
