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
