const asyncHandler = require('express-async-handler');
const Risk = require('../models/Risk');
const Roadmap = require('../models/Roadmap');

// Get risks for a roadmap
const getRisks = asyncHandler(async (req, res) => {
  const risks = await Risk.find({
    roadmapId: req.params.roadmapId,
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: risks.length,
    data: risks,
  });
});

// Get one risk
const getRiskById = asyncHandler(async (req, res) => {
  const risk = await Risk.findById(req.params.id);

  if (!risk) {
    res.status(404);
    throw new Error('Risk not found');
  }

  res.json({
    success: true,
    data: risk,
  });
});

// Create risk
const createRisk = asyncHandler(async (req, res) => {
  const { roadmapId, description, severity, mitigation } = req.body;

  const roadmap = await Roadmap.findById(roadmapId);

  if (!roadmap) {
    res.status(404);
    throw new Error('Roadmap not found');
  }

  if (
    req.user.role !== 'Admin' &&
    roadmap.creatorId.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to add risks to this roadmap');
  }

  const risk = await Risk.create({
    roadmapId,
    description,
    severity,
    mitigation,
  });

  res.status(201).json({
    success: true,
    message: 'Risk created successfully',
    data: risk,
  });
});

// Update risk
const updateRisk = asyncHandler(async (req, res) => {
  const risk = await Risk.findById(req.params.id);

  if (!risk) {
    res.status(404);
    throw new Error('Risk not found');
  }

  const roadmap = await Roadmap.findById(risk.roadmapId);

  if (!roadmap) {
    res.status(404);
    throw new Error('Roadmap not found');
  }

  if (
    req.user.role !== 'Admin' &&
    roadmap.creatorId.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to update this risk');
  }

  const { description, severity, mitigation } = req.body;

  if (description !== undefined) risk.description = description;
  if (severity !== undefined) risk.severity = severity;
  if (mitigation !== undefined) risk.mitigation = mitigation;

  await risk.save();

  res.json({
    success: true,
    message: 'Risk updated successfully',
    data: risk,
  });
});

// Delete risk
const deleteRisk = asyncHandler(async (req, res) => {
  const risk = await Risk.findById(req.params.id);

  if (!risk) {
    res.status(404);
    throw new Error('Risk not found');
  }

  const roadmap = await Roadmap.findById(risk.roadmapId);

  if (!roadmap) {
    res.status(404);
    throw new Error('Roadmap not found');
  }

  if (
    req.user.role !== 'Admin' &&
    roadmap.creatorId.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this risk');
  }

  await risk.deleteOne();

  res.json({
    success: true,
    message: 'Risk deleted successfully',
  });
});

module.exports = {
  getRisks,
  getRiskById,
  createRisk,
  updateRisk,
  deleteRisk,
};