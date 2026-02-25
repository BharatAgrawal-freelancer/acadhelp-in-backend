import mongoose from "mongoose";

const { Schema } = mongoose;

const ChapterRankingSchema = new Schema(
  {
    chapterName: {
      type: String,
      required: true,
      trim: true
    },

    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },

    subjectName: {
      type: String,
      required: true,
      trim: true
    },

    class: {
      type: Number,
      required: true,
      enum: [11, 12]
    },

    toughnessRanking: {
      type: Number,
      required: true,
      min: 1
    },

    pyqRanking: {
      type: Number,
      required: true,
      min: 1
    },

    avgQuestions: {
      type: Number,
      required: true,
      min: 0
    },

    whyItIsTough: {
      type: String,
      required: true,
      trim: true
    },

    img: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

// Indexes for performance optimization
ChapterRankingSchema.index({ subjectId: 1, class: 1 });
ChapterRankingSchema.index({ toughnessRanking: 1 });
ChapterRankingSchema.index({ pyqRanking: 1 });

const ChapterRanking = mongoose.model("ChapterRanking", ChapterRankingSchema);

export default ChapterRanking;