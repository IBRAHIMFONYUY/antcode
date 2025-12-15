import type { Expert, Course, Task, Session } from './types';
import { PlaceHolderImages } from './placeholder-images';

function getImageUrl(id: string) {
    return PlaceHolderImages.find(img => img.id === id)?.imageUrl ?? "https://picsum.photos/seed/placeholder/200/200";
}

export const experts: Expert[] = [
  {
    id: '1',
    name: 'IBRAHIM FONYUY',
    role: 'Staff Engineer',
    company: 'Innovate Inc.',
    expertise: ['React', 'TypeScript', 'Node.js', 'Web Performance'],
    about: 'Ibrahim is a seasoned engineer with a passion for building scalable and performant web applications. He loves mentoring and helping developers grow.',
    imageUrl: getImageUrl('expert-1'),
    rating: 4.9,
    reviews: 120,
    session: { duration: 60, price: 150 },
  },
  {
    id: '2',
    name: 'YONDO JONES',
    role: 'Principal Architect',
    company: 'CloudFlow',
    expertise: ['AWS', 'Serverless', 'DevOps', 'Microservices'],
    about: 'Yondo is a cloud expert who specializes in designing robust and scalable cloud-native architectures on AWS. He enjoys solving complex infrastructure challenges.',
    imageUrl: getImageUrl('expert-2'),
    rating: 4.8,
    reviews: 95,
    session: { duration: 60, price: 200 },
  },
  {
    id: '3',
    name: 'ABARA SPENCER',
    role: 'UX Lead',
    company: 'DesignFirst',
    expertise: ['UI/UX', 'Figma', 'User Research', 'Design Systems'],
    about: 'Abara is a creative and user-centric UX leader who believes in crafting intuitive and beautiful digital experiences. She has a keen eye for detail.',
    imageUrl: getImageUrl('expert-3'),
    rating: 5.0,
    reviews: 210,
    session: { duration: 45, price: 120 },
  },
  {
    id: '4',
    name: 'MOFIRO JEAN',
    role: 'AI/ML Scientist',
    company: 'DataMind AI',
    expertise: ['Python', 'TensorFlow', 'NLP', 'Computer Vision'],
    about: 'Mofiro is an AI researcher dedicated to pushing the boundaries of machine learning. He is passionate about applying AI to solve real-world problems.',
    imageUrl: getImageUrl('expert-4'),
    rating: 4.9,
    reviews: 78,
    session: { duration: 60, price: 180 },
  },
    {
    id: '5',
    name: 'YUMBI LEO',
    role: 'Senior Frontend Dev',
    company: 'WebWeave',
    expertise: ['Vue.js', 'GraphQL', 'Animations', 'Frontend Architecture'],
    about: 'Yumbi is a frontend wizard who loves creating silky-smooth user interfaces with modern technologies. He is an advocate for clean and maintainable code.',
    imageUrl: getImageUrl('expert-5'),
    rating: 4.7,
    reviews: 88,
    session: { duration: 60, price: 130 },
  },
  {
    id: '6',
    name: 'SOH TALLA ERICK',
    role: 'Cybersecurity Expert',
    company: 'SecureNet',
    expertise: ['Penetration Testing', 'Network Security', 'Ethical Hacking'],
    about: 'Soh is a cybersecurity professional with a knack for finding vulnerabilities before the bad guys do. He is committed to making the digital world a safer place.',
    imageUrl: getImageUrl('expert-6'),
    rating: 4.8,
    reviews: 65,
    session: { duration: 90, price: 250 },
  },
];

export const courses: Course[] = [
    { id: 'c1', title: 'Advanced React Patterns', description: 'Master reusable components and state management.', progress: 75, tasksCompleted: 9, totalTasks: 12 },
    { id: 'c2', title: 'Cloud-Native DevOps', description: 'Build and deploy scalable applications with CI/CD.', progress: 40, tasksCompleted: 4, totalTasks: 10 },
    { id: 'c3', title: 'UI/UX for Developers', description: 'Learn design principles to build beautiful interfaces.', progress: 10, tasksCompleted: 1, totalTasks: 10 },
];

export const tasks: Task[] = [
    { id: 't1', title: 'Create a custom hook for data fetching', course: 'Advanced React Patterns', status: 'Reviewed', dueDate: '2024-07-20' },
    { id: 't2', title: 'Set up a CI/CD pipeline with GitHub Actions', course: 'Cloud-Native DevOps', status: 'Submitted', dueDate: '2024-07-25' },
    { id: 't3', title: 'Design a login form in Figma', course: 'UI/UX for Developers', status: 'Pending', dueDate: '2024-07-28' },
    { id: 't4', title: 'Implement component composition pattern', course: 'Advanced React Patterns', status: 'Pending', dueDate: '2024-08-02' },
];

export const sessions: Session[] = [
    { id: 's1', mentor: { name: 'IBRAHIM FONYUY', imageUrl: getImageUrl('expert-1') }, dateTime: '2024-08-05T14:00:00Z', duration: 60, status: 'Upcoming' },
    { id: 's2', mentor: { name: 'YONDO JONES', imageUrl: getImageUrl('expert-2') }, dateTime: '2024-07-15T10:00:00Z', duration: 60, status: 'Completed' },
    { id: 's3', mentor: { name: 'ABARA SPENCER', imageUrl: getImageUrl('expert-3') }, dateTime: '2024-08-10T11:00:00Z', duration: 45, status: 'Upcoming' },
];
