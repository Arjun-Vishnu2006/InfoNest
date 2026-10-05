import type { Course, Creator, NotificationItem, OrbitRoom, Post, Story, UserGoal } from '../types';

const names = ['Rahul Sharma', 'Ananya Nair', 'Kiran Raj', 'Meera Thomas', 'Arjun Menon', 'Aditya Kumar', 'Priya Nair', 'Rohan Joseph', 'Neha Thomas', 'Vivek Menon', 'Sneha Raj', 'Akash Kumar', 'Divya Iyer', 'Nikhil Das', 'Ishita Rao'];
const specialties = ['Cybersecurity', 'Full Stack Development', 'Cloud Security', 'Data Science', 'DevOps', 'Python', 'Web Development', 'Networking', 'Linux', 'Database Systems', 'Artificial Intelligence', 'Software Engineering', 'Cloud Computing', 'Application Security', 'Machine Learning'];
export const demoCreators: Creator[] = names.map((name, i) => ({
  id: `demo_creator_${i + 1}`, username: name.toLowerCase().replace(/\s/g, '.'), name,
  handle: `@${name.toLowerCase().replace(/\s/g, '')}`, avatar: '/infonest-logo.png',
  coverImage: '/infonest-logo.png', role: specialties[i], specialty: specialties[i], bio: `${name.split(' ')[0]} helps learners build practical skills in ${specialties[i].toLowerCase()}.`,
  followersCount: [2840, 1960, 3410, 1580, 2210][i], followingCount: 140 + i * 17, studentCount: 820 + i * 93,
  totalLectures: 18 + i * 4, rating: 4.7 + (i % 3) / 10, isFollowed: true, verified: true,
  knowledgeTokens: 0, knowledgeScore: 900 + i * 130, expertiseTags: [specialties[i], 'Career Learning'], recentDropsCount: 3 + i,
  recentContent: [`${specialties[i]} field notes`, `A practical ${specialties[i]} walkthrough`],
}));

const thumbnailFor = (title: string, category: string, index: number) => {
  const colors = [['#4f46e5','#06b6d4'],['#7c3aed','#ec4899'],['#0f766e','#22c55e'],['#1d4ed8','#8b5cf6']][index % 4];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient></defs><rect width="960" height="540" fill="#090b14"/><circle cx="760" cy="100" r="240" fill="url(#g)" opacity=".55"/><path d="M0 430 Q330 260 650 540 H0" fill="url(#g)" opacity=".35"/><text x="56" y="110" fill="#a5f3fc" font-family="Arial,sans-serif" font-size="25" font-weight="700">${category.toUpperCase()}</text><text x="56" y="210" fill="white" font-family="Arial,sans-serif" font-size="43" font-weight="700">${title.replace(/[&<>"']/g,' ').slice(0,34)}</text><text x="56" y="480" fill="#cbd5e1" font-family="Arial,sans-serif" font-size="20">INFONEST LEARNING SERIES</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const catalog = [
  ['Programming','Python Foundations for Engineers'],['Programming','Modern JavaScript: From Core to Craft'],['Programming','TypeScript in Production'],['Programming','Go for Backend Services'],['Programming','Java and Spring Boot Essentials'],
  ['Web Development','React Applications from Zero to Launch'],['Web Development','Advanced React Patterns'],['Web Development','Accessible Web Interfaces'],['Web Development','Node.js APIs with Express'],['Web Development','Next.js Full Stack Workshop'],
  ['Cybersecurity','Cybersecurity Fundamentals'],['Cybersecurity','Web Application Security'],['Cybersecurity','Ethical Hacking Basics'],['Cybersecurity','Practical Burp Suite'],['Cybersecurity','Security Operations and Incident Response'],
  ['Cloud Computing','AWS Architecture Essentials'],['Cloud Computing','Azure Cloud Administration'],['Cloud Computing','Google Cloud for Developers'],['Cloud Computing','Cloud Security Workshop'],['Cloud Computing','Serverless Systems Design'],
  ['Data Science','Data Analysis with Python'],['Data Science','Statistics for Data Practitioners'],['Data Science','Data Visualization with Tableau'],['Data Science','Feature Engineering in Practice'],['Data Science','Applied SQL for Analytics'],
  ['Artificial Intelligence','Machine Learning Foundations'],['Artificial Intelligence','Building with Large Language Models'],['Artificial Intelligence','Responsible AI Systems'],['Artificial Intelligence','Computer Vision with PyTorch'],['Artificial Intelligence','Practical NLP'],
  ['Database','PostgreSQL Performance Tuning'],['Database','MongoDB Application Design'],['Database','Redis for Real-Time Apps'],['Database','Database Modeling Fundamentals'],['Database','Introduction to Distributed Data'],
  ['DevOps','Docker and Container Workflows'],['DevOps','Kubernetes for Application Teams'],['DevOps','CI/CD with GitHub Actions'],['DevOps','Infrastructure as Code with Terraform'],['DevOps','Observability with OpenTelemetry'],
  ['Networking','TCP/IP for Software Engineers'],['Networking','Network Troubleshooting Lab'],['Networking','Practical Routing and Switching'],['Networking','Zero Trust Network Design'],['Linux','Linux Fundamentals for Developers'],
  ['Software Engineering','System Design Interview Practice'],['Software Engineering','Clean Code and Refactoring'],['Software Engineering','Testing Reliable Web Services'],['Software Engineering','Software Architecture Essentials'],['Software Engineering','Agile Delivery for Engineers'],
];
export const demoCourses: Course[] = catalog.map(([category, title], i) => {
  const creator = demoCreators[i % demoCreators.length];
  const level = (['Beginner','Intermediate','Advanced'] as const)[i % 3];
  const totalLessons = 20;
  const completedLessons = i === 0 ? 8 : i === 1 ? 12 : i === 2 ? 3 : 0;
  const progressPercent = Math.round(completedLessons / totalLessons * 100);
  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} full course ${creator.name}`)}`;
  const coverImage = thumbnailFor(title, category, i);
  return { id: `demo_course_${i + 1}`, title, subtitle: `A practical, project-led course in ${category.toLowerCase()} with guided exercises and real-world examples.`, description: `Build confidence in ${title.toLowerCase()} through focused lessons and hands-on practice.`, creator, level, category, rating: Number((4.6 + (i % 5) / 10).toFixed(1)), reviewsCount: 85 + i * 11, studentsCount: 720 + i * 137, estimatedHours: 4 + (i % 9), coverImage, thumbnail:coverImage, tags: [category, level], modules: [], whatYouWillLearn: ['Understand core concepts', 'Apply the skill in a guided project', 'Plan your next learning step'], requirements: ['Curiosity and a computer'], certificateAvailable: true, reviews: [], isEnrolled: i < 3, progressPercent, instructor:creator.name, learners:720 + i * 137, duration:`${4 + (i % 9)} hours`, difficulty:level, youtubeUrl, skills:[category, title.split(':')[0], 'Hands-on practice'], completedLessons, totalLessons };
});

export const demoGoals: UserGoal[] = [10, 5, 18].map(index => {
  const course = demoCourses[index];
  return { id:`demo_goal_${course.id}`, courseId:course.id, title:course.title, roadmapTitle:course.title, category:course.category, instructor:course.instructor, description:course.description, status:'active', targetHoursPerWeek:6, loggedHoursThisWeek:0, targetCompletionDate:'Flexible', startDate:new Date().toISOString(), streakDays:0, completedTasks:course.completedLessons || 0, totalTasks:course.totalLessons || 20, completedLessons:course.completedLessons || 0, totalLessons:course.totalLessons || 20, progressPercent:course.progressPercent, weeklyHistory:[0,0,0,0,0,0,0] };
});

export const demoStories: Story[] = demoCreators.slice(0, 12).map((creator, index) => ({
  id:`demo_story_${index + 1}`, creatorId:creator.id, creator, title:['Quick Tip','Mini Lecture','Thought','Research'][index % 4] as Story['category'], category:['Quick Tip','Mini Lecture','Thought','Research'][index % 4] as Story['category'], categoryColor:'cyan', previewImage:thumbnailFor(`${creator.name} shares a learning tip`, creator.specialty, index), hasUnseen:true, timestamp:`${index + 1}h ago`, viewed:false,
  slides:[{id:`story_slide_${index+1}`,type:'tip',title:`${creator.specialty}: one useful habit`,content:`${creator.name.split(' ')[0]} recommends starting with a small, practical exercise in ${creator.specialty.toLowerCase()}, then writing down what you learned.`,bgGradient:['from-indigo-900 to-cyan-900','from-purple-900 to-rose-900','from-emerald-900 to-teal-900'][index % 3]}],
}));
export const demoPosts: Post[] = [
  {id:'demo_post_1',creatorId:demoCreators[0].id,creator:demoCreators[0],type:'knowledge',dropTypeLabel:'SECURITY NOTE',title:'A practical first pass at web security',caption:'Start with the basics: map the trust boundaries, validate input on the server, and make session handling explicit. What security check do you add to every review?',tags:['#Cybersecurity','#WebSecurity'],createdAt:'Today',likesCount:86,commentsCount:12,bookmarksCount:24,sharesCount:8,isLiked:false,isBookmarked:true,reactions:{insightful:20,useful:32,mindOpening:10,practical:24,like:86}},
  {id:'demo_post_2',creatorId:demoCreators[1].id,creator:demoCreators[1],type:'thought',dropTypeLabel:'BUILD NOTE',title:'Small components make better system boundaries',caption:'A component should make one piece of behavior easier to understand. When it needs a long explanation, it may be carrying too many responsibilities.',tags:['#React','#SoftwareEngineering'],createdAt:'Yesterday',likesCount:54,commentsCount:7,bookmarksCount:15,sharesCount:5,isLiked:false,isBookmarked:false,reactions:{insightful:19,useful:20,mindOpening:8,practical:7,like:54}},
  {id:'demo_post_3',creatorId:demoCreators[2].id,creator:demoCreators[2],type:'knowledge',dropTypeLabel:'CLOUD GUIDE',title:'Three cloud IAM habits worth keeping',caption:'Prefer short-lived credentials, scope permissions to the task, and review access after a project changes. These habits make least privilege easier to maintain.',tags:['#CloudComputing','#IAM'],createdAt:'2 days ago',likesCount:71,commentsCount:9,bookmarksCount:29,sharesCount:11,isLiked:false,isBookmarked:true,reactions:{insightful:20,useful:25,mindOpening:9,practical:17,like:71}},
];
export const demoNotifications: NotificationItem[] = [
  {id:'demo_notice_1',category:'social',title:'New message from Ananya',description:'I shared the React patterns notes we discussed.',timestamp:'Today, 10:42 AM',read:false,avatar:demoCreators[1].avatar,actionUrl:'/messages'},
  {id:'demo_notice_2',category:'learning',title:'Your weekly learning check-in',description:'You have logged 10.7 hours across your active goals this week.',timestamp:'Today, 9:15 AM',read:true,actionUrl:'/goals'},
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
