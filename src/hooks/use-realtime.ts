'use client';

import { useEffect, useState, useRef } from 'react';
import { useFirestore } from '@/firebase';
import {
  collection,
  query as fbQuery,
  where as fbWhere,
  orderBy as fbOrderBy,
  limit as fbLimit,
  onSnapshot,
  QueryConstraint,
} from 'firebase/firestore';

type Options = {
  orderBy?: { field: string; direction?: 'asc' | 'desc' };
  where?: { field: string; op: any; value: any }[];
  limit?: number;
};

export function useRealtimeCollection(path: string, opts?: Options) {
  const db = useFirestore();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const unsubRef = useRef<() => void | null>(null);

  useEffect(() => {
    if (!db) return;
    setLoading(true);
    const colRef = collection(db, path);
    const constraints: QueryConstraint[] = [];

    if (opts?.where) {
      for (const w of opts.where) {
        constraints.push(fbWhere(w.field as any, w.op as any, w.value));
      }
    }

    if (opts?.orderBy) {
      constraints.push(fbOrderBy(opts.orderBy.field, opts.orderBy.direction ?? 'desc'));
    }

    if (opts?.limit) {
      constraints.push(fbLimit(opts.limit));
    }

    const q = constraints.length > 0 ? fbQuery(colRef, ...constraints) : fbQuery(colRef);

    const unsub = onSnapshot(
      q,
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    unsubRef.current = unsub;

    return () => {
      unsubRef.current && unsubRef.current();
    };
  }, [db, path, JSON.stringify(opts || {})]);

  return { data, loading };
}
