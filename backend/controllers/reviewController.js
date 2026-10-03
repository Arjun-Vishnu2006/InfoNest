const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Roadmap = require('../models/Roadmap');
const User = require('../models/User');

const createReview = asyncHandler(async (req, res) => {
  const { roadmapId, rating, comment, completionPercentage } = req.body;

  const roadmap = await Roadmap.findOne({
    _id: roadmapId,
    status: 'published',
  });

  if (!roadmap) {
    res.status(404);
    throw new Error('Published roadmap not found');
  }

  const progress = Number(completionPercentage);
  if (!Number.isFinite(progress) || progress < 25 || progress > 100) {
    res.status(400);
    throw new Error('You must complete at least 25% of the roadmap before rating');
  }

  if (roadmap.creatorId.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot review your own roadmap');
  }

  const existingReview = await Review.findOne({
    reviewerId: req.user._id,
    roadmapId,
  });

  if (existingReview) {
    res.status(409);
    throw new Error('You have already reviewed this roadmap');
  }

  const review = await Review.create({
    reviewerId: req.user._id,
    roadmapId,
    rating,
    comment,
    completionPercentage: progress,
    isElite: progress >= 100,
  });

  await updateRoadmapRating(roadmapId);

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    data: review,
  });
});

const getRoadmapReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({
    roadmapId: req.params.roadmapId,
  })
    .populate('reviewerId', 'name profilePicture reputationScore')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (
    review.reviewerId.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to update this review');
  }

  if (req.body.rating !== undefined) {
    review.rating = req.body.rating;
  }

  if (req.body.comment !== undefined) {
    review.comment = req.body.comment;
  }

  await review.save();

  await updateRoadmapRating(review.roadmapId);

  res.json({
    success: true,
    message: 'Review updated successfully',
    data: review,
  });
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (
    review.reviewerId.toString() !== req.user._id.toString() &&
    req.user.role !== 'Admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  const roadmapId = review.roadmapId;

  await review.deleteOne();

  await updateRoadmapRating(roadmapId);

  res.json({
    success: true,
    message: 'Review deleted successfully',
  });
});

const updateRoadmapRating = async (roadmapId) => {
  const reviews = await Review.find({ roadmapId }).select('rating isElite');

  const reviewCount = reviews.length;
  const eliteReviewCount = reviews.filter((review) => review.isElite).length;

  // Elite Ratings stay inside the same overall score but receive slightly
  // higher weight because the learner completed the full roadmap.
  const totalWeight = reviews.reduce(
    (sum, review) => sum + (review.isElite ? 1.5 : 1),
    0
  );
  const weightedTotal = reviews.reduce(
    (sum, review) => sum + review.rating * (review.isElite ? 1.5 : 1),
    0
  );

  const averageRating = totalWeight
    ? Math.round((weightedTotal / totalWeight) * 100) / 100
    : 0;

  await Roadmap.findByIdAndUpdate(roadmapId, {
    averageRating,
    reviewCount,
    eliteReviewCount,
  });
};

const getUserReputation = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).select(
    'name reputationScore'
  );

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    data: {
      userId: user._id,
      name: user.name,
      reputationScore: user.reputationScore,
    },
  });
});

module.exports = {
  createReview,
  getRoadmapReviews,
  updateReview,
  deleteReview,
  getUserReputation,
};