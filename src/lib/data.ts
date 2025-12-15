import type { Expert, Course, Task, Session, FaqItem } from './types';
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

export const faqs: FaqItem[] = [
  {
    id: 'faq1',
    question: 'What is AntCodeHub?',
    answer: 'AntCodeHub is a mentorship platform that connects aspiring developers and tech professionals with experienced industry experts for 1-on-1 guidance, structured learning, and career growth.'
  },
  {
    id: 'faq2',
    question: 'Who are the mentors?',
    answer: 'Our mentors are senior-level engineers, architects, designers, and managers from top tech companies. They are vetted for their expertise, communication skills, and passion for mentorship.'
  },
  {
    id: 'faq3',
    question: 'How are mentors selected?',
    answer: 'We have a rigorous selection process that includes a technical review, a mock mentorship session, and a background check to ensure our mentors are highly qualified and effective.'
  },
  {
    id: 'faq4',
    question: 'What can I learn?',
    answer: 'You can learn a wide range of topics, from specific technologies like React and Python to broader skills like system design, cloud architecture, UI/UX principles, and career development.'
  },
  {
    id: 'faq5',
    question: 'How do mentorship sessions work?',
    answer: 'Sessions are conducted via video call directly on our platform. You can book a time that works for you, and you\'ll meet your mentor for a personalized session focused on your goals.'
  },
  {
    id: 'faq6',
    question: 'What are Learning Paths?',
    answer: 'Learning Paths are structured courses co-created with our expert mentors. They combine video lessons, real-world projects, and mentorship sessions to provide a comprehensive learning experience.'
  },
  {
    id: 'faq7',
    question: 'Can I get help with a specific project?',
    answer: 'Absolutely! Many users book sessions for code reviews, project architecture discussions, or to get un-stuck on a challenging problem.'
  },
  {
    id: 'faq8',
    question: 'How do I book a session?',
    answer: 'Simply find a mentor you\'d like to work with, view their profile, and select an available time slot from their calendar to book a session.'
  },
  {
    id: 'faq9',
    question: 'What is the cost of a session?',
    answer: 'Session prices are set by individual mentors and vary based on their experience and the session duration. You can see the price on each mentor\'s profile.'
  },
  {
    id: 'faq10',
    question: 'Can I reschedule a session?',
    answer: 'Yes, you can typically reschedule a session up to 24 hours in advance. Please check the specific mentor\'s cancellation policy on their profile.'
  },
  {
    id: 'faq11',
    question: 'What happens if I miss a session?',
    answer: 'Policies for missed sessions vary by mentor. We recommend communicating with your mentor as soon as you know you might miss a session. Some may allow rescheduling, while others may not offer a refund.'
  },
  {
    id: 'faq12',
    question: 'Is there a free trial?',
    answer: 'We do not offer a platform-wide free trial, but some mentors may offer a free 15-minute introductory call. Check individual mentor profiles for availability.'
  },
  {
    id: 'faq13',
    question: 'How is AntCodeHub different from online courses?',
    answer: 'While we offer structured courses, our core focus is on personalized, 1-on-1 mentorship. This direct interaction with experts provides tailored guidance that pre-recorded videos cannot.'
  },
  {
    id: 'faq14',
    question: 'I\'m a beginner, is this for me?',
    answer: 'Yes! We have mentors who specialize in helping beginners navigate the early stages of their tech careers. A mentor can provide a roadmap and help you avoid common pitfalls.'
  },
  {
    id: 'faq15',
    question: 'I\'m an experienced developer, how can I benefit?',
    answer: 'Experienced developers use AntCodeHub to prepare for senior-level interviews, learn a new specialization, get advice on team leadership, or discuss complex architectural challenges with peers.'
  },
  {
    id: 'faq16',
    question: 'Can I become a mentor?',
    answer: 'We are always looking for passionate experts to join our community. If you have significant industry experience and a desire to help others grow, you can apply to become a mentor through our "For Mentors" page.'
  },
  {
    id: 'faq17',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, including Visa, MasterCard, and American Express, processed securely through Stripe.'
  },
  {
    id: 'faq18',
    question: 'How do I know if a mentor is right for me?',
    answer: 'Read their profiles, check their expertise and reviews from other users. Many mentors also have an introduction video or offer a short introductory call to help you decide.'
  },
  {
    id: 'faq19',
    question: 'What is the AI Task Review feature?',
    answer: 'Our AI-powered assistant helps mentors provide faster, more consistent feedback on your project submissions. It identifies potential knowledge gaps and suggests areas for improvement, which the mentor then reviews and refines.'
  },
  {
    id: 'faq20',
    question: 'Do you offer team or corporate plans?',
    answer: 'Yes, we offer plans for teams and businesses looking to upskill their employees. Please contact our sales team for more information on corporate packages.'
  }
];
