import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  provider: {
    type: String,
    enum: ["google", "form"],
  },

  providerId: {
    type: String,
  },

  mobile: {
    type: String,
    unique: true,
    sparse: true,
    match: /^[0-9]{10}$/,
  },

  isverified: {
    type: Boolean,
    default: false,
  },

  password: String,

  email: {
    type: String,
    unique: true,
    required: true,
  },

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    unique: true,
    default: null,
    sparse: true,
  },

  profilePhoto: String,

  /* ✅ Purchased Paid Contents Array */
  purchasedContents: [
    {
      // Specific Purchase Record ID (auto generated)
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
      },

      // Validity of Access
      validity: {
        type: String,
        default: "infinite", // or "30days", "1year"
      },

      // Content Reference (PaidContent ID)
      contentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaidContent",
        required: true,
      },

      // Payment Transaction ID
      paymentId: {
        type: String,
        required: true,
      },

      // Date when purchased
      purchasedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
