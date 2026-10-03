const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      match: [/^\+?[0-9]{10,15}$/, 'Please provide a valid phone number'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Please provide a valid email address',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: ['Learner', 'ContentCreator', 'Admin'],
      default: 'Learner',
    },

    expertiseArea: {
      type: String,
      trim: true,
      maxlength: 100,
      default: '',
    },

    headline: { type: String, trim: true, maxlength: 160, default: '' },
    location: { type: String, trim: true, maxlength: 120, default: '' },
    about: { type: String, trim: true, maxlength: 1200, default: '' },
    linkedinUrl: { type: String, trim: true, maxlength: 300, default: '' },
    skills: { type: [String], default: [] },
    education: { type: String, trim: true, maxlength: 500, default: '' },
    experience: { type: String, trim: true, maxlength: 1000, default: '' },
    certificates: {
      type: [{
        name: { type: String, trim: true, maxlength: 160 },
        issuer: { type: String, trim: true, maxlength: 160, default: '' },
        issuedDate: { type: String, trim: true, maxlength: 40, default: '' },
        fileName: { type: String, trim: true, maxlength: 255, default: '' },
        fileType: { type: String, trim: true, maxlength: 120, default: '' },
        fileData: { type: String, default: '' },
      }],
      default: [],
    },

    reputationScore: {
      type: Number,
      default: 0,
      min: 0,
    },

    profilePicture: {
      type: String,
      trim: true,
      default: '',
    },

    bookmarkedRoadmaps: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roadmap',
      },
    ],

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    refreshTokens: {
      type: [String],
      default: [],
      select: false,
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare plain password with hashed password
userSchema.methods.comparePassword = async function comparePassword(
  candidatePassword
) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields from JSON responses
userSchema.methods.toJSON = function toSafeObject() {
  const obj = this.toObject();

  delete obj.password;
  delete obj.refreshTokens;
  delete obj.__v;

  return obj;
};

module.exports = mongoose.model('User', userSchema);