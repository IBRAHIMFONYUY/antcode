'use client';

import { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase';
import type { Course, StudentTask } from '@/lib/types';
import { getAllCourses, getCourseById, getTasksForCourse } from '@/lib/course-service';

export function useCourses() {
  const db = useFirestore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!db) return;
    setLoading(true);
    getAllCourses(db)
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [db]);

  return { courses, loading };
}

export function useCourse(courseId: string | null) {
  const db = useFirestore();
  const [course, setCourse] = useState<Course | null>(null);
  const [tasks, setTasks] = useState<StudentTask[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!db || !courseId) {
      console.log('[useCourse] Missing db or courseId:', { db: !!db, courseId });
      return;
    }
    
    setLoading(true);
    console.log('[useCourse] Loading course:', courseId);
    
    Promise.all([getCourseById(db, courseId), getTasksForCourse(db, courseId)])
      .then(([c, t]) => {
        console.log('[useCourse] Data loaded:', { course: c?.id, tasksCount: t.length });
        setCourse(c);
        setTasks(t);
      })
      .catch((err) => {
        console.error('[useCourse] Error loading:', err);
        setCourse(null);
        setTasks([]);
      })
      .finally(() => setLoading(false));
  }, [db, courseId]);

  return { course, tasks, loading };
}
