'use client';

import { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export function useQuestions() {
  const db = useFirestore();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    setLoading(true);
    const q = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      setQuestions(items);
      setLoading(false);
    }, () => {
      setLoading(false);
    });

    return () => unsub();
  }, [db]);

  return { questions, loading };
}
