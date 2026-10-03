const express = require('express');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/auth');
const { chatWithAI, getRecommendations, saveAIRoadmap, getProfileSuggestions } = require('../controllers/aiController');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 5, fileSize: 50 * 1024 * 1024 },
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many AI requests. Please try again later.' },
});

router.use(protect, aiLimiter);
router.post('/chat', upload.array('files', 5), chatWithAI);
router.get('/recommendations', getRecommendations);
router.post('/save-roadmap', saveAIRoadmap);
router.get('/profile-suggestions', getProfileSuggestions);

module.exports = router;
