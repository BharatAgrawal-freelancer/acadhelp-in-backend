import mongoose from "mongoose";

const { Schema, Types } = mongoose;

/* ---------------- TEST DETAILS ---------------- */

const testDetailSchema = new Schema({
  examBatchId: {
    type: Types.ObjectId,
    ref: "StudentExamBatch",
    required: true
  },

  overallGood: {
    type: Boolean,
    default: false
  },

  improvements: {
    type: String,
    trim: true
  }

}, { _id: false });


/* ---------------- BOOKMARKS ---------------- */

const bookmarkFolderSchema = new Schema({
  folderName: {
    type: String,
    required: true,
    trim: true
  },

  description: String,

  questions: [
    {
      type: Types.ObjectId,
      ref: "Question"
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }

});


/* ---------------- SUBJECT STRUCTURE ---------------- */

const subjectPerformanceSchema = new Schema({

  subjectId: {
    type: Types.ObjectId,
    ref: "Subject"
  },

  subjectName: String,

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
      chapterId: {
        type: Types.ObjectId,
        ref: "Chapter"
      },

      chapterName: String
    }
  ],

  weakChapters: [
    {
      chapterId: {
        type: Types.ObjectId,
        ref: "Chapter"
      },

      chapterName: String,

      reasons: [
        {
          type: String
        }
      ]
    }
  ]

}, { _id: false });


/* ---------------- CHAPTER ANALYTICS ---------------- */

const chapterAnalyticsSchema = new Schema({

  chapterId: {
    type: Types.ObjectId,
    ref: "Chapter"
  },

  chapterName: String,

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

    errorId: {
      type: Types.ObjectId,
      ref: "Error"
    },

    errorText: String

  },

  priorityLevel: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH"],
    default: "MEDIUM"
  }

}, { _id: false });


/* ---------------- ERROR ANALYTICS ---------------- */

const errorAnalyticsSchema = new Schema({

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

}, { _id: false });


/* ---------------- FORMULA ANALYTICS ---------------- */

const formulaAnalyticsSchema = new Schema({

  formulaId: {
    type: Types.ObjectId,
    ref: "Formula"
  },

  formulaHeading: String,

  latex: String,

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

}, { _id: false });


/* ---------------- MAIN STUDENT SCHEMA ---------------- */

const StudentSchema = new Schema({

  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  name: String,

  targetExam: {
    type: String,
    enum: ["JEE_MAIN", "JEE_ADVANCED", "BITSAT", "NEET"]
  },

  targetYear: Number,

  classLevel: {
    type: String,
    enum: ["11", "12", "12_DROPPER"]
  },

  subjects: [subjectPerformanceSchema],

  chapterAnalytics: [chapterAnalyticsSchema],

  errorAnalytics: [errorAnalyticsSchema],

  formulaAnalytics: [formulaAnalyticsSchema],

  /* ---------------- TEST STATS ---------------- */

  testStatistics: {

    totalTests: {
      type: Number,
      default: 0
    },

    tests: {
      type: [testDetailSchema],
      default: []
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

  /* ---------------- BOOKMARKS ---------------- */

  bookmarks: {
    type: [bookmarkFolderSchema],
    default: []
  },

  /* ---------------- PREDICTIONS ---------------- */

  netPercentile: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },

  predictedRank: {
    type: Number,
    min: 1,
    default: null
  },

  recentImprovedMarks: {
    type: Number,
    min: 0,
    default: 0
  },

  /* ---------------- USER SETTINGS ---------------- */

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

}, {
  timestamps: true
});

export default mongoose.model("Student", StudentSchema);