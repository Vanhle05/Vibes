const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập họ tên'],
    trim: true,
    maxlength: [100, 'Tên không được vượt quá 100 ký tự']
  },
  email: {
    type: String,
    required: [true, 'Vui lòng nhập email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']
  },
  password: {
    type: String,
    required: [true, 'Vui lòng nhập mật khẩu'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  loginMethod: {
    type: String,
    enum: ['vibes', 'google', 'facebook'],
    default: 'vibes'
  },
  isActive: {
    type: Boolean,
    default: function() {
      return this.role === 'admin';
    }
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paymentStatus: {
    type: String,
    enum: ['none', 'pending', 'confirmed'],
    default: 'none'
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    match: [/^[a-z0-9_-]{3,30}$/, 'Username chỉ được chứa chữ thường, số, dấu gạch ngang hoặc gạch dưới, 3-30 ký tự']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ']
  },
  cccd: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    match: [/^[0-9]{12}$/, 'CCCD phải là 12 chữ số']
  },
  gender: {
    type: String,
    enum: ['Nam', 'Nữ', 'Khác']
  },
  birthYear: {
    type: Number
  },
  desire: {
    type: String,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
