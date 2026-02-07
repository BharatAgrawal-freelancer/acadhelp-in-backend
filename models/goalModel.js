import mongoose from "mongoose";

const { Schema, Types } = mongoose;

/* ----------------------------------------
   DAILY GOAL TRACKING SCHEMA
   date + questions solved that day
-----------------------------------------*/
const DailyGoalSchema = new Schema(
  {
    date: {
      type: Date,
      required: true
    },

    totalQuestions: {
      type: Number,
      default: 0
    }
  },
  { _id: false }
);

/* ----------------------------------------
   MAIN GOAL MODEL
-----------------------------------------*/
const GoalSchema = new Schema(
  {
    // ✅ Link Goal with User
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    /* ----------------------------------------
       TARGETS (Planned Goals)
    -----------------------------------------*/
    targets: {
      daily: {
        type: Number,
        default: 0
      },

      weekly: {
        type: Number,
        default: 0
      },

      monthly: {
        type: Number,
        default: 0
      },

      yearly: {
        type: Number,
        default: 0
      }
    },

    /* ----------------------------------------
       DAILY PROGRESS LOG
       Each day: date + total questions solved
    -----------------------------------------*/
    dailyProgress: [DailyGoalSchema]
  },
  {
    timestamps: true
  }
);

/* ----------------------------------------
   EXPORT MODEL
-----------------------------------------*/
const Goal = mongoose.model("Goal", GoalSchema);

export default Goal;
