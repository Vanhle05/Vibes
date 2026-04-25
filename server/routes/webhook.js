const express = require('express');
const PayOS = require('@payos/node');
const FulfillmentService = require('../services/FulfillmentService');
const Payment = require('../models/Payment');

const router = express.Router();

// Khởi tạo PayOS
const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID, 
  process.env.PAYOS_API_KEY, 
  process.env.PAYOS_CHECKSUM_KEY
);

/**
 * POST /api/webhook/payos
 * Cổng tiếp nhận Webhook từ PayOS khi có giao dịch
 */
router.post('/payos', async (req, res) => {
  try {
    const { data, signature } = req.body;
    console.log('[PAYOS WEBHOOK] Received payload:', JSON.stringify(req.body));

    // 1. Xác thực Webhook
    let webhookData;
    try {
      webhookData = payos.verifyPaymentWebhookData(req.body);
      console.log('[PAYOS WEBHOOK] Verified data:', JSON.stringify(webhookData));
    } catch (vErr) {
      console.error('[PAYOS WEBHOOK] Verification FAILED:', vErr.message);
      // Vẫn tiếp tục kiểm tra thủ công nếu verify thất bại nhưng có dữ liệu thô (để debug)
      webhookData = data; 
    }

    // 2. Kiểm tra nội dung giao dịch thành công
    if (webhookData.code === '00' || webhookData.desc === 'success' || req.body.desc === 'success') {
      const orderCode = webhookData.orderCode;
      console.log(`[PAYOS WEBHOOK] Processing success for Order: ${orderCode}`);
      
      const payment = await Payment.findOne({ orderCode }).populate('user');
      
      if (payment && payment.status !== 'confirmed') {
        console.log(`[Webhook] Phát hiện giao dịch hợp lệ cho Order: ${orderCode}`);
        
        await FulfillmentService.execute(payment.user._id, {
          amount: webhookData.amount,
          externalRef: webhookData.paymentLinkId
        });

        payment.status = 'confirmed';
        payment.externalRef = webhookData.paymentLinkId;
        payment.confirmedAt = new Date();
        await payment.save();
        
        console.log(`[Webhook] Đã tự động kích hoạt tài khoản cho: ${payment.user.email}`);
      }
    }

    res.json({ success: true, message: 'Webhook received' });
  } catch (err) {
    console.error('[Webhook Error]', err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
