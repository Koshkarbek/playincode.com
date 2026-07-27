import { CourseCard, BenefitCard, TrialStep, Case, Review, FaqItem } from "@/types";

export const content = {
  // Header & Meta
  siteName: "Play In Code",
  siteDescription: "One-on-one online programming courses for children aged 7-16",
  slogan: "Play In Code — programming for kids with a personal mentor",

  seo: {
    title: "Individual Online Coding for Kids — Scratch, Roblox, Python | Play In Code",
    description:
      "One-on-one online programming courses for kids 7–16: Scratch, Roblox Studio, Python. Personal mentor, Russian-speaking teachers, students from the US and Europe. Free trial lesson.",
    keywords: [
      "online coding for kids",
      "programming courses for children",
      "Scratch for kids",
      "Roblox Studio for kids",
      "Python for kids",
      "1-on-1 coding lessons",
      "online coding school",
    ],
    ogTitle: "Play In Code — Online Programming for Kids 7–16",
    ogDescription:
      "Scratch, Roblox, and Python with a personal mentor. Russian-speaking school for children in the US and Europe. Book a free trial lesson.",
    privacy: {
      title: "Privacy Policy",
      description: "How Play In Code processes personal data of students and parents.",
    },
    terms: {
      title: "Terms of Use",
      description: "Rules for using the Play In Code online school website and services.",
    },
    consent: {
      title: "Consent to Data Processing",
      description: "Consent terms for processing personal data when booking a trial lesson.",
    },
  },
  header: {
    ctaText: "Get trial",
    logoAlt: "Play In Code",
  },
  whatsapp: {
    trialLessonMessage: "Hello! I would like to book a free trial lesson for my child",
  },

  // ============ HERO SECTION ============
  hero: {
    courseBadges: ["Scratch", "Roblox Studio", "Python"],
    heading: "Online Coding for Kids — Scratch, Roblox, Python",
    headingPrefix: "We teach",
    headingSuffix: "Programming for kids",
    subheading:
      "Scratch, Roblox, and Python with a mentor. Assessment and a step-by-step plan for parents from the very first lesson.",
    featureBadges: ["Individual", "7-16 years", "Online"],
    ctaText: "Get a free trial lesson",
    ctaSubtext: "Limited spots available.",
    viewCoursesText: "View courses",
    courseDescriptions: [
      "Visual coding — the perfect starting point",
      "Create your own games and mechanics",
      "Learn real programming fundamentals",
    ],
    trustBadges: [
      "One-on-one format",
      "A mentor matched to your child's personality",
      "Parent report after each lesson",
      "Online from any country",
    ],
  },

  // ============ WHY US SECTION ============
  whyUs: {
    heading: "Why Parents Choose Play In Code",
    description: "The most important things, briefly:",
    benefits: [
      {
        id: "individual-format",
        heading: "Individual Format",
        description:
          "Lessons are one-on-one. The pace and program are tailored to your child.",
      },
      {
        id: "mentor-not-teacher",
        heading: "Not Just a Teacher, but a Mentor",
        description:
          "We help with programming while keeping your child's interest alive.",
      },
      {
        id: "parent-feedback",
        heading: "Detailed Feedback for Parents",
        description:
          "After each lesson, parents receive a clear follow-up: what was done and what comes next.",
      },
      {
        id: "learning-through-interest",
        heading: "Learning Through Your Child's Interests",
        description:
          "We teach through practice and what genuinely interests your child.",
      },
      {
        id: "free-trial",
        heading: "Free Trial Lesson with Full Assessment",
        description:
          "In the first lesson, we help identify the most suitable direction.",
      },
      {
        id: "online-for-expats",
        heading: "Convenient for Families Abroad",
        description:
          "A comfortable online format for families living abroad.",
      },
    ] as BenefitCard[],
  },

  // ============ COURSES SECTION ============
  courses: {
    heading: "Choose the Right Track",
    subheading: "We will recommend a course based on your child's age, interests, and level.",
    childLabel: "Your child will:",
    list: [
      {
        id: "scratch",
        ageRange: "7-10 years",
        heading: "Scratch for Children Aged 7-10",
        description:
          "A gentle introduction to programming through animation and first projects.",
        features: [
          "creates animations",
          "builds interactive stories",
          "learns step-by-step and logical thinking",
          "makes their first original projects",
        ],
        ctaText: "Try Scratch",
        whatsappMessage: "Hello! We are interested in Scratch for a younger child.",
      },
      {
        id: "roblox",
        ageRange: "9-16 years",
        heading: "Roblox Studio for Children Aged 9-16",
        description:
          "For children who are excited to create their own games and mechanics.",
        features: [
          "creates their own game worlds",
          "understands how game logic works",
          "builds first game projects",
          "turns interest in Roblox into a useful skill",
        ],
        ctaText: "Try Roblox Studio",
        whatsappMessage:
          "Hello! We want our child not only to play Roblox, but also to create their own games.",
      },
      {
        id: "python",
        ageRange: "12-16 years",
        heading: "Python for Children Aged 12-16",
        description:
          "A first serious programming language for teens: logic, structure, and practice.",
        features: [
          "writes first programs",
          "learns the basics of logic and algorithms",
          "solves practical tasks",
          "builds a strong foundation for future growth",
        ],
        ctaText: "Try Python",
        whatsappMessage: "Hello! We are interested in Python programming. What options do you have?",
      },
    ] as CourseCard[],
  },

  // ============ TRIAL LESSON SECTION ============
  trialLesson: {
    heading: "How the Free Trial Lesson Works",
    subheading: "The trial lesson lasts 40-50 minutes. At the end, we provide feedback for the parent.",
    steps: [
      {
        number: 1,
        title: "Introduction",
        description: "We get to know each other and define the goals.",
      },
      {
        number: 2,
        title: "Full Assessment",
        description: "We choose the right format and course.",
      },
      {
        number: 3,
        title: "First Mini Project",
        description:
          "Your child creates a first mini project in the selected track.",
      },
      {
        number: 4,
        title: "Feedback for Parents",
        description:
          "We summarize the lesson and share recommendations for the next step.",
      },
    ] as TrialStep[],
    ctaText: "Get a free trial lesson",
  },

  // ============ VALUE SECTION ============
  value: {
    heading: "What the Family Gets",
    forChild: {
      title: "For the Child",
      items: [
        "an engaging format without overload from theory",
        "first projects from the very first lesson",
        "development of logic and algorithmic thinking",
        "one-on-one mentor support",
        'the feeling of "I can do this"',
      ],
    },
    forParent: {
      title: "For the Parent",
      items: [
        "understanding whether the chosen track fits your child",
        "full assessment during the trial lesson",
        "an individually selected program",
        "full feedback after every lesson",
        "clear visibility into your child's progress",
      ],
    },
  },

  // ============ ONE-ON-ONE SECTION ============
  oneOnOne: {
    heading: "Why Individual Learning Works Better",
    description:
      "In a one-on-one format, a child does not get lost in a group and receives the mentor's full attention in every lesson.",
    considerations: [
      "learning pace",
      "the child's interests",
      "confidence or shyness",
      "fatigue",
      "engagement",
      "reaction to the material",
    ],
    conclusionText:
      "This helps the child move forward steadily and comfortably.",
    followUpTitle: "After the lesson, the parent receives a follow-up",
    followUpItems: [
      "what was studied",
      "what worked well",
      "how the child felt",
      "what pace they are moving at",
      "what to pay attention to next",
    ],
  },

  // ============ CASES SECTION ============
  cases: {
    heading: "What Children Already Create at Play In Code",
    description: "Short student stories",
    resultLabel: "Result",
    list: [
      {
        id: "case-roblox",
        title: "The Child Only Wanted to Play Roblox",
        story:
          "At first, the child only played games. During lessons, they started creating their own game elements and built a first project.",
        result: "interest in games turned into interest in creating",
      },
      {
        id: "case-scratch",
        title: "The Child Needed a Gentle Start in Programming",
        story:
          "The child got tired quickly from standard formats. Through Scratch, they became engaged in learning and started making their own projects.",
        result: "interest in learning and understanding of basic logic appeared",
      },
      {
        id: "case-python",
        title: "The Teen Wanted Something More Serious Than Just Games",
        story:
          "There was an interest in IT, but no starting point. In the trial lesson, the teen wrote their first Python program.",
        result: "a foundation and confidence to continue in IT appeared",
      },
      {
        id: "case-expat",
        title: "The Parent Wanted to Give Their Child a Useful Environment",
        story:
          "A family living abroad needed a useful Russian-speaking format. The child became engaged in lessons and attended regularly.",
        result: "the child got a meaningful format, and the parent got transparency",
      },
    ] as Case[],
  },

  // ============ REVIEWS SECTION ============
  reviews: {
    heading: "What Parents Say",
    description: "Real reviews from families already learning with Play In Code",
    list: [
      {
        id: "review-1",
        quote:
          "I want to thank you for our lessons! Living in New York and finding the right mentor who speaks the same language as my child while also building a strong foundation is not easy. Geser studied Python one-on-one, and I am impressed by how well-structured the teaching is. For us, it was a great start in programming. Highly recommend!",
        author: "Marina (son: Geser)",
        country: "New York, Python",
      },
      {
        id: "review-2",
        quote:
          "Bogdan is a huge Roblox fan, but I wanted this hobby to bring real value. The one-on-one format was a lifesaver for us: the teacher gently guided his interest toward development. Now Bogdan creates his own games and logic for his worlds. We are very happy with his progress!",
        author: "Yulia (son: Bogdan)",
        country: "Seattle, Roblox Studio (Lua)",
      },
      {
        id: "review-3",
        quote:
          "We have been studying Roblox Studio for some time already. What I like most is the individual approach. Sometimes Timofey learns quickly, and sometimes he needs to slow down and go deeper into details, and that works perfectly here. He loves that he can program character actions by himself. For Chicago, these classes are a great find in both quality and format. Thank you!",
        author: "Elena (son: Timofey)",
        country: "Chicago, Roblox Studio (Lua)",
      },
      {
        id: "review-4",
        quote:
          "Both of my daughters study with you, and I am very glad we chose your school. The girls have different learning speeds, but thanks to individual lessons, neither falls behind. They are both excited about creating their own games in Roblox Studio. It is great that they do not just learn buttons, but a real programming language. There are many courses in Tallinn now, but we found this warm and effective approach only here!",
        author: "Daria (daughters: Alexandra and Veronika)",
        country: "Tallinn, Roblox Studio (Lua)",
      },
      {
        id: "review-5",
        quote:
          "Mikhail always wanted to make his own games, and Roblox Studio became the perfect solution. At first, I was skeptical about games, but when I saw how complex the Lua scripts are that they write in class, I realized this is real education. Individual lessons help my son feel comfortable and ask any questions. The results over the past few months are impressive.",
        author: "Tatyana (son: Mikhail)",
        country: "Berlin, Roblox Studio (Lua)",
      },
      {
        id: "review-6",
        quote:
          "Amirkhan completed the Python fundamentals course. It was important for us that he gets a strong foundation, and the teacher handled this task 100%. The one-on-one format helped us quickly work through difficult topics that could easily be skipped in group classes. Now my son has a solid base. Thank you very much for your professionalism.",
        author: "Elmira (son: Amirkhan)",
        country: "Atyrau, Python",
      },
    ] as Review[],
  },

  // ============ HOW LESSONS WORK SECTION ============
  howLessonsWork: {
    heading: "How the Lessons Work",
    description: "Everything important before you start",
    details: [
      "Online",
      "One-on-one format with a mentor",
      "Lesson duration: 40-50 minutes",
      "Course and pace tailored to the child",
      "Suitable for any level",
      "A laptop is required",
      "We help with software setup in advance",
    ],
    additionalText: "We will explain the organizational details in WhatsApp after your request.",
  },

  // ============ STATS SECTION ============
  stats: {
    heading: "Play In Code in Numbers",
    description: "Numbers that reflect scale and trust",
    chartLabel: "Engagement growth",
    individualFormatTitle: "Individual Format",
    individualFormatDescription: "100% individual format",
    list: [
      { label: "years of teaching children programming", value: "3+" },
      { label: "children taught", value: "127+" },
      { label: "countries where our students live", value: "12+" },
      { label: "cities where children study with us", value: "24+" },
      { label: "individual format", value: "100%" },
      { label: "parents recommend us to others", value: "95%" },
    ],
  },

  // ============ SCARCITY SECTION ============
  scarcity: {
    heading: "Why It's Better to Apply Now",
    description:
      "We work in a one-on-one format, so the number of spots is limited. It's better to leave your request in advance.",
    ctaText: "Get a free trial lesson",
  },

  // ============ FAQ SECTION ============
  faq: {
    heading: "Frequently Asked Questions",
    description: "Short answers to common questions",
    list: [
      {
        id: "faq-1",
        question: "Is this course suitable if my child has never learned programming before?",
        answer:
          "Yes. We will recommend a program based on your child's age and level. During the trial lesson, we will determine the best starting point.",
      },
      {
        id: "faq-2",
        question: "What is better to choose: Scratch, Roblox, or Python?",
        answer:
          "It depends on age and interests. During the trial lesson, we will help choose the best option.",
      },
      {
        id: "faq-3",
        question: "Is the trial lesson really free?",
        answer: "Yes. The trial lesson is free and lasts 40-50 minutes.",
      },
      {
        id: "faq-4",
        question: "Does a parent need to attend?",
        answer:
          "Yes, it is better for a parent to attend the trial lesson so they can receive recommendations for further learning.",
      },
      {
        id: "faq-5",
        question: "Are these group lessons?",
        answer: "No. At Play In Code, lessons are only individual, one-on-one with a mentor.",
      },
      {
        id: "faq-6",
        question: "What is needed for the lessons?",
        answer: "A laptop and internet connection are required. We will explain everything else before the trial lesson.",
      },
      {
        id: "faq-7",
        question: "What happens after the trial lesson?",
        answer:
          "We provide feedback and suggest an individual plan for the next lessons.",
      },
      {
        id: "faq-8",
        question: "Do you only work with children from CIS countries?",
        answer:
          "No. We work with Russian-speaking families living in the USA, Europe, and other countries.",
      },
    ] as FaqItem[],
  },

  // ============ FINAL CTA SECTION ============
  finalCta: {
    heading: "Book a Free Trial Lesson for Your Child",
    subheading:
      "Let's get acquainted, run a full assessment, and choose the right direction.",
    ctaText: "Get a free trial lesson",
    ctaSubtext: "Mentor slots are limited.",
  },

  // ============ FOOTER ============
  footer: {
    companyName: "Play In Code",
    companyDescription: "One-on-one online programming courses for children aged 7-16",
    infoHeading: "Information",
    contactsHeading: "Contacts",
    links: {
      privacy: "Privacy Policy",
      terms: "Terms of Use",
      dataProcessing: "Consent to Data Processing",
    },
    social: {
      whatsapp: "WhatsApp",
      telegram: "@playincode_school",
      instagram: "@playincode.school",
    },
    languageToggle: {
      ru: "Russian",
      en: "English",
    },
    copyright: "© 2026 Play In Code. All rights reserved.",
  },
};
