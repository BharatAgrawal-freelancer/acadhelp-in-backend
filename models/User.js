import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  provider: {
    type: String,
    enum: ["google", "form"],
  },

  providerId: {
    type: String,
  },

  isverified: {
    type: Boolean,
    default: false,
  },

  password: String,

  name: String,

  email: {
    type: String,
    unique: true,
    required: true,
  },

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    unique: true,
  },

  profilePhoto: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
