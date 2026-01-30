import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const StudentSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    targetExam: {
      type: String,
      enum: ["JEE_MAIN", "JEE_ADVANCED", "BITSAT", "NEET"]
    },

    targetYear: {
      type: Number
    },

    classLevel: {
      type: String,
      enum: ["11", "12", "12_DROPPER"]
    },

    subjects: [
      {
        subjectId: {
          type: Types.ObjectId,
          ref: "Subject"
        },

        overallAccuracy: {
          type: Number,
          default: 0
        },

        averageTimePerQuestion: {
          type: Number,
          default: 0
        },

        strongChapters: [
          {
            type: Types.ObjectId,
            ref: "Chapter"
          }
        ],

        weakChapters: [
          {
            type: Types.ObjectId,
            ref: "Chapter"
          }
        ]
      }
    ],

    chapterAnalytics: [
      {
        chapterId: {
          type: Types.ObjectId,
          ref: "Chapter"
        },

        totalQuestions: {
          type: Number,
          default: 0
        },

        correct: {
          type: Number,
          default: 0
        },

        wrong: {
          type: Number,
          default: 0
        },

        accuracy: {
          type: Number,
          default: 0
        },

        averageTimeSeconds: {
          type: Number,
          default: 0
        },

        mostCommonError: {
          type: Types.ObjectId,
          ref: "Error"
        },

        priorityLevel: {
          type: String,
          enum: ["LOW", "MEDIUM", "HIGH"],
          default: "MEDIUM"
        }
      }
    ],

    errorAnalytics: [
      {
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
        },

        count: {
          type: Number,
          default: 0
        }
      }
    ],

    formulaAnalytics: [
      {
        formulaId: {
          type: Types.ObjectId,
          ref: "Formula"
        },

        totalUsed: {
          type: Number,
          default: 0
        },

        correctUsage: {
          type: Number,
          default: 0
        },

        incorrectUsage: {
          type: Number,
          default: 0
        }
      }
    ],

    testStatistics: {
      totalTests: {
        type: Number,
        default: 0
      },

      totalQuestionsAttempted: {
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

      overallAccuracy: {
        type: Number,
        default: 0
      },

      averageScore: {
        type: Number,
        default: 0
      },

      bestScore: {
        type: Number,
        default: 0
      },

      averageTimePerQuestion: {
        type: Number,
        default: 0
      }
    },

    bookmarks: [
      {
        type: Types.ObjectId,
        ref: "Question"
      }
    ],

    preferences: {
      language: {
        type: String,
        default: "en"
      },

      darkMode: {
        type: Boolean,
        default: false
      }
    },

    isActive: {
      type: Boolean,
      default: true
    },
      isNew: {
      type: Boolean,
      default: true
    }
  },
  
  {
    timestamps: true
  }
);

export default mongoose.model("Student", StudentSchema);
