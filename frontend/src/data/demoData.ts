import type { Course, Creator, NotificationItem, OrbitRoom, Post, UserGoal } from '../types';

const names = ['Rahul Sharma', 'Ananya Nair', 'Kiran Raj', 'Meera Thomas', 'Arjun Menon'];
const specialties = ['Cybersecurity', 'Full Stack Development', 'Cloud Security', 'Data Science', 'DevOps'];
export const demoCreators: Creator[] = names.map((name, i) => ({
  id: `demo_creator_${i + 1}`, username: name.toLowerCase().replace(/\s/g, '.'), name,
  handle: `@${name.toLowerCase().replace(/\s/g, '')}`, avatar: '/infonest-logo.png',
  coverImage: '', role: specialties[i], specialty: specialties[i], bio: `${name.split(' ')[0]} helps learners build practical skills in ${specialties[i].toLowerCase()}.`,
  followersCount: [2840, 1960, 3410, 1580, 2210][i], followingCount: 140 + i * 17, studentCount: 820 + i * 93,
  totalLectures: 18 + i * 4, rating: 4.7 + (i % 3) / 10, isFollowed: true, verified: true,
  knowledgeTokens: 0, knowledgeScore: 900 + i * 130, expertiseTags: [specialties[i], 'Career Learning'], recentDropsCount: 3 + i,
}));

const catalog = [
  ['Programming','Python Foundations for Engineers'],['Programming','Modern JavaScript: From Core to Craft'],['Programming','TypeScript in Production'],['Programming','Go for Backend Services'],['Programming','Java and Spring Boot Essentials'],
  ['Web Development','React Applications from Zero to Launch'],['Web Development','Advanced React Patterns'],['Web Development','Accessible Web Interfaces'],['Web Development','Node.js APIs with Express'],['Web Development','Next.js Full Stack Workshop'],
  ['Cybersecurity','Cybersecurity Fundamentals'],['Cybersecurity','Web Application Security'],['Cybersecurity','Ethical Hacking Basics'],['Cybersecurity','Practical Burp Suite'],['Cybersecurity','Security Operations and Incident Response'],
  ['Cloud Computing','AWS Architecture Essentials'],['Cloud Computing','Azure Cloud Administration'],['Cloud Computing','Google Cloud for Developers'],['Cloud Computing','Cloud Security Workshop'],['Cloud Computing','Serverless Systems Design'],
  ['Data Science','Data Analysis with Python'],['Data Science','Statistics for Data Practitioners'],['Data Science','Data Visualization with Tableau'],['Data Science','Feature Engineering in Practice'],['Data Science','Applied SQL for Analytics'],
  ['Artificial Intelligence','Machine Learning Foundations'],['Artificial Intelligence','Building with Large Language Models'],['Artificial Intelligence','Responsible AI Systems'],['Artificial Intelligence','Computer Vision with PyTorch'],['Artificial Intelligence','Practical NLP'],
  ['Databases','PostgreSQL Performance Tuning'],['Databases','MongoDB Application Design'],['Databases','Redis for Real-Time Apps'],['Databases','Database Modeling Fundamentals'],['Databases','Introduction to Distributed Data'],
  ['DevOps','Docker and Container Workflows'],['DevOps','Kubernetes for Application Teams'],['DevOps','CI/CD with GitHub Actions'],['DevOps','Infrastructure as Code with Terraform'],['DevOps','Observability with OpenTelemetry'],
  ['Networking','TCP/IP for Software Engineers'],['Networking','Network Troubleshooting Lab'],['Networking','Practical Routing and Switching'],['Networking','Zero Trust Network Design'],['Networking','DNS and Load Balancing'],
  ['Software Engineering','System Design Interview Practice'],['Software Engineering','Clean Code and Refactoring'],['Software Engineering','Testing Reliable Web Services'],['Software Engineering','Software Architecture Essentials'],['Software Engineering','Agile Delivery for Engineers'],
];
export const demoCourses: Course[] = catalog.map(([category, title], i) => {
  const creator = demoCreators[i % demoCreators.length];
  const level = (['Beginner','Intermediate','Advanced'] as const)[i % 3];
  return { id: `demo_course_${i + 1}`, title, subtitle: `A practical, project-led course in ${category.toLowerCase()} with guided exercises and real-world examples.`, description: `Build confidence in ${title.toLowerCase()} through focused lessons and hands-on practice.`, creator, level, category, rating: Number((4.6 + (i % 5) / 10).toFixed(1)), reviewsCount: 85 + i * 11, studentsCount: 720 + i * 137, estimatedHours: 4 + (i % 9), coverImage: '/infonest-logo.png', tags: [category, level], modules: [], whatYouWillLearn: ['Understand core concepts', 'Apply the skill in a guided project', 'Plan your next learning step'], requirements: ['Curiosity and a computer'], certificateAvailable: true, reviews: [], isEnrolled: i < 3, progressPercent: i === 0 ? 42 : i === 1 ? 68 : i === 2 ? 15 : 0 };
});

export const demoGoals: UserGoal[] = [
  { id:'demo_goal_security', title:'Become a Cybersecurity Engineer', category:'Cybersecurity', description:'Build a strong security foundation and prepare for an entry-level security engineering role.', status:'active', roadmapTitle:'Become a Cybersecurity Engineer', targetHoursPerWeek:8, loggedHoursThisWeek:5.2, targetCompletionDate:'Flexible', streakDays:6, completedTasks:2, totalTasks:6, progressPercent:42, weeklyHistory:[1,2,1,2,1,3,2] },
  { id:'demo_goal_react', title:'Ship a production-ready React app', category:'Web Development', description:'Practice accessible UI, testing, and deployment through a complete portfolio project.', status:'active', roadmapTitle:'Ship a production-ready React app', targetHoursPerWeek:6, loggedHoursThisWeek:3, targetCompletionDate:'Flexible', streakDays:3, completedTasks:3, totalTasks:7, progressPercent:38, weeklyHistory:[1,1,2,1,2,1,1] },
  { id:'demo_goal_cloud', title:'Earn a cloud practitioner certificate', category:'Cloud Computing', description:'Learn cloud fundamentals and complete a structured certification study plan.', status:'active', roadmapTitle:'Earn a cloud practitioner certificate', targetHoursPerWeek:5, loggedHoursThisWeek:2.5, targetCompletionDate:'Flexible', streakDays:4, completedTasks:2, totalTasks:5, progressPercent:40, weeklyHistory:[1,1,1,2,1,2,1] },
];
export const demoPosts: Post[] = [
  {id:'demo_post_1',creatorId:demoCreators[0].id,creator:demoCreators[0],type:'knowledge',dropTypeLabel:'SECURITY NOTE',title:'A practical first pass at web security',caption:'Start with the basics: map the trust boundaries, validate input on the server, and make session handling explicit. What security check do you add to every review?',tags:['#Cybersecurity','#WebSecurity'],createdAt:'Today',likesCount:86,commentsCount:12,bookmarksCount:24,sharesCount:8,isLiked:false,isBookmarked:true,reactions:{insightful:20,useful:32,mindOpening:10,practical:24,like:86}},
  {id:'demo_post_2',creatorId:demoCreators[1].id,creator:demoCreators[1],type:'thought',dropTypeLabel:'BUILD NOTE',title:'Small components make better system boundaries',caption:'A component should make one piece of behavior easier to understand. When it needs a long explanation, it may be carrying too many responsibilities.',tags:['#React','#SoftwareEngineering'],createdAt:'Yesterday',likesCount:54,commentsCount:7,bookmarksCount:15,sharesCount:5,isLiked:false,isBookmarked:false,reactions:{insightful:19,useful:20,mindOpening:8,practical:7,like:54}},
  {id:'demo_post_3',creatorId:demoCreators[2].id,creator:demoCreators[2],type:'knowledge',dropTypeLabel:'CLOUD GUIDE',title:'Three cloud IAM habits worth keeping',caption:'Prefer short-lived credentials, scope permissions to the task, and review access after a project changes. These habits make least privilege easier to maintain.',tags:['#CloudComputing','#IAM'],createdAt:'2 days ago',likesCount:71,commentsCount:9,bookmarksCount:29,sharesCount:11,isLiked:false,isBookmarked:true,reactions:{insightful:20,useful:25,mindOpening:9,practical:17,like:71}},
];
export const demoNotifications: NotificationItem[] = [
  {id:'demo_notice_1',category:'social',title:'New message from Ananya',description:'I shared the React patterns notes we discussed.',timestamp:'Today, 10:42 AM',read:false,avatar:demoCreators[1].avatar,actionUrl:'/messages'},
  {id:'demo_notice_2',category:'learning',title:'Your weekly learning check-in',description:'You have logged 10.7 hours across your active goals this week.',timestamp:'Today, 9:15 AM',read:false,actionUrl:'/goals'},
  {id:'demo_notice_3',category:'creator',title:'New lesson from Rahul',description:'Web Security: Understanding session handling is now available.',timestamp:'Yesterday, 4:30 PM',read:true,avatar:demoCreators[0].avatar,actionUrl:'/creators'},
  {id:'demo_notice_4',category:'missions',title:'Orbit session starting soon',description:'Cloud Security Workshop begins in a few minutes.',timestamp:'Yesterday, 2:05 PM',read:true,actionUrl:'/orbit-rooms'},
];
export const demoOrbitRooms: OrbitRoom[] = [
  {id:'live_security',name:'Cybersecurity Fundamentals',tag:'LIVE NOW · Security',description:'A guided session on threat modeling, secure defaults, and practical security habits.',membersCount:127,activeNow:127,icon:'🛡️',gradient:'from-emerald-500 to-cyan-500',topTopics:['Threat Modeling','Web Security','OWASP'],recentDropTitle:'Three checks to run before every deployment'},
  {id:'live_fullstack',name:'Full Stack Development',tag:'LIVE NOW · Web',description:'Build a robust application end to end with a focus on clean API boundaries.',membersCount:84,activeNow:84,icon:'💻',gradient:'from-violet-500 to-indigo-500',topTopics:['React','Node.js','API Design'],recentDropTitle:'Choosing the right boundary for a service'},
  {id:'live_cloud',name:'Cloud Security Workshop',tag:'LIVE NOW · Cloud',description:'Explore identity, network boundaries, and practical cloud security controls.',membersCount:63,activeNow:63,icon:'☁️',gradient:'from-sky-500 to-blue-500',topTopics:['IAM','Cloud Security','Zero Trust'],recentDropTitle:'A least-privilege checklist for cloud projects'},
  {id:'upcoming_hack',name:'Ethical Hacking Basics',tag:'UPCOMING · Today, 7:30 PM',description:'A safe introduction to authorized testing and lab setup.',membersCount:52,activeNow:0,icon:'🔐',gradient:'from-rose-500 to-orange-500',topTopics:['Lab Safety','Recon','Ethics'],recentDropTitle:'Getting started with a local practice lab'},
  {id:'upcoming_react',name:'React Advanced Patterns',tag:'UPCOMING · Today, 8:30 PM',description:'Discuss composition, state boundaries, and reusable interface patterns.',membersCount:41,activeNow:0,icon:'⚛️',gradient:'from-cyan-500 to-purple-500',topTopics:['Composition','Hooks','State'],recentDropTitle:'When to extract a custom hook'},
];
