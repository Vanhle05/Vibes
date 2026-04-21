const User = require('../models/User');
const Profile = require('../models/Profile');
const Payment = require('../models/Payment');

/**
 * FulfillmentService - Xử lý tự động sau khi thanh toán thành công
 */
class FulfillmentService {
  /**
   * Kích hoạt tài khoản và triển khai hạ tầng (Identity Provisioning)
   * @param {string} userId - ID của người dùng cần kích hoạt
   * @param {Object} paymentData - Thông tin giao dịch từ Webhook
   */
  static async execute(userId, paymentData) {
    try {
      console.log(`[Fulfillment] Bắt đầu xử lý cho User: ${userId}`);

      // 1. Cập nhật trạng thái User
      const user = await User.findByIdAndUpdate(
        userId,
        { 
          isActive: true, 
          isPaid: true,
          paymentStatus: 'confirmed'
        },
        { new: true }
      );

      if (!user) throw new Error('Không tìm thấy người dùng');

      // 2. Kiểm tra và tự động khởi tạo Profile (Clone Template)
      let profile = await Profile.findOne({ user: userId });
      if (!profile) {
        profile = await Profile.create({
          user: userId,
          displayName: user.name,
          email: user.email,
          theme: 'dark', // Template mặc định
          isPublished: true,
          tagline: 'Chào mừng bạn đến với định danh mới của tôi!'
        });
        console.log(`[Fulfillment] Đã tự động tạo Profile cho ${user.name}`);
      } else {
        // Nếu đã có profile, cập nhật trạng thái công khai
        profile.isPublished = true;
        await profile.save();
      }

      console.log(`[Fulfillment] Kích hoạt thành công cho: ${user.email}`);
      return { success: true, user, profile };
    } catch (err) {
      console.error(`[Fulfillment Error] ${err.message}`);
      throw err;
    }
  }
}

module.exports = FulfillmentService;
