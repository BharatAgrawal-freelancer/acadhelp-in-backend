import razorpayInstance from "../config/razorpay.js";
import PaidContent from "../models/paidContentModel.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import crypto from "crypto";

export const createOrder = async (req, res) => {
  try {
    const { contentId } = req.body;
    const userId = req.userId;

    // ✅ 0. Find User
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ 1. Check if content already purchased
    const alreadyBought = user.purchasedContents.some(
      (item) => item.contentId.toString() === contentId.toString()
    );

    if (alreadyBought) {
      return res.status(400).json({
        success: false,
        message:
          "✅ You already bought this package. Please go to dashboard.",
      });
    }

    // ✅ 2. Find Content
    const content = await PaidContent.findById(contentId);

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // ✅ 3. Create Razorpay Order
    const order = await razorpayInstance.orders.create({
      amount: content.price * 100,
      currency: "INR",
      receipt: `rcpt_${contentId.slice(-6)}_${Date.now()}`,
    });

    // ✅ 4. Save Payment Entry
    const payment = await Payment.create({
      userId,
      contentId,
      razorpayOrderId: order.id,
      amount: content.price,
      status: "PENDING",
    });

    res.json({
      success: true,
      order,
      paymentId: payment._id,
      content,
    });
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ message: "Order creation failed" });
  }
};




export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentDbId,
    } = req.body;

    // 1. Generate Signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // 2. Update Payment Status
    const payment = await Payment.findById(paymentDbId);

    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = "SUCCESS";
    await payment.save();

    // 3. Add Content to User Purchased Array
    await User.findByIdAndUpdate(payment.userId, {
      $push: {
        purchasedContents: {
          contentId: payment.contentId,
          paymentId: razorpayPaymentId,
          validity: "infinite",
        },
      },
    });

    res.json({
      success: true,
      message: "Payment verified & content unlocked!",
    });
  } catch (error) {
    console.error("Verify Error:", error);
    res.status(500).json({ message: "Payment verification error" });
  }
};
