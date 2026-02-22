import mongoose from "mongoose";
import User from "../../models/User.js";
import PaidContent from "../../models/paidContentModel.js";

export const addDiscountPurchase = async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      contentId,
      validity,
      paymentId,
      purchasedAt
    } = req.body;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Content ID"
      });
    }

    // ✅ Check User
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // ✅ Check Paid Content
    const content = await PaidContent.findById(contentId);
    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Paid Content not found"
      });
    }

    // ✅ Prevent duplicate purchase
    const alreadyPurchased = user.purchasedContents.find(
      (item) => item.contentId.toString() === contentId
    );

    if (alreadyPurchased) {
      return res.status(400).json({
        success: false,
        message: "Content already purchased by user"
      });
    }

    // ✅ Push into purchasedContents
    user.purchasedContents.push({
      contentId,
      validity: validity || "infinite",
      paymentId,
      purchasedAt: purchasedAt || new Date()
    });

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Content added successfully via discount",
      purchasedContents: user.purchasedContents
    });

  } catch (error) {
    console.error("DISCOUNT PURCHASE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};