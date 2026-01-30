import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const ExamBatchSchema = new Schema(
  {
    examId: {
      type: Types.ObjectId,
      ref: "Exam",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    code: {
      type: String,
      required: true,
      uppercase: true
    },

    year: {
      type: Number
    },

    shift: {
      type: String,
      enum: ["Morning", "Evening"]
    },

    mode: {
      type: String,
      enum: ["CBT", "PEN_PAPER"],
      default: "CBT"
    },

    totalMarks: {
      type: Number,
      required: true
    },

    durationMinutes: {
      type: Number,
      required: true
    },

    markingScheme: {
      correct: {
        type: Number,
        required: true
      },
      incorrect: {
        type: Number,
        required: true
      },
      unattempted: {
        type: Number,
        default: 0
      }
    },

    sections: [
      {
        name: {
          type: String,
          required: true
        },

        subjectId: {
          type: Types.ObjectId,
          ref: "Subject"
        },

        totalQuestions: {
          type: Number
        },

        questionsToAttempt: {
          type: Number
        },

        marksPerQuestion: {
          type: Number
        },

        negativeMarks: {
          type: Number
        },

        isOptional: {
          type: Boolean,
          default: false
        },

        timeLimitMinutes: {
          type: Number
        },

        questionIds: [
          {
            type: Types.ObjectId,
            ref: "Question"
          }
        ]
      }
    ],

    difficultyDistribution: {
      easy: {
        type: Number,
        default: 0
      },
      medium: {
        type: Number,
        default: 0
      },
      hard: {
        type: Number,
        default: 0
      }
    },

    totalQuestions: {
      type: Number
    },

    isPublished: {
      type: Boolean,
      default: false
    },

    availableFrom: {
      type: Date
    },

    availableTill: {
      type: Date
    },

    isActive: {
      type: Boolean,
      default: true
    },

    createdBy: {
      type: Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("ExamBatch", ExamBatchSchema);
