const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  displayName: { type: String, default: '' },
  tagline: { type: String, default: '' },
  bio: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  location: { type: String, default: '' },
  avatar: { type: String, default: '' },
  coverColor: { type: String, default: '#6366f1' },
  templateId: { type: Number, default: 0 },
  templateConfig: { type: Object, default: {} },
  theme: { type: String, enum: ['dark', 'light', 'neon', 'ocean', 'sunset'], default: 'dark' },
  socials: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    twitter: { type: String, default: '' },
    website: { type: String, default: '' },
  },
  skills: [{ type: String }],
  viewCount: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
