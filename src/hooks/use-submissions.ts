'use client';

import { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export function useSubmissions(mentorId?: string) {
  const db = useFirestore();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;
    setLoading(true);
    let q;
    if (mentorId) {
      q = query(collection(db, 'taskSubmissions'), where('mentorId', '==', mentorId), orderBy('submittedAt', 'desc'));
    } else {
      q = query(collection(db, 'taskSubmissions'), orderBy('submittedAt', 'desc'));
    }
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      setSubmissions(items);
      setLoading(false);
    }, () => setLoading(false));

    return () => unsub();
  }, [db, mentorId]);

  return { submissions, loading };
}
