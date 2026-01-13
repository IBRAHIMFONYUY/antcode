import type { LucideIcon } from "lucide-react";

export type Expert = {
  id: string;
  name: string;
  role: string;
  company: string;
  expertise: string[];
  about: string;
  imageUrl: string;
  rating: number;
  reviews: number;
  session: {
    duration: number; // in minutes
    price: number;
  };
};

export type Course = {
  id: string;
  title: string;
  description: string;
  progress: number;
  tasksCompleted: number;
  totalTasks: number;
};

export type Task = {
    id: string;
    title: string;
    course: string;
    status: 'Pending' | 'Submitted' | 'Reviewed';
    dueDate: string;
};

export type Session = {
    id: string;
    mentor: Pick<Expert, "name" | "imageUrl">;
    dateTime: string;
    duration: number; // in minutes
    status: 'Upcoming' | 'Completed' | 'Canceled';
}

export type NavItem = {
    href: string;
    title: string;
    icon: LucideIcon;
    label?: string;
};

export type FaqItem = {
    id: string;
    question: string;
    answer: string;
}

export type Mentor = {
    id: string;
    name: string;
    role: string;
    imageUrl: string;
};

export type UpcomingCourse = {
    id: string;
    title: string;
    date: string;
    time: string;
    attendees: string[];
    icon: LucideIcon;
};

// Booking System Types
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type Booking = {
    id: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    mentorId: string;
    mentorName: string;
    mentorImageUrl: string;
    startTime: string; // ISO string
    endTime: string; // ISO string
    duration: number; // in minutes
    totalPrice: number;
    topic: string;
    goal: string;
    status: BookingStatus;
    notes?: string;
    createdAt: Date | { seconds: number; nanoseconds: number };
    updatedAt: Date | { seconds: number; nanoseconds: number };
};

export type ExpertAvailabilitySlot = {
    id: string;
    expertId: string;
    date: string; // YYYY-MM-DD format
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    isBooked: boolean;
    bookingId?: string;
    createdAt: Date | { seconds: number; nanoseconds: number };
};

export type ExpertAvailability = {
    expertId: string;
    slots: ExpertAvailabilitySlot[];
};

// Task and Task Review Types
export type TaskStatus = 'pending' | 'submitted' | 'under-review' | 'reviewed' | 'completed';

export type StudentTask = {
    id: string;
    courseId: string;
    title: string;
    description: string;
    dueDate: string; // ISO string
    status: TaskStatus;
    studentId: string;
    studentName: string;
    createdAt: Date | { seconds: number; nanoseconds: number };
    updatedAt: Date | { seconds: number; nanoseconds: number };
};

export type TaskSubmission = {
    id: string;
    taskId: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    submissionText: string;
    submissionCode?: string;
    fileUrl?: string;
    submittedAt: Date | { seconds: number; nanoseconds: number };
    status: 'pending' | 'submitted' | 'reviewed';
};

export type TaskReview = {
    id: string;
    submissionId: string;
    taskId: string;
    mentorId: string;
    mentorName: string;
    studentId: string;
    knowledgeGaps: string;
    targetedFeedback: string;
    overallAssessment: string;
    rating: number; // 1-5 scale
    isPeerReviewed?: boolean;
    reviewedAt: Date | { seconds: number; nanoseconds: number };
    createdAt: Date | { seconds: number; nanoseconds: number };
};

