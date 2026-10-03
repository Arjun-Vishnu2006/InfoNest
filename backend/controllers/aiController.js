const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Goal = require('../models/Goal');
const Roadmap = require('../models/Roadmap');
const Content = require('../models/Content');

const XAI_BASE_URL = 'https://api.x.ai/v1';
const MAX_MESSAGE_LENGTH = 6000;

const getXaiKey = () => {
  if (!process.env.XAI_API_KEY) {
    const error = new Error('XAI_API_KEY is not configured. Add it to backend/.env.');
    error.status = 503;
    throw error;
  }
  return process.env.XAI_API_KEY;
};

const extractOutputText = (payload) => {
  if (typeof payload?.output_text === 'string') return payload.output_text;
  const chunks = [];
  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === 'string') chunks.push(content.text);
    }
  }
  return chunks.join('\n').trim();
};

const callGrok = async ({ instructions, input, files = [] }) => {
  const apiKey = getXaiKey();
  const content = [{ type: 'input_text', text: input }];

  for (const file of files) {
    const uploadForm = new FormData();
    uploadForm.append('file', new Blob([file.buffer], { type: file.mimetype || 'application/octet-stream' }), file.originalname);

    const uploadResponse = await fetch(`${XAI_BASE_URL}/files`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: uploadForm,
    });

    if (!uploadResponse.ok) {
      const detail = await uploadResponse.text();
      throw new Error(`Grok file upload failed: ${detail.slice(0, 500)}`);
    }

    const uploaded = await uploadResponse.json();
    content.push({ type: 'input_file', file_id: uploaded.id });
  }

  const response = await fetch(`${XAI_BASE_URL}/responses`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.GROK_MODEL || 'grok-4.7',
      instructions,
      input: [{ role: 'user', content }],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    const error = new Error(`Grok API request failed: ${detail.slice(0, 700)}`);
    error.status = response.status >= 400 && response.status < 500 ? 502 : 503;
    throw error;
  }

  const payload = await response.json();
  return extractOutputText(payload) || 'I could not generate a response for that request.';
};

const buildUserContext = async (userId) => {
  const user = await User.findById(userId).select(
    'name role expertiseArea headline about skills education experience'
  ).lean();

  if (!user) throw new Error('User context could not be loaded.');

  const goals = await Goal.find({
    createdBy: userId,
    status: { $in: ['active', 'pending'] },
  })
    .sort({ updatedAt: -1 })
    .limit(10)
    .lean();

  const goalIds = goals.map((goal) => goal._id);
  const roadmaps = goalIds.length
    ? await Roadmap.find({ goalId: { $in: goalIds }, status: { $ne: 'removed' } })
        .populate('goalId', 'title category progressPercent completedHours targetCompletionDate')
        .populate('creatorId', 'name expertiseArea')
        .sort({ updatedAt: -1 })
        .limit(15)
        .lean()
    : [];

  const [candidateContent, candidateCreators] = await Promise.all([
    Content.find({ status: 'approved' })
      .select('title description contentType category creatorId createdAt')
      .populate('creatorId', 'name expertiseArea skills reputationScore')
      .sort({ createdAt: -1 })
      .limit(30)
      .lean(),
    User.find({ role: 'ContentCreator', isActive: true })
      .select('name expertiseArea headline skills reputationScore profilePicture')
      .sort({ reputationScore: -1, createdAt: -1 })
      .limit(20)
      .lean(),
  ]);

  return {
    user: {
      name: user.name,
      role: user.role,
      expertiseArea: user.expertiseArea,
      headline: user.headline,
      about: user.about,
      skills: user.skills || [],
      education: user.education,
      experience: user.experience,
    },
    goals: goals.map((goal) => ({
      id: String(goal._id),
      title: goal.title,
      category: goal.category,
      description: goal.description,
      progressPercent: goal.progressPercent,
      completedHours: goal.completedHours,
      targetHoursPerWeek: goal.targetHoursPerWeek,
      targetCompletionDate: goal.targetCompletionDate,
      streakDays: goal.streakDays,
    })),
    roadmaps: roadmaps.map((roadmap) => ({
      id: String(roadmap._id),
      goalId: String(roadmap.goalId?._id || roadmap.goalId),
      goalTitle: roadmap.goalId?.title || '',
      goalProgressPercent: roadmap.goalId?.progressPercent ?? 0,
      title: roadmap.title,
      description: roadmap.description,
      estimatedTimeline: roadmap.estimatedTimeline,
      steps: (roadmap.steps || []).map((step) => ({
        order: step.order,
        title: step.title,
        description: step.description,
        completed: Boolean(step.completed),
      })),
      challenges: roadmap.challenges,
      practicalTips: roadmap.practicalTips,
    })),
    availableContent: candidateContent.map((item) => ({
      id: String(item._id),
      title: item.title,
      description: item.description,
      contentType: item.contentType,
      category: item.category,
      creator: item.creatorId ? {
        id: String(item.creatorId._id),
        name: item.creatorId.name,
        expertiseArea: item.creatorId.expertiseArea,
        skills: item.creatorId.skills || [],
      } : null,
    })),
    availableCreators: candidateCreators.map((creator) => ({
      id: String(creator._id),
      name: creator.name,
      expertiseArea: creator.expertiseArea,
      headline: creator.headline,
      skills: creator.skills || [],
      reputationScore: creator.reputationScore,
    })),
  };
};

const contextText = (context) => `InfoNest private learner context for the authenticated user. Use it only to personalize this user's answer. Never reveal private fields or another user's private information.\n\n${JSON.stringify(context, null, 2)}`;

const chatWithAI = asyncHandler(async (req, res) => {
  const message = String(req.body?.message || '').trim();
  const files = Array.isArray(req.files) ? req.files : [];

  if (!message && files.length === 0) {
    res.status(400);
    throw new Error('Enter a message or attach a file.');
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    res.status(400);
    throw new Error(`Message cannot exceed ${MAX_MESSAGE_LENGTH} characters.`);
  }

  const context = await buildUserContext(req.user._id);
  const instructions = [
    'You are Cosmos AI, the InfoNest learning assistant powered by Grok.',
    'Answer general questions normally and clearly.',
    'You can create learning roadmaps, explain topics, suggest profile improvements, summarize attached learning material, and answer study questions.',
    'When the user asks about their learning, goals, roadmap, progress, next steps, content, or creators, use the supplied InfoNest context.',
    'When generating a roadmap, compare it with the user\'s existing active goals and linked roadmaps. Avoid blindly repeating the same path; explain when a new roadmap is a continuation, an alternative path, or a specialization.',
    'Treat goal progressPercent, completedHours, target dates, and completed roadmap steps as the current state. Do not invent progress.',
    'Recommendations must be grounded in the supplied database candidates. If no matching creators/content exist, say so and provide topic-level guidance instead of inventing database records.',
    'Do not modify the database from chat. Give suggestions for the user to approve.',
    contextText(context),
  ].join('\n\n');

  const answer = await callGrok({
    instructions,
    input: message || 'Analyze the attached learning material and explain the important points clearly for a student.',
    files: files.slice(0, 5),
  });

  res.status(200).json({
    success: true,
    data: {
      message: answer,
      files: files.map((file) => file.originalname),
      context: {
        activeGoals: context.goals.length,
        linkedRoadmaps: context.roadmaps.length,
      },
    },
  });
});

const getRecommendations = asyncHandler(async (req, res) => {
  const context = await buildUserContext(req.user._id);

  const instructions = [
    'You are the InfoNest recommendation engine powered by Grok.',
    'Use the authenticated user context and the available database candidates below.',
    'Return ONLY valid JSON. No markdown fences and no extra text.',
    'Schema: {"summary": string, "whatNext": [{"title": string, "reason": string}], "content": [{"id": string, "title": string, "reason": string}], "creators": [{"id": string, "name": string, "reason": string}], "goalInsights": [{"goalId": string, "goalTitle": string, "progressPercent": number, "nextStep": string, "reason": string}]}',
    'Only use content and creator IDs/names that exist in the supplied candidate lists. If there are no candidates, return empty arrays.',
    'What Next must consider active goals, goal progress, target dates, and linked roadmap steps. Prefer continuation of unfinished roadmap work before suggesting unrelated topics.',
    'If an existing roadmap already covers the same path, recommend the next unfinished step or a clearly justified specialization rather than recreating the same roadmap.',
    'Do not expose private data in the recommendation text.',
    contextText(context),
  ].join('\n\n');

  const raw = await callGrok({
    instructions,
    input: 'Generate the latest personalized InfoNest recommendations from the current database context.',
  });

  let recommendations;
  try {
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    recommendations = JSON.parse(cleaned);
  } catch {
    recommendations = {
      summary: raw,
      whatNext: [],
      content: [],
      creators: [],
      goalInsights: [],
    };
  }

  res.status(200).json({
    success: true,
    data: {
      recommendations,
      generatedAt: new Date().toISOString(),
      context: {
        activeGoals: context.goals.length,
        linkedRoadmaps: context.roadmaps.length,
        availableContent: context.availableContent.length,
        availableCreators: context.availableCreators.length,
      },
    },
  });
});

const saveAIRoadmap = asyncHandler(async (req, res) => {
  const { goalId, title, description, steps, estimatedTimeline, challenges, practicalTips } = req.body;

  if (!goalId || !title || !description) {
    res.status(400);
    throw new Error('goalId, title, and description are required.');
  }

  const goal = await Goal.findOne({ _id: goalId, createdBy: req.user._id });
  if (!goal) {
    res.status(404);
    throw new Error('Goal not found or does not belong to you.');
  }

  const roadmap = await Roadmap.create({
    goalId,
    creatorId: req.user._id,
    title,
    description,
    steps: Array.isArray(steps) ? steps.map((s, i) => ({
      order: s.order || i + 1,
      title: s.title || `Step ${i + 1}`,
      description: s.description || '',
      completed: false,
    })) : [],
    estimatedTimeline: estimatedTimeline || '',
    challenges: challenges || '',
    practicalTips: practicalTips || '',
    status: 'published',
  });

  res.status(201).json({
    success: true,
    message: 'AI-generated roadmap saved successfully.',
    data: { roadmap },
  });
});

const getProfileSuggestions = asyncHandler(async (req, res) => {
  const context = await buildUserContext(req.user._id);

  const instructions = [
    'You are the InfoNest profile improvement advisor powered by Grok.',
    'Analyze the user profile below and suggest specific, actionable improvements.',
    'Return ONLY valid JSON. No markdown fences and no extra text.',
    'Schema: {"suggestions": [{"category": string, "suggestion": string, "priority": "high"|"medium"|"low"}], "completenessScore": number, "summary": string}',
    'Categories can be: "skills", "headline", "about", "education", "experience", "interests", "goals"',
    'Do NOT suggest adding fake information. Suggest relevant areas the user could fill in or improve.',
    'completenessScore should be 0-100 based on how filled out the profile is.',
    contextText(context),
  ].join('\n\n');

  const raw = await callGrok({
    instructions,
    input: 'Analyze my InfoNest profile and suggest improvements.',
  });

  let suggestions;
  try {
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    suggestions = JSON.parse(cleaned);
  } catch {
    suggestions = {
      summary: raw,
      suggestions: [],
      completenessScore: 0,
    };
  }

  res.status(200).json({
    success: true,
    data: { suggestions },
  });
});

module.exports = { chatWithAI, getRecommendations, saveAIRoadmap, getProfileSuggestions };
