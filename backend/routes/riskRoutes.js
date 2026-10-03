const express = require('express');

const {
  getRisks,
  getRiskById,
  createRisk,
  updateRisk,
  deleteRisk,
} = require('../controllers/riskController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/:roadmapId', protect, getRisks);
router.get('/single/:id', protect, getRiskById);

router.post(
  '/',
  protect,
  authorize('ContentCreator', 'Admin'),
  createRisk
);

router.put(
  '/:id',
  protect,
  authorize('ContentCreator', 'Admin'),
  updateRisk
);

router.delete(
  '/:id',
  protect,
  authorize('ContentCreator', 'Admin'),
  deleteRisk
);

module.exports = router;