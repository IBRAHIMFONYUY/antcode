'use client';

import { useState, useCallback } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { Booking, BookingStatus } from '@/lib/types';
import { handleError, logError } from '@/utils/error-handler';

export function useBookings() {
  const firestore = useFirestore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create a new booking
   */
  const createBooking = useCallback(
    async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!firestore) {
        setError('Firestore not initialized');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const bookingsRef = collection(firestore, 'bookings');
        const docRef = await addDoc(bookingsRef, {
          ...bookingData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        return docRef.id;
      } catch (err) {
        const appError = handleError(err);
        logError(appError);
        setError(appError.message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [firestore]
  );

  /**
   * Get all bookings for a student
   */
  const getStudentBookings = useCallback(
    async (studentId: string): Promise<Booking[]> => {
      if (!firestore) {
        setError('Firestore not initialized');
        return [];
      }

      setLoading(true);
      setError(null);

      try {
        const q = query(
          collection(firestore, 'bookings'),
          where('studentId', '==', studentId)
        );
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Booking));
      } catch (err) {
        const appError = handleError(err);
        logError(appError);
        setError(appError.message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [firestore]
  );

  /**
   * Get all bookings for a mentor
   */
  const getMentorBookings = useCallback(
    async (mentorId: string): Promise<Booking[]> => {
      if (!firestore) {
        setError('Firestore not initialized');
        return [];
      }

      setLoading(true);
      setError(null);

      try {
        const q = query(
          collection(firestore, 'bookings'),
          where('mentorId', '==', mentorId)
        );
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Booking));
      } catch (err) {
        const appError = handleError(err);
        logError(appError);
        setError(appError.message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [firestore]
  );

  /**
   * Update booking status
   */
  const updateBookingStatus = useCallback(
    async (bookingId: string, status: BookingStatus): Promise<boolean> => {
      if (!firestore) {
        setError('Firestore not initialized');
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const bookingRef = doc(firestore, 'bookings', bookingId);
        await updateDoc(bookingRef, {
          status,
          updatedAt: serverTimestamp(),
        });
        return true;
      } catch (err) {
        const appError = handleError(err);
        logError(appError);
        setError(appError.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [firestore]
  );

  /**
   * Cancel a booking
   */
  const cancelBooking = useCallback(
    async (bookingId: string): Promise<boolean> => {
      return updateBookingStatus(bookingId, 'cancelled');
    },
    [updateBookingStatus]
  );

  /**
   * Delete a booking
   */
  const deleteBooking = useCallback(
    async (bookingId: string): Promise<boolean> => {
      if (!firestore) {
        setError('Firestore not initialized');
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const bookingRef = doc(firestore, 'bookings', bookingId);
        await deleteDoc(bookingRef);
        return true;
      } catch (err) {
        const appError = handleError(err);
        logError(appError);
        setError(appError.message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [firestore]
  );

  return {
    loading,
    error,
    createBooking,
    getStudentBookings,
    getMentorBookings,
    updateBookingStatus,
    cancelBooking,
    deleteBooking,
  };
}
