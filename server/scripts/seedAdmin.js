const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Profile = require('../models/Profile');

const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🚀 Đang kết nối tới MongoDB Atlas...');

    const adminEmail = 'Vanhlenorthside@gmail.com';
    const adminPass = 'Vietanh20042005';
    const adminName = 'Vanh Lê Admin';

    // Xóa user cũ nếu trùng email để tránh lỗi duplicate
    await User.findOneAndDelete({ email: adminEmail });
    await Profile.findOneAndDelete({ email: adminEmail });

    // Tạo Admin mới
    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPass,
      role: 'admin',
      isActive: true, // Auto-active
      isPaid: true
    });

    // Tạo Profile mặc định cho Admin
    await Profile.create({
      user: admin._id,
      email: admin.email,
      displayName: admin.name,
      bio: 'Admin của hệ thống Vibes Identity Platform'
    });

    console.log('✅ Đã khởi tạo thành công tài khoản Admin!');
    console.log('📧 Email: ' + adminEmail);
    console.log('🔑 Password: ' + adminPass);

    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi khởi tạo:', err.message);
    process.exit(1);
  }
};

seedAdmin();
