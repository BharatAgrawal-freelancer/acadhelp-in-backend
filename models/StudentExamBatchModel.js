import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const StudentExamBatchSchema = new Schema(
  {
    studentId: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },

    examId: {
      type: Types.ObjectId,
      ref: "Exam",
      required: true
    },

    examBatchId: {
      type: Types.ObjectId,
      ref: "ExamBatch",
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

        totalQuestions: Number,

        questionsToAttempt: Number,

        marksPerQuestion: Number,

        negativeMarks: Number,

        isOptional: {
          type: Boolean,
          default: false
        },

        timeLimitMinutes: Number,

        questions: [
          {
            questionId: {
              type: Types.ObjectId,
              ref: "Question"
            },

            selectedOptionIds: [
              {
                type: Types.ObjectId
              }
            ],

            integerAnswer: Number,

            isCorrect: Boolean,

            marksObtained: {
              type: Number,
              default: 0
            },

            timeSpentSeconds: {
              type: Number,
              default: 0
            },

            visitCount: {
              type: Number,
              default: 0
            },

            errorType: {
              type: String,
              enum: [
                "CONCEPTUAL",
                "CALCULATION",
                "FORMULA_CONFUSION",
                "TIME_PRESSURE",
                "SILLY_MISTAKE",
                "GUESS"
              ]
            }
          }
        ]
      }
    ],

    score: {
      type: Number,
      default: 0
    },

    totalAttempted: {
      type: Number,
      default: 0
    },

    totalCorrect: {
      type: Number,
      default: 0
    },

    totalWrong: {
      type: Number,
      default: 0
    },

    accuracy: {
      type: Number,
      default: 0
    },

    percentile: Number,

    rank: Number,

    startedAt: Date,

    submittedAt: Date,

    timeTakenSeconds: Number,

    status: {
      type: String,
      enum: ["NOT_STARTED", "IN_PROGRESS", "SUBMITTED", "TIME_UP"],
      default: "NOT_STARTED"
    },

    isEvaluated: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("StudentExamBatch", StudentExamBatchSchema);
