'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot, type DocumentData } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';
import { usePathname, useRouter } from 'next/navigation';

export type UserProfile = {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'student' | 'mentor';
  techCareer?: string;
  createdAt: any; // Can be Date or serverTimestamp
  updatedAt?: any;
  bio?: string;
  phoneNumber?: string;
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
      // Firebase services not yet available.
      return;
    }

    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const userDocRef = doc(firestore, 'users', user.uid);
        
        const profileUnsubscribe = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userProfile = doc.data() as UserProfile;
            setProfile(userProfile);
            
            // If user is on a public page but hasn't finished onboarding, redirect them.
            if (!userProfile.techCareer && !pathname.startsWith('/onboarding')) {
              router.push('/onboarding');
            }
          } else {
             // This can happen if the doc isn't created yet (e.g., social auth).
             // Redirect to onboarding to complete profile.
             if (!pathname.startsWith('/onboarding') && !pathname.startsWith('/signup')) {
                router.push('/onboarding');
             }
          }
          setLoading(false);
        }, (error) => {
          console.error("Firestore snapshot error:", error);
           if (error.code === 'unavailable') {
              // This can happen in multi-tab scenarios. It's a temporary state.
              // We don't want to log out the user, just wait for Firestore to recover.
              console.warn("Firestore is temporarily unavailable. Waiting for connection...");
              // State remains loading.
            } else {
              // A more serious error occurred.
              setUser(null);
              setProfile(null);
              setLoading(false);
            }
        });

        // Cleanup profile listener on auth state change.
        return () => profileUnsubscribe();

      } else {
        // User is logged out
        setUser(null);
        setProfile(null);
        setLoading(false);
        
        // Define public routes that don't require authentication
        const publicRoutes = ['/login', '/signup', '/', '/#about', '/#features', '/#faq', '/#why-choose-us'];
        const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/experts') || pathname.startsWith('/courses');
        
        if (!isPublicRoute) {
             router.push('/login');
        }
      }
    }, (error) => {
      // Auth state change error
      console.error('Auth state change error:', error);
      setLoading(false);
    });

    // Cleanup auth listener on component unmount
    return () => authUnsubscribe();

  }, [auth, firestore, router, pathname]);

  return { user, profile, loading };
}
