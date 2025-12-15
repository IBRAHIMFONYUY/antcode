'use client';

import { ReactNode } from 'react';
import { getFirebaseServices } from './index';
import { FirebaseProvider } from './provider';

// This provider is a client component, which means it will only run on the browser.
// It is used to initialize Firebase on the client-side and provide the
// instances to the rest of the application.
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  // By calling getFirebaseServices() here, we ensure that Firebase is initialized
  // only once on the client and that the same instances are reused.
  const services = getFirebaseServices();

  return <FirebaseProvider {...services}>{children}</FirebaseProvider>;
}
