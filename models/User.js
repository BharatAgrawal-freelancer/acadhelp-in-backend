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

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
