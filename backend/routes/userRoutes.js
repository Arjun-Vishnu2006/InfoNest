const express = require('express');
const { body } = require('express-validator');

const validate = require('../middleware/validate');

const {
  protect,
  authorize,
} = require('../middleware/auth');

const {
  getMyProfile,
  updateProfile,
  getUserById,
  searchUsers,
  listUsers,
  setUserStatus,
  getCreators,
  globalSearch,
} = require('../controllers/userController');

const router = express.Router();

// All user routes require authentication
router.use(protect);

// =====================================================
// CURRENT USER
// =====================================================

// View own profile
// IMPORTANT: This must come before /:id
router.get(
  '/me',
  getMyProfile
);

router.get('/search', searchUsers);
router.get('/creators', getCreators);
router.get('/global-search', globalSearch);

// =====================================================
// UPDATE PROFILE
// =====================================================

// Update own profile
router.put(
  '/profile',
  [
    body('name')
      .optional()
      .trim()
      .isLength({
        min: 2,
        max: 100,
      })
      .withMessage(
        'Name must be between 2 and 100 characters'
      ),

    body('expertiseArea')
      .optional()
      .trim()
      .isLength({
        max: 100,
      })
      .withMessage(
        'Expertise area cannot exceed 100 characters'
      ),

    body('profilePicture')
      .optional()
      .trim()
      .isURL()
      .withMessage(
        'Profile picture must be a valid URL'
      ),
  ],
  validate,
  updateProfile
);

// =====================================================
// ADMIN
// =====================================================

// Admin: list users
router.get(
  '/',
  authorize('Admin'),
  listUsers
);

// Admin: activate/deactivate user
router.patch(
  '/:id/status',
  authorize('Admin'),
  body('isActive')
    .isBoolean()
    .withMessage(
      'isActive must be a boolean'
    ),
  validate,
  setUserStatus
);

// =====================================================
// USER PROFILE
// =====================================================

// View user profile by ID
// This MUST remain after /me
router.get(
  '/:id',
  getUserById
);

module.exports = router;