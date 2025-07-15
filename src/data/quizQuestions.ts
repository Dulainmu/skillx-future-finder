export interface QuizQuestion {
  id: number;
  question: string;
  category: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What motivates you most in a job?",
    category: "motivation"
  },
  {
    id: 2,
    question: "How do you prefer to work with others?",
    category: "teamwork"
  },
  {
    id: 3,
    question: "How important is work-life balance to you?",
    category: "lifestyle"
  },
  {
    id: 4,
    question: "Do you enjoy taking on leadership roles?",
    category: "leadership"
  },
  {
    id: 5,
    question: "How comfortable are you with taking risks?",
    category: "risk-tolerance"
  },
  {
    id: 6,
    question: "Do you prefer working with data and numbers?",
    category: "analytical"
  },
  {
    id: 7,
    question: "How important is creativity in your work?",
    category: "creativity"
  },
  {
    id: 8,
    question: "Do you enjoy helping and mentoring others?",
    category: "helping"
  },
  {
    id: 9,
    question: "How do you handle stressful situations?",
    category: "stress-management"
  },
  {
    id: 10,
    question: "Do you prefer routine or variety in your work?",
    category: "work-style"
  },
  {
    id: 11,
    question: "How important is job security to you?",
    category: "security"
  },
  {
    id: 12,
    question: "Do you enjoy continuous learning and development?",
    category: "growth"
  }
];

export interface QuizAnswer {
  questionId: number;
  score: number;
}

export interface QuizSubmission {
  answers: QuizAnswer[];
  timestamp: string;
}