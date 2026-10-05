import type { Course, Creator, NotificationItem, OrbitRoom, Post, Story, UserGoal } from '../types';

const names = ['Rahul Sharma', 'Ananya Nair', 'Kiran Raj', 'Meera Thomas', 'Arjun Menon', 'Aditya Kumar', 'Priya Nair', 'Rohan Joseph', 'Neha Thomas', 'Vivek Menon', 'Sneha Raj', 'Akash Kumar', 'Divya Iyer', 'Nikhil Das', 'Ishita Rao'];
const specialties = ['Cybersecurity', 'Full Stack Development', 'Cloud Security', 'Data Science', 'DevOps', 'Python', 'Web Development', 'Networking', 'Linux', 'Database Systems', 'Artificial Intelligence', 'Software Engineering', 'Cloud Computing', 'Application Security', 'Machine Learning'];

const portraitPalette = [
  ['#f2c6a0','#242039','#57c7e8'], ['#c98763','#241b30','#f0a5bd'], ['#e0a47c','#152b36','#80e1c1'],
  ['#f0c7a2','#432c28','#d8b4fe'], ['#9b6048','#171c34','#ffc66d'], ['#dba17d','#26354a','#6ee7d8'],
  ['#e9b08f','#33233e','#fb7185'], ['#c78361','#202638','#93c5fd'], ['#efc09a','#1c2930','#86efac'],
  ['#a76d53','#2f2534','#fda4af'], ['#efc6a3','#24243b','#a5b4fc'], ['#c98263','#192c32','#67e8f9'],
  ['#edb994','#402a29','#fdba74'], ['#9d624c','#22243a','#c4b5fd'], ['#f1c5a1','#27323c','#f9a8d4'],
];

const svgData = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

export const mockCreatorAvatar = (name: string, seed = 0) => {
  const index = Math.abs(seed) % portraitPalette.length;
  const [skin, hair, accent] = portraitPalette[index];
  const initials = name.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase();
  return svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="${accent}"/><stop offset="1" stop-color="${hair}"/></linearGradient></defs><rect width="240" height="240" rx="120" fill="url(#bg)"/><circle cx="120" cy="110" r="66" fill="${skin}"/><path d="M52 108c-7-54 21-83 67-83 45 0 75 32 69 83-18-24-40-35-68-35-26 0-49 12-68 35Z" fill="${hair}"/><path d="M39 240c7-49 37-75 81-75s75 26 82 75" fill="${accent}"/><circle cx="95" cy="112" r="5" fill="#342222"/><circle cx="145" cy="112" r="5" fill="#342222"/><path d="M103 139q17 12 34 0" fill="none" stroke="#8c4b42" stroke-width="4" stroke-linecap="round"/><text x="120" y="226" text-anchor="middle" font-family="Arial,sans-serif" font-size="19" font-weight="700" fill="white" fill-opacity=".85">${initials}</text></svg>`);
};

export const mockCreatorCover = (specialty: string, index: number) => {
  const colors = [['#312e81','#0891b2'],['#701a75','#be123c'],['#064e3b','#0e7490'],['#1e3a8a','#6d28d9']][index % 4];
  return svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="360" viewBox="0 0 960 360"><defs><linearGradient id="g"><stop stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient></defs><rect width="960" height="360" fill="#090b14"/><path d="M0 280 260 45l205 238L690 20l270 260v80H0Z" fill="url(#g)" opacity=".78"/><circle cx="790" cy="80" r="120" fill="#fff" opacity=".08"/><text x="42" y="322" font-family="Arial,sans-serif" font-size="26" font-weight="700" fill="#e2e8f0">${specialty.toUpperCase()}</text></svg>`);
};

export const demoCreators: Creator[] = names.map((name, i) => ({
  id: `demo_creator_${i + 1}`, username: name.toLowerCase().replace(/\s/g, '.'), name,
  handle: `@${name.toLowerCase().replace(/\s/g, '')}`, avatar: mockCreatorAvatar(name, i),
  coverImage: mockCreatorCover(specialties[i], i), role: specialties[i], specialty: specialties[i], bio: `${name.split(' ')[0]} helps learners build practical skills in ${specialties[i].toLowerCase()}.`,
  followersCount: [2840, 1960, 3410, 1580, 2210][i], followingCount: 140 + i * 17, studentCount: 820 + i * 93,
  totalLectures: 18 + i * 4, rating: 4.7 + (i % 3) / 10, isFollowed: true, verified: true,
  knowledgeTokens: 0, knowledgeScore: 900 + i * 130, expertiseTags: [specialties[i], 'Career Learning'], recentDropsCount: 3 + i,
  recentContent: [`${specialties[i]} field notes`, `A practical ${specialties[i]} walkthrough`],
}));

const thumbnailFor = (title: string, category: string, index: number) => {
  const colors = [['#4f46e5','#06b6d4'],['#7c3aed','#ec4899'],['#0f766e','#22c55e'],['#1d4ed8','#8b5cf6']][index % 4];
  const theme = category.toLowerCase();
  const motif = theme.includes('cyber') || theme.includes('security')
    ? `<path d="M770 126 850 155v70c0 64-37 108-80 132-43-24-80-68-80-132v-70Z" fill="none" stroke="#a5f3fc" stroke-width="12"/><path d="m736 222 24 24 46-50" fill="none" stroke="#a5f3fc" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`
    : theme.includes('web') || theme.includes('program') || theme.includes('software') || theme.includes('artificial') || theme.includes('data science')
    ? `<rect x="680" y="116" width="210" height="150" rx="18" fill="#0f172a" stroke="#a5f3fc" stroke-width="8"/><path d="M680 154h210" stroke="#a5f3fc" stroke-width="8"/><circle cx="704" cy="136" r="5" fill="#fb7185"/><circle cx="725" cy="136" r="5" fill="#fbbf24"/><path d="m725 194-22 22 22 22m60-44 22 22-22 22m-22-53-13 62" fill="none" stroke="#67e8f9" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`
    : theme.includes('cloud')
    ? `<path d="M706 254h150a52 52 0 0 0 4-104 79 79 0 0 0-151-9 58 58 0 0 0-3 113Z" fill="none" stroke="#bae6fd" stroke-width="12"/><path d="M780 184v82m-30-28 30 30 30-30" fill="none" stroke="#67e8f9" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`
    : theme.includes('database')
    ? `<ellipse cx="780" cy="142" rx="86" ry="32" fill="#1e3a8a" stroke="#a5f3fc" stroke-width="8"/><path d="M694 142v116c0 18 38 32 86 32s86-14 86-32V142m-172 58c0 18 38 32 86 32s86-14 86-32" fill="#1e3a8a" stroke="#a5f3fc" stroke-width="8"/>`
    : theme.includes('network') || theme.includes('linux')
    ? `<path d="M700 148 790 122l80 54-20 92-94 25-68-58Z" fill="none" stroke="#a5f3fc" stroke-width="8"/><path d="m700 148 56 87m34-113-34 113m114-59-114 59m94 33-94-33m-68 58 68-58" stroke="#67e8f9" stroke-width="7"/><g fill="#c4b5fd"><circle cx="700" cy="148" r="15"/><circle cx="790" cy="122" r="15"/><circle cx="870" cy="176" r="15"/><circle cx="850" cy="268" r="15"/><circle cx="756" cy="293" r="15"/></g>`
    : `<rect x="692" y="120" width="182" height="55" rx="10" fill="#0f172a" stroke="#a5f3fc" stroke-width="7"/><rect x="692" y="190" width="182" height="55" rx="10" fill="#0f172a" stroke="#a5f3fc" stroke-width="7"/><rect x="692" y="260" width="182" height="55" rx="10" fill="#0f172a" stroke="#a5f3fc" stroke-width="7"/><g fill="#34d399"><circle cx="720" cy="148" r="7"/><circle cx="720" cy="218" r="7"/><circle cx="720" cy="288" r="7"/></g>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient></defs><rect width="960" height="540" fill="#090b14"/><circle cx="790" cy="210" r="220" fill="url(#g)" opacity=".45"/><path d="M0 430 Q330 260 650 540 H0" fill="url(#g)" opacity=".35"/>${motif}<text x="56" y="110" fill="#a5f3fc" font-family="Arial,sans-serif" font-size="25" font-weight="700">${category.toUpperCase()}</text><text x="56" y="210" fill="white" font-family="Arial,sans-serif" font-size="43" font-weight="700">${title.replace(/[&<>"']/g,' ').slice(0,34)}</text><text x="56" y="480" fill="#cbd5e1" font-family="Arial,sans-serif" font-size="20">INFONEST LEARNING SERIES</text></svg>`;
  return svgData(svg);
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
  const progressSeeds: Record<number, { completed: number; total: number }> = {
    0: { completed: 17, total: 20 },
    5: { completed: 14, total: 24 },
    10: { completed: 18, total: 25 },
    15: { completed: 9, total: 22 },
    1: { completed: 12, total: 20 },
    2: { completed: 3, total: 20 },
  };
  const totalLessons = progressSeeds[i]?.total || 20;
  const completedLessons = progressSeeds[i]?.completed || 0;
  const progressPercent = Math.round(completedLessons / totalLessons * 100);
  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} full course ${creator.name}`)}`;
  const coverImage = thumbnailFor(title, category, i);
  return { id: `demo_course_${i + 1}`, title, subtitle: `A practical, project-led course in ${category.toLowerCase()} with guided exercises and real-world examples.`, description: `Build confidence in ${title.toLowerCase()} through focused lessons and hands-on practice.`, creator, level, category, rating: Number((4.6 + (i % 5) / 10).toFixed(1)), reviewsCount: 85 + i * 11, studentsCount: 720 + i * 137, estimatedHours: 4 + (i % 9), coverImage, thumbnail:coverImage, tags: [category, level], modules: [], whatYouWillLearn: ['Understand core concepts', 'Apply the skill in a guided project', 'Plan your next learning step'], requirements: ['Curiosity and a computer'], certificateAvailable: true, reviews: [], isEnrolled: i < 3, progressPercent, instructor:creator.name, learners:720 + i * 137, duration:`${4 + (i % 9)} hours`, difficulty:level, youtubeUrl, skills:[category, title.split(':')[0], 'Hands-on practice'], completedLessons, totalLessons };
});

export const demoGoals: UserGoal[] = [10, 5, 15, 0].map(index => {
  const course = demoCourses[index];
  return { id:`demo_goal_${course.id}`, courseId:course.id, title:course.title, roadmapTitle:course.title, category:course.category, instructor:course.instructor, description:course.description, status:'active', targetHoursPerWeek:6, loggedHoursThisWeek:0, targetCompletionDate:'Flexible', startDate:new Date().toISOString(), streakDays:0, completedTasks:course.completedLessons || 0, totalTasks:course.totalLessons || 20, completedLessons:course.completedLessons || 0, totalLessons:course.totalLessons || 20, progressPercent:course.progressPercent, weeklyHistory:[0,0,0,0,0,0,0] };
});

export const demoStories: Story[] = demoCreators.slice(0, 12).map((creator, index) => ({
  id:`demo_story_${index + 1}`, creatorId:creator.id, creator, title:['Quick Tip','Mini Lecture','Thought','Research'][index % 4] as Story['category'], category:['Quick Tip','Mini Lecture','Thought','Research'][index % 4] as Story['category'], categoryColor:'cyan', previewImage:thumbnailFor(`${creator.name} shares a learning tip`, creator.specialty, index), hasUnseen:true, timestamp:`${index + 1}h ago`, viewed:false,
  slides:[{id:`story_slide_${index+1}`,type:'tip',title:`${creator.specialty}: one useful habit`,content:`${creator.name.split(' ')[0]} recommends starting with a small, practical exercise in ${creator.specialty.toLowerCase()}, then writing down what you learned.`,bgGradient:['from-indigo-900 to-cyan-900','from-purple-900 to-rose-900','from-emerald-900 to-teal-900'][index % 3]}],
}));
export const demoUpdates = [
  { id:'update_1', title:'Cybersecurity Fundamentals is trending', description:'Learners are sharing practical threat-modeling notes this week.', source:'InfoNest Learning', timestamp:'12 min ago', category:'Trending', icon:'shield', accent:'from-emerald-500/20 to-cyan-500/10' },
  { id:'update_2', title:'New React learning resources added', description:'A fresh set of component and state-management guides is ready.', source:'Ananya Nair', timestamp:'28 min ago', category:'Web Development', icon:'code', accent:'from-violet-500/20 to-indigo-500/10' },
  { id:'update_3', title:'Cloud Security Workshop starts soon', description:'Join a practical session on IAM, network boundaries, and least privilege.', source:'InfoNest Events', timestamp:'45 min ago', category:'Live session', icon:'cloud', accent:'from-sky-500/20 to-cyan-500/10' },
  { id:'update_4', title:'Rahul Sharma published a backend tutorial', description:'Explore clear API boundaries with a guided Node.js example.', source:'Rahul Sharma', timestamp:'1 hr ago', category:'New resource', icon:'terminal', accent:'from-fuchsia-500/20 to-purple-500/10' },
  { id:'update_5', title:'Ananya Nair shared a frontend project guide', description:'Build a responsive interface from wireframe to working components.', source:'Ananya Nair', timestamp:'2 hrs ago', category:'Creator update', icon:'layers', accent:'from-pink-500/20 to-rose-500/10' },
  { id:'update_6', title:'127 learners joined Cybersecurity Fundamentals', description:'The course community is growing, with new study groups forming.', source:'InfoNest Community', timestamp:'3 hrs ago', category:'Community', icon:'users', accent:'from-amber-500/20 to-orange-500/10' },
  { id:'update_7', title:'New networking resources are available', description:'Review subnetting, packet flow, and troubleshooting in one collection.', source:'Kiran Raj', timestamp:'4 hrs ago', category:'Networking', icon:'network', accent:'from-blue-500/20 to-indigo-500/10' },
  { id:'update_8', title:'DevOps community session scheduled this week', description:'Bring your CI/CD questions for a friendly systems walkthrough.', source:'Meera Thomas', timestamp:'Today', category:'Community event', icon:'server', accent:'from-teal-500/20 to-emerald-500/10' },
  { id:'update_9', title:'Python Foundations practice lab is open', description:'Try a short exercise on clean functions and data handling.', source:'InfoNest Learning', timestamp:'Today', category:'Practice lab', icon:'code', accent:'from-cyan-500/20 to-blue-500/10' },
  { id:'update_10', title:'Database design discussion is active', description:'Learners are comparing practical schema choices for new projects.', source:'Vivek Menon', timestamp:'Today', category:'Discussion', icon:'database', accent:'from-purple-500/20 to-fuchsia-500/10' },
];
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
