import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const FormulaSchema = new Schema(
  {
    subjectId: {
      type: Types.ObjectId,
      required: true,
      ref: "Subject"
    },

    chapterId: {
      type: Types.ObjectId,
      required: true,
      ref: "Chapter"
    },

    topicId: {
      type: Types.ObjectId,
      ref: "Topic"
    },

    formulaName: {
      type: String,
      required: true,
      trim: true
    },

    formulaExpression: {
      type: String,
      required: true
    },

    latexExpression: {
      type: String
    },

    variables: [
      {
        symbol: String,
        meaning: String,
        unit: String
      }
    ],

    derivedFrom: [
      {
        type: Types.ObjectId,
        ref: "Formula"
      }
    ],

    applicableConceptTags: [
      {
        type: String
      }
    ],

    applicableQuestionTypes: [
      {
        type: String,
        enum: [
          "MCQ_SINGLE",
          "MCQ_MULTI",
          "INTEGER",
          "NUMERICAL",
          "ASSERTION_REASON",
          "MATCHING",
          "PARAGRAPH"
        ]
      }
    ],

    usageLevel: {
      type: String,
      enum: ["BASIC", "INTERMEDIATE", "ADVANCED"]
    },

    difficultyWeight: {
      type: Number,
      default: 1
    },

    commonMistakes: [
      {
        errorId: {
          type: Types.ObjectId,
          ref: "Error"
        },
        description: String
      }
    ],

    relatedNotesIds: [
      {
        type: Types.ObjectId,
        ref: "Notes"
      }
    ],

    relatedQuestionIds: [
      {
        type: Types.ObjectId,
        ref: "Question"
      }
    ],

    preferredExamTypes: [
      {
        exam: {
          type: String,
          enum: ["JEE_MAIN", "JEE_ADVANCED", "BITSAT", "NEET"]
        },
        weightage: Number
      }
    ],

    isDerivedFormula: {
      type: Boolean,
      default: false
    },

    isImportant: {
      type: Boolean,
      default: false
    },

    isDeleted: {
      type: Boolean,
      default: false
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

export default mongoose.model("Formula", FormulaSchema);
