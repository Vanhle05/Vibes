const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: { type: Number, required: true },
  method: { type: String, default: 'bank' },
  transferContent: { type: String }, // nội dung chuyển khoản
  billImageUrl: { type: String },    // ảnh bill upload
  orderCode: { type: Number, unique: true, sparse: true }, // For PayOS/Automated
  externalRef: { type: String }, // ID giao dịch từ cổng thanh toán
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected'],
    default: 'pending'
  },
  note: { type: String, default: '' },
  confirmedAt: { type: Date },
  confirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
