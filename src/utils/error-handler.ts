import { FirebaseError } from 'firebase/app';

export interface AppError {
  title: string;
  message: string;
  code?: string;
  originalError?: unknown;
}

/**
 * Handles Firebase and general errors with user-friendly messages
 */
export function handleError(error: unknown): AppError {
  if (error instanceof FirebaseError) {
    return handleFirebaseError(error);
  }

  if (error instanceof Error) {
    return {
      title: 'Error',
      message: error.message,
      originalError: error,
    };
  }

  return {
    title: 'Unknown Error',
    message: 'An unexpected error occurred. Please try again.',
    originalError: error,
  };
}

/**
 * Handles Firebase-specific errors with user-friendly messages
 */
function handleFirebaseError(error: FirebaseError): AppError {
  const errorMap: Record<string, { title: string; message: string }> = {
    'auth/user-not-found': {
      title: 'User Not Found',
      message: 'No account found with this email address.',
    },
    'auth/wrong-password': {
      title: 'Incorrect Password',
      message: 'The password you entered is incorrect.',
    },
    'auth/invalid-email': {
      title: 'Invalid Email',
      message: 'Please enter a valid email address.',
    },
    'auth/email-already-in-use': {
      title: 'Email Already in Use',
      message: 'An account with this email address already exists.',
    },
    'auth/weak-password': {
      title: 'Weak Password',
      message: 'Password must be at least 6 characters long.',
    },
    'auth/too-many-requests': {
      title: 'Too Many Attempts',
      message: 'Too many login attempts. Please try again later.',
    },
    'auth/account-exists-with-different-credential': {
      title: 'Account Exists',
      message: 'An account already exists with this email using a different sign-in method.',
    },
    'auth/popup-closed-by-user': {
      title: 'Sign-in Cancelled',
      message: 'You cancelled the sign-in process.',
    },
    'firestore/permission-denied': {
      title: 'Permission Denied',
      message: 'You do not have permission to perform this action.',
    },
    'firestore/not-found': {
      title: 'Not Found',
      message: 'The requested resource could not be found.',
    },
  };

  const errorInfo = errorMap[error.code];

  if (errorInfo) {
    return {
      title: errorInfo.title,
      message: errorInfo.message,
      code: error.code,
      originalError: error,
    };
  }

  return {
    title: 'Error',
    message: error.message || 'An error occurred. Please try again.',
    code: error.code,
    originalError: error,
  };
}

/**
 * Log error for debugging (can be extended to send to logging service)
 */
export function logError(error: AppError): void {
  console.error(`[${error.code || 'ERROR'}] ${error.title}:`, error.message);
  if (error.originalError) {
    console.error('Original error:', error.originalError);
  }
}
