import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  type Firestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { firebaseConfig } from './config';

// The infamous "Firebase has already been initialized" error is avoided
// by checking if there are any apps already initialized.
// This is a common problem in Next.js because of server-side rendering.
function initializeFirebase() {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }
  return initializeApp(firebaseConfig);
}

// We store the instances in a memoized object to avoid re-creating them on every render.
const services = new Map();

function getFirebaseServices() {
  const app = initializeFirebase();
  if (services.has(app)) {
    return services.get(app);
  }

  const auth = getAuth(app);
  let firestore: Firestore;

  if (typeof window !== 'undefined') {
    // For the client, initialize Firestore with multi-tab persistence.
    firestore = initializeFirestore(app, {
      cache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    });
  } else {
    // For the server, initialize Firestore without persistence.
    firestore = getFirestore(app);
  }

  const newServices = { app, auth, firestore };
  services.set(app, newServices);
  return newServices;
}


export {
  FirebaseProvider,
} from './provider';

export { FirebaseClientProvider } from './client-provider';

export { useUser } from './auth/use-user';
export {
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
} from './provider';

export { getFirebaseServices };
