import ExamBatch from "../../models/ExamBatchModel.js";
import Exam from "../../models/ExamModel.js";
import User from "../../models/User.js";
import Subject from "../../models/SubjectModel.js";
export const getAllExamBatches = async (req, res) => {
  try {
    const batches = await ExamBatch.find({ isActive: true })
      .populate("examId", "name")          // exam ka naam
      .populate("createdBy", "email")      // kisne create kiya
      .populate("sections.subjectId", "name") // section subjects
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: batches.length,
      batches
    });

  } catch (error) {
    console.error("GET ALL BATCHES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const getExamBatchById = async (req, res) => {
  try {
    const { id } = req.params;

    // ID validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Batch ID"
      });
    }

    const batch = await ExamBatch.findById(id)
      .populate("examId", "name")
      .populate("createdBy", "email")
      .populate("sections.subjectId", "name")
      .populate("sections.questionIds") // agar questions bhi chahiye
      .populate("difficultyDistribution")
      .exec();

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Exam Batch not found"
      });
    }

    return res.status(200).json({
      success: true,
      batch
    });

  } catch (error) {
    console.error("GET SINGLE BATCH ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};