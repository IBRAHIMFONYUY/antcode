import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
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
let persistenceEnabled = false;

function getFirebaseServices() {
  const app = initializeFirebase();
  if (services.has(app)) {
    return services.get(app);
  }

  const auth = getAuth(app);
  const firestore = getFirestore(app);

  if (!persistenceEnabled) {
    enableIndexedDbPersistence(firestore).catch((err) => {
      if (err.code == 'failed-precondition') {
        console.warn('Firestore persistence failed: Multiple tabs open');
      } else if (err.code == 'unimplemented') {
        console.warn('Firestore persistence failed: Browser does not support it.');
      }
    });
    persistenceEnabled = true;
  }
  

  const newServices = { app, auth, firestore };
  services.set(app, newServices);
  return newServices;
}


export {
  FirebaseProvider,
  FirebaseClientProvider,
} from './provider';

export { useUser } from './auth/use-user';
export {
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
} from './provider';

export { getFirebaseServices };
