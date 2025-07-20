const mongoose = require('mongoose');
const Career = require('../models/Career');
const Quiz = require('../models/Quiz');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillx_db');
    console.log('📦 MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const careers = [
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    description: 'Analyze complex data to help organizations make better decisions. Use statistical methods, machine learning, and programming to extract insights from large datasets.',
    category: 'Technology',
    difficulty: 'Advanced',
    averageSalary: { min: 80000, max: 150000 },
    jobGrowth: 'Much faster than average (31% growth)',
    skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization', 'Big Data'],
    roadmap: ['Learn Python & Statistics', 'Master SQL & Databases', 'Study Machine Learning', 'Practice with Real Projects'],
    detailedRoadmap: [
      {
        id: 'ds-foundations',
        title: 'Foundations',
        description: 'Build strong mathematical and programming foundations',
        skills: ['Python', 'Statistics', 'Linear Algebra'],
        projects: [
          {
            id: 'basic-analysis',
            title: 'Basic Data Analysis',
            description: 'Analyze a dataset using Python and create visualizations',
            difficulty: 'Beginner',
            estimatedTime: '2-3 weeks',
            skills: ['Python', 'Pandas', 'Matplotlib'],
            xpReward: 100
          }
        ],
        estimatedTime: '3-4 months',
        xpReward: 300
      },
      {
        id: 'ds-sql',
        title: 'SQL & Databases',
        description: 'Learn to work with databases and extract data efficiently',
        skills: ['SQL', 'Database Design', 'Data Cleaning'],
        projects: [
          {
            id: 'database-project',
            title: 'Database Design Project',
            description: 'Design and implement a database for a business case',
            difficulty: 'Intermediate',
            estimatedTime: '3-4 weeks',
            skills: ['SQL', 'Database Design'],
            xpReward: 150
          }
        ],
        estimatedTime: '2-3 months',
        xpReward: 250
      },
      {
        id: 'ds-ml',
        title: 'Machine Learning',
        description: 'Master machine learning algorithms and techniques',
        skills: ['Machine Learning', 'Scikit-learn', 'Deep Learning'],
        projects: [
          {
            id: 'ml-prediction',
            title: 'ML Prediction Model',
            description: 'Build a machine learning model to predict outcomes',
            difficulty: 'Advanced',
            estimatedTime: '4-6 weeks',
            skills: ['Machine Learning', 'Python', 'Scikit-learn'],
            xpReward: 200
          }
        ],
        estimatedTime: '4-6 months',
        xpReward: 400
      }
    ],
    totalXp: 950,
    popularity: 95,
    completionRate: 78,
    averageCompletionTime: 365,
    featured: true,
    tags: ['AI', 'ML', 'Analytics', 'Python'],
    resources: {
      books: [
        {
          title: 'Python for Data Analysis',
          author: 'Wes McKinney',
          isbn: '978-1491957660',
          description: 'Comprehensive guide to data analysis with Python'
        }
      ],
      courses: [
        {
          title: 'Machine Learning Course',
          platform: 'Coursera',
          url: 'https://coursera.org/learn/machine-learning',
          duration: '11 weeks',
          difficulty: 'Intermediate'
        }
      ],
      tools: [
        {
          name: 'Jupyter Notebook',
          description: 'Interactive development environment for data science',
          url: 'https://jupyter.org'
        }
      ]
    }
  },
  {
    id: 'ux-designer',
    name: 'UX Designer',
    description: 'Create user-centered designs by understanding user needs, conducting research, and designing intuitive interfaces that provide excellent user experiences.',
    category: 'Design',
    difficulty: 'Intermediate',
    averageSalary: { min: 60000, max: 120000 },
    jobGrowth: 'Faster than average (13% growth)',
    skills: ['User Research', 'Wireframing', 'Prototyping', 'UI Design', 'Usability Testing', 'Design Systems'],
    roadmap: ['Learn Design Principles', 'Master Design Tools', 'Study User Research', 'Build Portfolio'],
    detailedRoadmap: [
      {
        id: 'ux-principles',
        title: 'Design Principles',
        description: 'Learn fundamental design principles and user experience concepts',
        skills: ['Design Theory', 'Color Theory', 'Typography'],
        projects: [
          {
            id: 'design-system',
            title: 'Design System',
            description: 'Create a comprehensive design system for a product',
            difficulty: 'Beginner',
            estimatedTime: '2-3 weeks',
            skills: ['Design Systems', 'Figma'],
            xpReward: 100
          }
        ],
        estimatedTime: '2-3 months',
        xpReward: 250
      },
      {
        id: 'ux-research',
        title: 'User Research',
        description: 'Master user research methods and techniques',
        skills: ['User Interviews', 'Surveys', 'Usability Testing'],
        projects: [
          {
            id: 'user-research',
            title: 'User Research Project',
            description: 'Conduct comprehensive user research for a product',
            difficulty: 'Intermediate',
            estimatedTime: '3-4 weeks',
            skills: ['User Research', 'Data Analysis'],
            xpReward: 150
          }
        ],
        estimatedTime: '2-3 months',
        xpReward: 250
      },
      {
        id: 'ux-prototyping',
        title: 'Prototyping & Testing',
        description: 'Create interactive prototypes and conduct usability testing',
        skills: ['Prototyping', 'Usability Testing', 'Iteration'],
        projects: [
          {
            id: 'prototype-app',
            title: 'App Prototype',
            description: 'Design and prototype a complete mobile app',
            difficulty: 'Advanced',
            estimatedTime: '4-6 weeks',
            skills: ['Prototyping', 'UI Design', 'User Testing'],
            xpReward: 200
          }
        ],
        estimatedTime: '3-4 months',
        xpReward: 300
      }
    ],
    totalXp: 800,
    popularity: 88,
    completionRate: 82,
    averageCompletionTime: 300,
    featured: true,
    tags: ['Design', 'User Experience', 'UI', 'Research'],
    resources: {
      books: [
        {
          title: 'Don\'t Make Me Think',
          author: 'Steve Krug',
          isbn: '978-0321965516',
          description: 'Classic book on web usability'
        }
      ],
      courses: [
        {
          title: 'UX Design Course',
          platform: 'Udemy',
          url: 'https://udemy.com/course/ux-design',
          duration: '8 weeks',
          difficulty: 'Beginner'
        }
      ],
      tools: [
        {
          name: 'Figma',
          description: 'Collaborative interface design tool',
          url: 'https://figma.com'
        }
      ]
    }
  },
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    description: 'Design, develop, and maintain software applications. Write clean, efficient code and collaborate with teams to build scalable solutions.',
    category: 'Technology',
    difficulty: 'Intermediate',
    averageSalary: { min: 70000, max: 140000 },
    jobGrowth: 'Much faster than average (22% growth)',
    skills: ['Programming', 'Data Structures', 'Algorithms', 'Web Development', 'Databases', 'Version Control'],
    roadmap: ['Learn Programming', 'Study Data Structures', 'Master Web Development', 'Build Projects'],
    detailedRoadmap: [
      {
        id: 'se-programming',
        title: 'Programming Fundamentals',
        description: 'Learn programming basics and problem-solving skills',
        skills: ['JavaScript', 'Python', 'Problem Solving'],
        projects: [
          {
            id: 'calculator-app',
            title: 'Calculator App',
            description: 'Build a functional calculator with JavaScript',
            difficulty: 'Beginner',
            estimatedTime: '1-2 weeks',
            skills: ['JavaScript', 'HTML', 'CSS'],
            xpReward: 80
          }
        ],
        estimatedTime: '3-4 months',
        xpReward: 300
      },
      {
        id: 'se-data-structures',
        title: 'Data Structures & Algorithms',
        description: 'Master fundamental data structures and algorithms',
        skills: ['Data Structures', 'Algorithms', 'Complexity Analysis'],
        projects: [
          {
            id: 'algorithm-visualizer',
            title: 'Algorithm Visualizer',
            description: 'Create a tool to visualize sorting algorithms',
            difficulty: 'Intermediate',
            estimatedTime: '3-4 weeks',
            skills: ['JavaScript', 'Algorithms', 'Visualization'],
            xpReward: 150
          }
        ],
        estimatedTime: '3-4 months',
        xpReward: 300
      },
      {
        id: 'se-web-dev',
        title: 'Web Development',
        description: 'Build full-stack web applications',
        skills: ['React', 'Node.js', 'Databases', 'APIs'],
        projects: [
          {
            id: 'fullstack-app',
            title: 'Full-Stack Application',
            description: 'Build a complete web application with frontend and backend',
            difficulty: 'Advanced',
            estimatedTime: '6-8 weeks',
            skills: ['React', 'Node.js', 'MongoDB', 'Express'],
            xpReward: 250
          }
        ],
        estimatedTime: '4-6 months',
        xpReward: 400
      }
    ],
    totalXp: 1000,
    popularity: 92,
    completionRate: 75,
    averageCompletionTime: 400,
    featured: true,
    tags: ['Programming', 'Web Development', 'JavaScript', 'React'],
    resources: {
      books: [
        {
          title: 'Clean Code',
          author: 'Robert C. Martin',
          isbn: '978-0132350884',
          description: 'Guide to writing clean, maintainable code'
        }
      ],
      courses: [
        {
          title: 'Full Stack Web Development',
          platform: 'freeCodeCamp',
          url: 'https://freecodecamp.org',
          duration: '6 months',
          difficulty: 'Intermediate'
        }
      ],
      tools: [
        {
          name: 'VS Code',
          description: 'Popular code editor with extensive extensions',
          url: 'https://code.visualstudio.com'
        }
      ]
    }
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing Specialist',
    description: 'Develop and execute digital marketing strategies to promote products and services online. Use various channels like social media, email, and SEO.',
    category: 'Marketing',
    difficulty: 'Beginner-Friendly',
    averageSalary: { min: 45000, max: 90000 },
    jobGrowth: 'Faster than average (10% growth)',
    skills: ['SEO', 'Social Media Marketing', 'Email Marketing', 'Content Marketing', 'Analytics', 'PPC'],
    roadmap: ['Learn Marketing Basics', 'Master Digital Channels', 'Study Analytics', 'Build Campaigns'],
    detailedRoadmap: [
      {
        id: 'dm-basics',
        title: 'Marketing Fundamentals',
        description: 'Learn core marketing principles and digital marketing basics',
        skills: ['Marketing Theory', 'Consumer Behavior', 'Brand Strategy'],
        projects: [
          {
            id: 'marketing-plan',
            title: 'Marketing Plan',
            description: 'Create a comprehensive digital marketing plan for a business',
            difficulty: 'Beginner',
            estimatedTime: '2-3 weeks',
            skills: ['Marketing Strategy', 'Planning'],
            xpReward: 100
          }
        ],
        estimatedTime: '2-3 months',
        xpReward: 200
      },
      {
        id: 'dm-channels',
        title: 'Digital Channels',
        description: 'Master various digital marketing channels and platforms',
        skills: ['Social Media', 'Email Marketing', 'Content Marketing'],
        projects: [
          {
            id: 'social-campaign',
            title: 'Social Media Campaign',
            description: 'Design and execute a social media marketing campaign',
            difficulty: 'Intermediate',
            estimatedTime: '3-4 weeks',
            skills: ['Social Media Marketing', 'Content Creation'],
            xpReward: 150
          }
        ],
        estimatedTime: '3-4 months',
        xpReward: 300
      },
      {
        id: 'dm-analytics',
        title: 'Analytics & Optimization',
        description: 'Learn to measure and optimize marketing performance',
        skills: ['Google Analytics', 'A/B Testing', 'ROI Analysis'],
        projects: [
          {
            id: 'analytics-report',
            title: 'Analytics Report',
            description: 'Create comprehensive analytics reports and optimization recommendations',
            difficulty: 'Advanced',
            estimatedTime: '4-6 weeks',
            skills: ['Analytics', 'Data Analysis', 'Reporting'],
            xpReward: 200
          }
        ],
        estimatedTime: '2-3 months',
        xpReward: 250
      }
    ],
    totalXp: 750,
    popularity: 85,
    completionRate: 88,
    averageCompletionTime: 250,
    featured: true,
    tags: ['Marketing', 'SEO', 'Social Media', 'Analytics'],
    resources: {
      books: [
        {
          title: 'Digital Marketing for Dummies',
          author: 'Ryan Deiss',
          isbn: '978-1119235600',
          description: 'Comprehensive guide to digital marketing'
        }
      ],
      courses: [
        {
          title: 'Digital Marketing Course',
          platform: 'Google Digital Garage',
          url: 'https://learndigital.withgoogle.com',
          duration: '4 weeks',
          difficulty: 'Beginner'
        }
      ],
      tools: [
        {
          name: 'Google Analytics',
          description: 'Web analytics service to track website traffic',
          url: 'https://analytics.google.com'
        }
      ]
    }
  },
  {
    id: 'cybersecurity-analyst',
    name: 'Cybersecurity Analyst',
    description: 'Protect organizations from cyber threats by monitoring networks, analyzing security risks, and implementing security measures to safeguard data and systems.',
    category: 'Technology',
    difficulty: 'Advanced',
    averageSalary: { min: 75000, max: 130000 },
    jobGrowth: 'Much faster than average (33% growth)',
    skills: ['Network Security', 'Threat Analysis', 'Incident Response', 'Security Tools', 'Compliance', 'Penetration Testing'],
    roadmap: ['Learn Security Fundamentals', 'Study Network Security', 'Master Security Tools', 'Practice Ethical Hacking'],
    detailedRoadmap: [
      {
        id: 'cs-fundamentals',
        title: 'Security Fundamentals',
        description: 'Learn cybersecurity basics and security principles',
        skills: ['Security Concepts', 'Risk Management', 'Compliance'],
        projects: [
          {
            id: 'security-assessment',
            title: 'Security Assessment',
            description: 'Conduct a basic security assessment of a system',
            difficulty: 'Beginner',
            estimatedTime: '2-3 weeks',
            skills: ['Security Assessment', 'Risk Analysis'],
            xpReward: 100
          }
        ],
        estimatedTime: '3-4 months',
        xpReward: 300
      },
      {
        id: 'cs-network',
        title: 'Network Security',
        description: 'Master network security concepts and tools',
        skills: ['Network Protocols', 'Firewalls', 'VPNs'],
        projects: [
          {
            id: 'network-monitor',
            title: 'Network Monitoring Tool',
            description: 'Build a network monitoring and alerting system',
            difficulty: 'Intermediate',
            estimatedTime: '4-6 weeks',
            skills: ['Network Security', 'Monitoring', 'Python'],
            xpReward: 200
          }
        ],
        estimatedTime: '4-5 months',
        xpReward: 350
      },
      {
        id: 'cs-pentesting',
        title: 'Penetration Testing',
        description: 'Learn ethical hacking and penetration testing techniques',
        skills: ['Penetration Testing', 'Vulnerability Assessment', 'Exploitation'],
        projects: [
          {
            id: 'pentest-lab',
            title: 'Penetration Testing Lab',
            description: 'Set up and conduct penetration tests in a controlled environment',
            difficulty: 'Advanced',
            estimatedTime: '6-8 weeks',
            skills: ['Penetration Testing', 'Ethical Hacking', 'Reporting'],
            xpReward: 250
          }
        ],
        estimatedTime: '4-6 months',
        xpReward: 400
      }
    ],
    totalXp: 1050,
    popularity: 90,
    completionRate: 70,
    averageCompletionTime: 450,
    featured: true,
    tags: ['Security', 'Networking', 'Ethical Hacking', 'Compliance'],
    resources: {
      books: [
        {
          title: 'The Web Application Hacker\'s Handbook',
          author: 'Dafydd Stuttard',
          isbn: '978-1118026472',
          description: 'Comprehensive guide to web application security'
        }
      ],
      courses: [
        {
          title: 'Cybersecurity Course',
          platform: 'Cybrary',
          url: 'https://cybrary.it',
          duration: '12 weeks',
          difficulty: 'Advanced'
        }
      ],
      tools: [
        {
          name: 'Wireshark',
          description: 'Network protocol analyzer',
          url: 'https://wireshark.org'
        }
      ]
    }
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    description: 'Lead product development from conception to launch. Work with cross-functional teams to define product strategy, prioritize features, and ensure successful delivery.',
    category: 'Business',
    difficulty: 'Intermediate',
    averageSalary: { min: 80000, max: 150000 },
    jobGrowth: 'Faster than average (8% growth)',
    skills: ['Product Strategy', 'User Research', 'Agile Methodologies', 'Data Analysis', 'Stakeholder Management', 'Roadmapping'],
    roadmap: ['Learn Product Fundamentals', 'Master Agile Methods', 'Study User Research', 'Build Product Portfolio'],
    detailedRoadmap: [
      {
        id: 'pm-fundamentals',
        title: 'Product Fundamentals',
        description: 'Learn product management basics and frameworks',
        skills: ['Product Strategy', 'Market Research', 'Business Models'],
        projects: [
          {
            id: 'product-strategy',
            title: 'Product Strategy Document',
            description: 'Create a comprehensive product strategy for a new product',
            difficulty: 'Beginner',
            estimatedTime: '3-4 weeks',
            skills: ['Strategy', 'Market Analysis', 'Documentation'],
            xpReward: 120
          }
        ],
        estimatedTime: '3-4 months',
        xpReward: 300
      },
      {
        id: 'pm-agile',
        title: 'Agile & Execution',
        description: 'Master agile methodologies and product execution',
        skills: ['Agile', 'Scrum', 'Sprint Planning', 'Backlog Management'],
        projects: [
          {
            id: 'agile-project',
            title: 'Agile Project Management',
            description: 'Lead an agile project from planning to delivery',
            difficulty: 'Intermediate',
            estimatedTime: '4-6 weeks',
            skills: ['Agile', 'Project Management', 'Team Leadership'],
            xpReward: 180
          }
        ],
        estimatedTime: '3-4 months',
        xpReward: 300
      },
      {
        id: 'pm-advanced',
        title: 'Advanced Product Management',
        description: 'Master advanced product management techniques and leadership',
        skills: ['Product Leadership', 'Stakeholder Management', 'Data-Driven Decisions'],
        projects: [
          {
            id: 'product-launch',
            title: 'Product Launch',
            description: 'Plan and execute a complete product launch',
            difficulty: 'Advanced',
            estimatedTime: '8-12 weeks',
            skills: ['Product Launch', 'Marketing', 'Cross-functional Leadership'],
            xpReward: 250
          }
        ],
        estimatedTime: '4-6 months',
        xpReward: 400
      }
    ],
    totalXp: 1000,
    popularity: 87,
    completionRate: 80,
    averageCompletionTime: 350,
    featured: true,
    tags: ['Product Management', 'Agile', 'Leadership', 'Strategy'],
    resources: {
      books: [
        {
          title: 'Inspired',
          author: 'Marty Cagan',
          isbn: '978-1119387503',
          description: 'How to create products customers love'
        }
      ],
      courses: [
        {
          title: 'Product Management Course',
          platform: 'Product School',
          url: 'https://productschool.com',
          duration: '8 weeks',
          difficulty: 'Intermediate'
        }
      ],
      tools: [
        {
          name: 'Jira',
          description: 'Project management tool for agile teams',
          url: 'https://atlassian.com/software/jira'
        }
      ]
    }
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Career.deleteMany({});
    await Quiz.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Insert careers
    const createdCareers = await Career.insertMany(careers);
    console.log(`✅ Inserted ${createdCareers.length} careers`);

    // Create quiz with questions
    const quiz = await Quiz.create({
      questions: [
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
      ]
    });

    console.log(`✅ Created quiz with ${quiz.questions.length} questions`);

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
connectDB().then(seedDatabase); 