import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const QuestionSchema = new Schema(
  {
    subjectId: {
      type: Types.ObjectId,
      required: true,
      ref: "Subject"
    },

    chapterId: {
      type: Types.ObjectId,
      ref: "Chapter"
    },
   chapterName: String , 

    topicId: {
      type: Types.ObjectId,
      ref: "Topic"
    },

    heading: {
      type: String,
      maxlength: 200
    },

    questionText: {
      type: String,
      required: true
    },

    questionType: {
      type: String,
    
      required: true,
      enum: [
        "MCQ_SINGLE",
        "MCQ_MULTI",
        "INTEGER",
        "NUMERICAL",
        "ASSERTION_REASON",
        "MATCHING",
        "PARAGRAPH"
      ]
    },
  img: {
    type: String,
  },
    options: [
      {
        optionId: {
          type: Types.ObjectId,
          default: () => new Types.ObjectId()
        },

        value: {
          type: String,
          required: true
        },

        isCorrect: {
          type: Boolean,
          default: false
        },

        commonError: {
          errorId: {
            type: Types.ObjectId,
            ref: "Error"
          },
          description: String
        }
      }
    ],

    solution: {
      finalAnswer: String,

      steps: [
        {
          stepNo: Number,
          explanation: String,
          formulaUsed: [
            {
              type: Types.ObjectId,
              ref: "Formula"
            }
          ],
        imageIds: [
  {
    type: String
  }
]

        }
      ]
    },

    expandedSolution: {
      type: String
    },

   relatedImages: [
  {
    type: String
  }
],


    relatedFormulaIds: [
      {
        type: Types.ObjectId,
        ref: "Formula"
      }
    ],

    additionalFormulaIds: [
      {
        type: Types.ObjectId,
        ref: "Formula"
      }
    ],

    relatedNotesIds: [
      {
        type: Types.ObjectId,
        ref: "Notes"
      }
    ],

    expectedTime: {
      easy: {
        type: Number,
        default: 120
      },
      medium: {
        type: Number,
        default: 240
      },
      hard: {
        type: Number,
        default: 600
      }
    },

    difficultyLevel: {
      type: String,
      enum: ["Easy", "Medium", "Hard"]
    },

    preferredExamTypes: [
      {
        exam: {
          type: String,
          enum: ["JEE_MAIN", "JEE_ADVANCED", "BITSAT", "NEET"]
        },
        weightage: Number
      }
    ],

    tags: [
      {
        type: String
      }
    ],

    conceptTags: [
      {
        type: String
      }
    ],

    source: {
      type: {
        type: String,
        required: true,
        enum: ["PYQ", "MOCK", "INSTRUCTOR", "AI"]
      },

      year: Number,

      exam: {
        type: String,
        enum: ["JEE_MAIN", "JEE_ADVANCED", "BITSAT", "NEET"]
      },

      shift: {
        type: String,
        enum: ["Morning", "Evening"]
      },

      sourceId: {
        type: Types.ObjectId
      }
    },

    totalFavorites: {
      type: Number,
      default: 0
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

export default mongoose.model("Question", QuestionSchema);
