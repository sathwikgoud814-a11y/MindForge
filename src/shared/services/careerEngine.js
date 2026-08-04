/**
 * MindForge Career Template Engine
 * Single centralized lookup for all career templates & dynamic Skill Tree generation based on Career + Destiny.
 */

export const CAREER_TEMPLATES = {
  'UI/UX Designer': {
    career: 'UI/UX Designer',
    icon: 'palette',
    description: 'Craft high-converting user experiences, design systems, and web layouts.',
    defaultDestinyIdentity: 'Senior Product Designer & Design Lead',
    defaultDestinyGoals: ['Build Comprehensive Design System', 'Master Figma Prototyping', 'Launch High-Converting UI'],
    categories: ['Design', 'Research', 'Strategy'],
    coreSkills: [
      'UI Design & Layout',
      'UX Research & Persona',
      'Figma & Components',
      'Wireframing & User Flow',
      'Typography & Hierarchy',
      'Accessibility (WCAG)',
      'Interaction Design',
      'Prototyping',
    ],
    supportingSkills: [
      'Design Systems & Tokens',
      'User Testing & Feedback',
      'Color Theory & Branding',
    ],
    advancedSkills: [
      'Interactive Micro-Animations',
      '3D Design & Blender',
    ],
    recommendedAttributes: ['creativity', 'focus', 'communication'],
    recommendedMissions: [
      {
        name: 'Design Figma UI Components & Design System Tokens',
        difficulty: 'S-Rank',
        estimatedDuration: '60 Mins',
        xpReward: 120,
        dpReward: 60,
        isMainMission: true,
        relatedSkills: ['UI Design & Layout', 'Figma & Components'],
        attributesImproved: ['Creativity +12', 'Focus +10'],
      },
      {
        name: 'Conduct UX Research & Persona Analysis',
        difficulty: 'A-Rank',
        estimatedDuration: '45 Mins',
        xpReward: 100,
        dpReward: 50,
        isMainMission: false,
        relatedSkills: ['UX Research & Persona'],
        attributesImproved: ['Knowledge +10', 'Focus +8'],
      },
    ],
  },

  'Frontend Developer': {
    career: 'Frontend Developer',
    icon: 'web',
    description: 'Build fast, responsive, and beautiful modern web applications.',
    defaultDestinyIdentity: 'Principal Frontend Architect',
    defaultDestinyGoals: ['Build Scalable React/Next.js Web App', 'Master TypeScript Architecture', 'Optimize Web Performance to 100'],
    categories: ['Technology', 'Engineering'],
    coreSkills: [
      'HTML5 & Semantic Markup',
      'CSS3 & Flexbox / Grid',
      'JavaScript (ES6+)',
      'TypeScript Architecture',
      'React & Hooks Ecosystem',
      'Next.js & Server Components',
      'Git & GitHub Workflow',
      'Responsive Mobile-First Design',
      'Web Testing & Jest',
    ],
    supportingSkills: [
      'Tailwind CSS & Styling',
      'REST API Consumption',
      'State Management (Zustand/Redux)',
    ],
    advancedSkills: [
      'Performance Optimization & Core Web Vitals',
      'WebAssembly & Micro-Frontends',
    ],
    recommendedAttributes: ['knowledge', 'focus', 'discipline'],
    recommendedMissions: [
      {
        name: 'Build Interactive React Dashboard Component',
        difficulty: 'S-Rank',
        estimatedDuration: '60 Mins',
        xpReward: 120,
        dpReward: 60,
        isMainMission: true,
        relatedSkills: ['React & Hooks Ecosystem', 'TypeScript Architecture'],
        attributesImproved: ['Knowledge +12', 'Focus +10'],
      },
      {
        name: 'Optimize Web App Bundle Size & Lighthouse Score',
        difficulty: 'A-Rank',
        estimatedDuration: '45 Mins',
        xpReward: 100,
        dpReward: 50,
        isMainMission: false,
        relatedSkills: ['Performance Optimization & Core Web Vitals'],
        attributesImproved: ['Focus +10', 'Knowledge +8'],
      },
    ],
  },

  'Software Engineer': {
    career: 'Software Engineer',
    icon: 'code',
    description: 'Build scalable full-stack applications, algorithms, and cloud systems.',
    defaultDestinyIdentity: 'Staff Software Engineer & System Architect',
    defaultDestinyGoals: ['Design Distributed System Architecture', 'Master Data Structures & Algorithms', 'Deploy CI/CD Cloud Infrastructure'],
    categories: ['Technology', 'System Architecture'],
    coreSkills: [
      'Object-Oriented & Functional Programming',
      'Data Structures & Algorithms (DSA)',
      'Algorithm Complexity & Analysis',
      'System Architecture Design',
      'SQL & NoSQL Database Modeling',
      'Git & Version Control',
      'Software Testing & CI/CD Pipelines',
      'Cloud Deployment & Infrastructure',
    ],
    supportingSkills: [
      'Docker & Containerization',
      'REST & GraphQL API Engineering',
      'Linux Shell & Bash Scripting',
    ],
    advancedSkills: [
      'Distributed Systems & Microservices',
      'High-Availability & Load Balancing',
    ],
    recommendedAttributes: ['knowledge', 'focus', 'consistency'],
    recommendedMissions: [
      {
        name: 'Implement Full-Stack REST API & Database Models',
        difficulty: 'S-Rank',
        estimatedDuration: '60 Mins',
        xpReward: 120,
        dpReward: 60,
        isMainMission: true,
        relatedSkills: ['System Architecture Design', 'SQL & NoSQL Database Modeling'],
        attributesImproved: ['Knowledge +12', 'Focus +10'],
      },
      {
        name: 'Solve 2 LeetCode Data Structures & Algorithms Problems',
        difficulty: 'A-Rank',
        estimatedDuration: '45 Mins',
        xpReward: 100,
        dpReward: 50,
        isMainMission: false,
        relatedSkills: ['Data Structures & Algorithms (DSA)'],
        attributesImproved: ['Knowledge +10', 'Focus +8'],
      },
    ],
  },

  'Machine Learning Engineer': {
    career: 'Machine Learning Engineer',
    icon: 'psychology',
    description: 'Develop AI models, deep neural networks, and MLOps pipelines.',
    defaultDestinyIdentity: 'AI Principal Research Engineer',
    defaultDestinyGoals: ['Train & Fine-Tune LLM Transformer', 'Deploy End-to-End RAG Pipeline', 'Master PyTorch Deep Learning'],
    categories: ['Artificial Intelligence', 'Data Science'],
    coreSkills: [
      'Python & NumPy / Pandas',
      'Machine Learning Algorithms',
      'Applied Statistics & Probability',
      'Linear Algebra & Vector Calculus',
      'SQL & Data Wrangling',
      'Data Visualization & Matplotlib',
      'PyTorch Deep Learning',
      'TensorFlow Model Training',
      'MLOps & Model Deployment',
      'Large Language Models (LLMs) & RAG',
    ],
    supportingSkills: [
      'Scikit-Learn Modeling',
      'Feature Engineering',
      'Hyperparameter Tuning',
    ],
    advancedSkills: [
      'Neural Architecture Search',
      'Distributed Model Parallelism',
    ],
    recommendedAttributes: ['knowledge', 'focus', 'resilience'],
    recommendedMissions: [
      {
        name: 'Train & Fine-Tune Transformer Model for NLP Classification',
        difficulty: 'S-Rank',
        estimatedDuration: '60 Mins',
        xpReward: 130,
        dpReward: 65,
        isMainMission: true,
        relatedSkills: ['PyTorch Deep Learning', 'Large Language Models (LLMs) & RAG'],
        attributesImproved: ['Knowledge +14', 'Focus +10'],
      },
    ],
  },

  'Content Creator': {
    career: 'Content Creator',
    icon: 'videocam',
    description: 'Produce high-impact videos, personal branding, and audience growth.',
    defaultDestinyIdentity: 'Top-Tier Creator & Media Brand Founder',
    defaultDestinyGoals: ['Reach 100k Loyal Subscribers', 'Publish High-Retention Weekly Documentaries', 'Build Media Brand Ecosystem'],
    categories: ['Media', 'Marketing', 'Creative'],
    coreSkills: [
      'Content Strategy & Planning',
      'Storytelling & Hooks',
      'Script Writing & Formatting',
      'Video Editing (Premiere/DaVinci)',
      'Thumbnail Design & Graphic Assets',
      'Public Speaking & Camera Delivery',
      'SEO & Metadata Optimization',
      'Social Media Algorithm Dynamics',
      'Analytics & Retention Tracking',
      'Brand Identity Building',
    ],
    supportingSkills: [
      'Lighting & Audio Production',
      'Community Engagement & Management',
      'Sponsorship & Monetization Strategy',
    ],
    advancedSkills: [
      'Multi-Platform Content Syndication',
      'Media Production Team Leadership',
    ],
    recommendedAttributes: ['creativity', 'communication', 'confidence'],
    recommendedMissions: [
      {
        name: 'Write & Edit 1 High-Retention Script with Hook',
        difficulty: 'S-Rank',
        estimatedDuration: '60 Mins',
        xpReward: 120,
        dpReward: 60,
        isMainMission: true,
        relatedSkills: ['Storytelling & Hooks', 'Script Writing & Formatting'],
        attributesImproved: ['Creativity +12', 'Communication +10'],
      },
    ],
  },

  'Entrepreneur': {
    career: 'Entrepreneur',
    icon: 'domain',
    description: 'Build venture-backed startups, scale SaaS products, and master sales.',
    defaultDestinyIdentity: 'Venture-Backed SaaS Founder & CEO',
    defaultDestinyGoals: ['Launch SaaS Product MVP', 'Achieve $10k Monthly Recurring Revenue', 'Build High-Performance Core Team'],
    categories: ['Business', 'Leadership'],
    coreSkills: [
      'Business Strategy & Validation',
      'Product Marketing & Positioning',
      'Sales Pitching & Deal Closing',
      'Executive Leadership & Vision',
      'Contract & Value Negotiation',
      'Financial Modeling & Cash Flow',
      'Networking & Strategic Partnerships',
      'Talent Acquisition & Hiring',
      'Agile Product Management',
    ],
    supportingSkills: [
      'Customer Discovery Interviews',
      'Unit Economics & CAC/LTV',
      'Investor Pitch Deck Creation',
    ],
    advancedSkills: [
      'M&A & Enterprise Liquidity',
      'Global Scale Operations',
    ],
    recommendedAttributes: ['leadership', 'confidence', 'discipline'],
    recommendedMissions: [
      {
        name: 'Conduct 3 Customer Discovery Validation Interviews',
        difficulty: 'S-Rank',
        estimatedDuration: '60 Mins',
        xpReward: 120,
        dpReward: 60,
        isMainMission: true,
        relatedSkills: ['Business Strategy & Validation', 'Sales Pitching & Deal Closing'],
        attributesImproved: ['Leadership +12', 'Confidence +10'],
      },
    ],
  },

  'Writer': {
    career: 'Writer',
    icon: 'edit_note',
    description: 'Author fiction, technical publications, blogs, and compelling lore.',
    defaultDestinyIdentity: 'Bestselling Author & Lead Columnist',
    defaultDestinyGoals: ['Publish Original 80,000-Word Novel', 'Write 1,000 Words Daily for 30 Days', 'Build Reader Community'],
    categories: ['Literature', 'Communication'],
    coreSkills: [
      'Long-form Content Writing',
      'Copy Editing & Proofreading',
      'Deep Research & Fact Verification',
      'Grammar & Stylistic Tone',
      'Narrative Storytelling & Pacing',
      'Publishing & Distribution',
      'Creative Lateral Thinking',
    ],
    supportingSkills: [
      'Outline & Chapter Structuring',
      'Character & World Building',
      'Technical Documentation',
    ],
    advancedSkills: [
      'Book Publishing & Agent Querying',
      'Syndicated Column Writing',
    ],
    recommendedAttributes: ['creativity', 'focus', 'knowledge'],
    recommendedMissions: [
      {
        name: 'Write 1,500 Words of Chapter Outline & Core Narrative',
        difficulty: 'S-Rank',
        estimatedDuration: '60 Mins',
        xpReward: 120,
        dpReward: 60,
        isMainMission: true,
        relatedSkills: ['Long-form Content Writing', 'Narrative Storytelling & Pacing'],
        attributesImproved: ['Creativity +12', 'Focus +10'],
      },
    ],
  },

  'Athlete': {
    career: 'Athlete',
    icon: 'fitness_center',
    description: 'Build peak physical strength, endurance stamina, and athletic recovery.',
    defaultDestinyIdentity: 'Elite Athletic Competitor & Strength Master',
    defaultDestinyGoals: ['Complete Marathon in Under 3.5 Hours', 'Achieve Peak Body Recomposition', 'Maintain 90-Day Unbroken Workout Streak'],
    categories: ['Fitness', 'Health'],
    coreSkills: [
      'Calisthenics & Strength Training',
      'Endurance Running & Cardio',
      'Flexibility & Joint Mobility',
      'Macro Nutrition & Fueling',
      'Post-Workout Athletic Recovery',
      'Daily Physical Discipline',
      'Mental Toughness under Fatigue',
    ],
    supportingSkills: [
      'Heart Rate Zone Training',
      'Cold Hydrotherapy & Sleep Optimization',
      'Injury Prevention & Physical Therapy',
    ],
    advancedSkills: [
      'Marathon & Ultra Endurance',
      'Peak Competition Tapering',
    ],
    recommendedAttributes: ['strength', 'discipline', 'resilience'],
    recommendedMissions: [
      {
        name: 'Complete 60-Minute Heavy Strength & Core Conditioning',
        difficulty: 'S-Rank',
        estimatedDuration: '60 Mins',
        xpReward: 120,
        dpReward: 60,
        isMainMission: true,
        relatedSkills: ['Calisthenics & Strength Training', 'Daily Physical Discipline'],
        attributesImproved: ['Strength +14', 'Discipline +10'],
      },
    ],
  },

  'Student': {
    career: 'Student',
    icon: 'school',
    description: 'Accelerate academic performance, deep study focus, and subject mastery.',
    defaultDestinyIdentity: 'Top Honor Academic Scholar',
    defaultDestinyGoals: ['Achieve 4.0 GPA / Top 1% Class Standing', 'Master Deep Focus Study Routine', 'Publish Academic Thesis'],
    categories: ['Academics', 'Productivity'],
    coreSkills: [
      'Accelerated Learning Methodology',
      'Strict Time Blocking & Scheduling',
      'Deep Focus Reading & Retention',
      'Structured Note-Taking (Cornell/Zettelkasten)',
      'Analytical Problem Solving',
      'Memory Retention & Spaced Repetition',
      'Sustained Focus Stamina',
    ],
    supportingSkills: [
      'Academic Essay Writing',
      'Exam Strategy & Past Paper Drills',
      'Active Recall Techniques',
    ],
    advancedSkills: [
      'Academic Research & Thesis Defense',
      'Multi-Subject Concurrent Mastery',
    ],
    recommendedAttributes: ['knowledge', 'focus', 'consistency'],
    recommendedMissions: [
      {
        name: 'Execute 90-Minute Pomodoro Deep Study Block',
        difficulty: 'S-Rank',
        estimatedDuration: '90 Mins',
        xpReward: 140,
        dpReward: 70,
        isMainMission: true,
        relatedSkills: ['Deep Focus Reading & Retention', 'Memory Retention & Spaced Repetition'],
        attributesImproved: ['Knowledge +14', 'Focus +12'],
      },
    ],
  },

  'Doctor / Medical Specialist': {
    career: 'Doctor / Medical Specialist',
    icon: 'medical_services',
    description: 'Master clinical diagnosis, medical research, and human anatomy.',
    defaultDestinyIdentity: 'Chief Medical Officer & Clinical Specialist',
    defaultDestinyGoals: ['Pass Medical Licensing & Board Exams', 'Publish Clinical Research Paper', 'Master Diagnostic Protocols'],
    categories: ['Medicine', 'Healthcare'],
    coreSkills: [
      'Clinical Diagnosis & Patient Examination',
      'Human Anatomy & Physiology',
      'Pharmacology & Therapeutics',
      'Medical Research & Evidence-Based Medicine',
      'Surgical Procedures & Precision',
      'Emergency Medicine & Crisis Protocol',
      'Patient Communication & Empathy',
    ],
    supportingSkills: [
      'Diagnostic Imaging Interpretation',
      'Biostatistics & Medical Journals',
      'Medical Ethics & Jurisprudence',
    ],
    advancedSkills: [
      'Sub-Specialty Surgical Mastery',
      'Clinical Trial Principal Investigator',
    ],
    recommendedAttributes: ['knowledge', 'focus', 'resilience'],
    recommendedMissions: [
      {
        name: 'Review 3 Clinical Case Studies & Diagnostic Protocols',
        difficulty: 'S-Rank',
        estimatedDuration: '60 Mins',
        xpReward: 130,
        dpReward: 65,
        isMainMission: true,
        relatedSkills: ['Clinical Diagnosis & Patient Examination', 'Medical Research & Evidence-Based Medicine'],
        attributesImproved: ['Knowledge +14', 'Focus +10'],
      },
    ],
  },

  'Data Scientist': {
    career: 'Data Scientist',
    icon: 'analytics',
    description: 'Extract insights from data, statistical models, and predictive analytics.',
    defaultDestinyIdentity: 'Lead Data Science & Analytics Specialist',
    defaultDestinyGoals: ['Build Predictive Analytics Pipeline', 'Master SQL & Python Data Science', 'Present Data Strategy to Board'],
    categories: ['Data Science', 'Analytics'],
    coreSkills: [
      'Python & Data Analytics Ecosystem',
      'SQL & Data Warehouse Querying',
      'Exploratory Data Analysis (EDA)',
      'Statistical Inference & Hypothesis Testing',
      'Predictive Modeling & Regression',
      'Data Visualization & Dashboards',
      'Big Data Processing (Spark)',
    ],
    supportingSkills: [
      'Feature Extraction & Engineering',
      'A/B Testing & Experimentation',
      'Business Intelligence Reporting',
    ],
    advancedSkills: [
      'Time Series Forecasting & Anomaly Detection',
      'Causal Inference & Econometrics',
    ],
    recommendedAttributes: ['knowledge', 'focus', 'creativity'],
    recommendedMissions: [
      {
        name: 'Clean, Analyze & Build Predictive Model on Dataset',
        difficulty: 'S-Rank',
        estimatedDuration: '60 Mins',
        xpReward: 120,
        dpReward: 60,
        isMainMission: true,
        relatedSkills: ['Python & Data Analytics Ecosystem', 'Predictive Modeling & Regression'],
        attributesImproved: ['Knowledge +12', 'Focus +10'],
      },
    ],
  },
};

/**
 * Get career default destiny identity & goals
 */
export function getCareerDefaults(careerName) {
  const tpl = CAREER_TEMPLATES[careerName] || CAREER_TEMPLATES['UI/UX Designer'];
  return {
    destinyIdentity: tpl.defaultDestinyIdentity,
    destinyGoals: tpl.defaultDestinyGoals,
  };
}

/**
 * Dynamic Skill Tree Generator derived from Career + Destiny Identity
 * Single lookup engine with ZERO switch statements.
 * @param {string} careerName - Chosen career title
 * @param {string} destinyIdentity - Player's vision / destiny goals
 */
export function getDynamicSkillTree(careerName, destinyIdentity = '') {
  // Single Template Lookup
  const baseTemplate = CAREER_TEMPLATES[careerName] || CAREER_TEMPLATES['UI/UX Designer'];
  const destinyLower = (destinyIdentity || '').toLowerCase();

  let core = [...baseTemplate.coreSkills];
  let supporting = [...baseTemplate.supportingSkills];
  let advanced = [...baseTemplate.advancedSkills];

  // Destiny Contextual Adjustments
  if (careerName === 'Content Creator') {
    if (destinyLower.includes('youtube') || destinyLower.includes('channel')) {
      core = [
        'Storytelling',
        'Video Editing',
        'Thumbnail Design',
        'SEO',
        'Audience Growth',
        'Analytics',
        'Branding',
        'Public Speaking',
      ];
      supporting = ['Camera Equipment & Lighting', 'Sponsorship Deals', 'Community Discord Management'];
      advanced = ['Multi-Editor Workflow', 'Media Brand Empire'];
    } else if (destinyLower.includes('tech') || destinyLower.includes('educator') || destinyLower.includes('course')) {
      core = [
        'Technical Writing',
        'Teaching',
        'Presentation',
        'Screen Recording',
        'Python',
        'AI Tools',
        'Curriculum Design',
      ];
      supporting = ['LMS Platform Setup', 'Code Demonstration', 'Student Q&A Office Hours'];
      advanced = ['Tech Book Authoring', 'Global Bootcamp Scaling'];
    } else if (destinyLower.includes('instagram') || destinyLower.includes('reels') || destinyLower.includes('social')) {
      core = [
        'Short-form Video',
        'Reels Editing',
        'Photography',
        'Personal Branding',
        'Social Media Strategy',
        'Audience Engagement',
      ];
      supporting = ['Aesthetic Feed Curation', 'Influencer PR Outreach', 'Story Telling & Captions'];
      advanced = ['E-commerce Merch Launch', 'Global Brand Ambassador'];
    }
  } else if (careerName === 'Software Engineer' || careerName === 'Frontend Developer') {
    if (destinyLower.includes('mobile') || destinyLower.includes('ios') || destinyLower.includes('android')) {
      core = ['React Native', 'Swift / Kotlin', 'Mobile UI Architecture', 'App Store Deployment', 'Git & CI/CD'];
      supporting = ['Push Notifications Protocol', 'Offline Storage Sync'];
      advanced = ['Native C++ Bridge Plugins', 'Cross-Platform Performance Engine'];
    } else if (destinyLower.includes('ai') || destinyLower.includes('llm') || destinyLower.includes('saas')) {
      core = ['JavaScript & TypeScript', 'LangChain / LlamaIndex', 'Vector Databases (Pinecone)', 'Prompt Engineering', 'RAG Pipelines'];
      supporting = ['Node.js Backend REST APIs', 'OpenAI / Ollama Integration'];
      advanced = ['Distributed Agent Networks', 'Autonomous LLM System Design'];
    }
  } else if (careerName === 'Entrepreneur') {
    if (destinyLower.includes('saas') || destinyLower.includes('startup')) {
      core = ['SaaS Financial Modeling', 'Product Analytics', 'Customer Discovery', 'Growth Hacking', 'Sales & Pitching'];
      supporting = ['Stripe Payment Architecture', 'Churn Rate Reduction'];
      advanced = ['Venture Capital Pitch Deck', 'Y-Combinator Growth Scaling'];
    }
  }

  // Format into standard tree structure
  return {
    career: baseTemplate.career,
    icon: baseTemplate.icon,
    description: baseTemplate.description,
    destinyIdentity: destinyIdentity || baseTemplate.defaultDestinyIdentity,
    recommendedAttributes: baseTemplate.recommendedAttributes,
    recommendedMissions: baseTemplate.recommendedMissions,
    tree: {
      core: core.map((name, i) => ({
        id: `sk_core_${i}`,
        name,
        level: 1,
        xp: 0,
        xpToNext: 100,
        category: baseTemplate.categories[0] || 'Core',
        tier: 'Core',
      })),
      supporting: supporting.map((name, i) => ({
        id: `sk_supp_${i}`,
        name,
        level: 1,
        xp: 0,
        xpToNext: 100,
        category: baseTemplate.categories[1] || 'Supporting',
        tier: 'Supporting',
      })),
      advanced: advanced.map((name, i) => ({
        id: `sk_adv_${i}`,
        name,
        level: 1,
        xp: 0,
        xpToNext: 100,
        category: baseTemplate.categories[2] || 'Advanced',
        tier: 'Advanced',
      })),
    },
  };
}
