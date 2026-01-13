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
import type { ExpertAvailabilitySlot } from '@/lib/types';
import { handleError, logError } from '@/utils/error-handler';

export function useExpertAvailability() {
  const firestore = useFirestore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Add an availability slot for an expert
   */
  const addAvailabilitySlot = useCallback(
    async (slotData: Omit<ExpertAvailabilitySlot, 'id' | 'createdAt'>) => {
      if (!firestore) {
        setError('Firestore not initialized');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const slotsRef = collection(
          firestore,
          'expertAvailability',
          slotData.expertId,
          'slots'
        );
        const docRef = await addDoc(slotsRef, {
          ...slotData,
          isBooked: slotData.isBooked || false,
          createdAt: serverTimestamp(),
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
   * Get all available slots for an expert
   */
  const getAvailableSlots = useCallback(
    async (expertId: string): Promise<ExpertAvailabilitySlot[]> => {
      if (!firestore) {
        setError('Firestore not initialized');
        return [];
      }

      setLoading(true);
      setError(null);

      try {
        const q = query(
          collection(firestore, 'expertAvailability', expertId, 'slots'),
          where('isBooked', '==', false)
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as ExpertAvailabilitySlot));
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
   * Get all slots (available and booked) for an expert
   */
  const getAllSlots = useCallback(
    async (expertId: string): Promise<ExpertAvailabilitySlot[]> => {
      if (!firestore) {
        setError('Firestore not initialized');
        return [];
      }

      setLoading(true);
      setError(null);

      try {
        const snapshot = await getDocs(
          collection(firestore, 'expertAvailability', expertId, 'slots')
        );

        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as ExpertAvailabilitySlot));
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
   * Mark a slot as booked
   */
  const bookSlot = useCallback(
    async (expertId: string, slotId: string, bookingId: string): Promise<boolean> => {
      if (!firestore) {
        setError('Firestore not initialized');
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const slotRef = doc(
          firestore,
          'expertAvailability',
          expertId,
          'slots',
          slotId
        );
        await updateDoc(slotRef, {
          isBooked: true,
          bookingId,
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
   * Mark a slot as available again
   */
  const releaseSlot = useCallback(
    async (expertId: string, slotId: string): Promise<boolean> => {
      if (!firestore) {
        setError('Firestore not initialized');
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const slotRef = doc(
          firestore,
          'expertAvailability',
          expertId,
          'slots',
          slotId
        );
        await updateDoc(slotRef, {
          isBooked: false,
          bookingId: undefined,
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
   * Delete an availability slot
   */
  const deleteSlot = useCallback(
    async (expertId: string, slotId: string): Promise<boolean> => {
      if (!firestore) {
        setError('Firestore not initialized');
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const slotRef = doc(
          firestore,
          'expertAvailability',
          expertId,
          'slots',
          slotId
        );
        await deleteDoc(slotRef);
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
    addAvailabilitySlot,
    getAvailableSlots,
    getAllSlots,
    bookSlot,
    releaseSlot,
    deleteSlot,
  };
}
