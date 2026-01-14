import { collection, doc, getDoc, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { Course, StudentTask } from '@/lib/types';

export async function getAllCourses(db: Firestore): Promise<Course[]> {
  const col = collection(db, 'courses');
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Course));
}

export async function getCourseById(db: Firestore, courseId: string): Promise<Course | null> {
  const ref = doc(db, 'courses', courseId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as any) } as Course;
}

export async function getTasksForCourse(db: Firestore, courseId: string): Promise<StudentTask[]> {
  const col = collection(db, 'courseTasks');
  const q = query(col, where('courseId', '==', courseId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as StudentTask));
}

export async function submitReport(db: Firestore, payload: any) {
  const col = collection(db, 'reports');
  const res = await addDoc(col, payload);
  return res.id;
}

export async function submitQuestion(db: Firestore, payload: any) {
  const col = collection(db, 'questions');
  const res = await addDoc(col, payload);
  return res.id;
}
