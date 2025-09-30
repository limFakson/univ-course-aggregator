import { Course } from '@/types/course';

export const sampleCourses: Course[] = [
  {
    id: '1',
    title: 'Computer Science Fundamentals',
    university: 'Massachusetts Institute of Technology',
    duration: '16 weeks',
    location: 'Cambridge, MA',
    fees: '$4,500',
    description: 'A comprehensive introduction to computer science covering algorithms, data structures, and programming fundamentals. This course provides a solid foundation for advanced computer science studies.',
    requirements: ['High school mathematics', 'Basic logical reasoning skills'],
    schedule: 'Monday, Wednesday, Friday 10:00-11:30 AM',
    instructor: 'Dr. Sarah Chen',
    credits: 4
  },
  {
    id: '2',
    title: 'Advanced Calculus and Linear Algebra',
    university: 'Stanford University',
    duration: '12 weeks',
    location: 'Stanford, CA',
    fees: '$3,800',
    description: 'Advanced mathematical concepts including multivariable calculus, linear transformations, and matrix theory. Essential for students pursuing engineering or mathematics.',
    requirements: ['Calculus I and II', 'Basic linear algebra knowledge'],
    schedule: 'Tuesday, Thursday 2:00-3:30 PM',
    instructor: 'Prof. Michael Rodriguez',
    credits: 3
  },
  {
    id: '3',
    title: 'Business Strategy and Management',
    university: 'Harvard University',
    duration: '8 weeks',
    location: 'Cambridge, MA',
    fees: '$5,200',
    description: 'Strategic thinking and management principles for modern business environments. Covers competitive analysis, organizational behavior, and leadership.',
    requirements: ['Business fundamentals', 'Two years work experience recommended'],
    schedule: 'Saturdays 9:00 AM-4:00 PM',
    instructor: 'Dr. Jennifer Walsh',
    credits: 2
  },
  {
    id: '4',
    title: 'Data Science and Analytics',
    university: 'University of California, Berkeley',
    duration: '14 weeks',
    location: 'Berkeley, CA',
    fees: '$4,100',
    description: 'Comprehensive data science curriculum covering statistical analysis, machine learning basics, and data visualization techniques using Python and R.',
    requirements: ['Statistics background', 'Programming experience helpful'],
    schedule: 'Monday, Wednesday 6:00-8:00 PM',
    instructor: 'Dr. Kevin Park',
    credits: 4
  },
  {
    id: '5',
    title: 'Constitutional Law',
    university: 'Yale University',
    duration: '15 weeks',
    location: 'New Haven, CT',
    fees: '$4,800',
    description: 'Study of constitutional principles, judicial review, and constitutional interpretation. Examines landmark Supreme Court cases and constitutional theory.',
    requirements: ['Introduction to law', 'Political science background recommended'],
    schedule: 'Tuesday, Thursday 1:00-2:30 PM',
    instructor: 'Prof. Elizabeth Turner',
    credits: 3
  },
  {
    id: '6',
    title: 'Organic Chemistry',
    university: 'Columbia University',
    duration: '16 weeks',
    location: 'New York, NY',
    fees: '$4,300',
    description: 'Comprehensive study of organic compounds, reaction mechanisms, and synthesis. Includes laboratory work and practical applications in pharmaceutical chemistry.',
    requirements: ['General chemistry', 'Basic physics'],
    schedule: 'Monday, Wednesday, Friday 11:00 AM-12:30 PM + Lab',
    instructor: 'Dr. Robert Kim',
    credits: 5
  },
  {
    id: '7',
    title: 'International Economics',
    university: 'University of Chicago',
    duration: '12 weeks',
    location: 'Chicago, IL',
    fees: '$3,900',
    description: 'Analysis of international trade, monetary systems, and global economic policies. Covers exchange rates, trade agreements, and economic development.',
    requirements: ['Microeconomics', 'Macroeconomics'],
    schedule: 'Tuesday, Thursday 3:30-5:00 PM',
    instructor: 'Prof. Maria Gonzalez',
    credits: 3
  },
  {
    id: '8',
    title: 'Digital Marketing Strategy',
    university: 'University of Pennsylvania',
    duration: '10 weeks',
    location: 'Philadelphia, PA',
    fees: '$3,600',
    description: 'Modern digital marketing techniques including social media strategy, content marketing, SEO, and analytics. Practical approach with real-world projects.',
    requirements: ['Marketing fundamentals', 'Basic computer skills'],
    schedule: 'Weekends: Saturday 10:00 AM-2:00 PM',
    instructor: 'Dr. Amanda Foster',
    credits: 2
  }
];