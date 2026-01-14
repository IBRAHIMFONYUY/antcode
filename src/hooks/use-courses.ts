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
    if (!db || !courseId) return;
    setLoading(true);
    Promise.all([getCourseById(db, courseId), getTasksForCourse(db, courseId)])
      .then(([c, t]) => {
        setCourse(c);
        setTasks(t);
      })
      .catch(() => {
        setCourse(null);
        setTasks([]);
      })
      .finally(() => setLoading(false));
  }, [db, courseId]);

  return { course, tasks, loading };
}
