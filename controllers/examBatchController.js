import ExamBatch from "../models/ExamBatchModel.js";
import Exam from "../models/ExamModel.js";
import Question from "../models/QuestionModel.js";
import Subject from "../models/SubjectModel.js";
/* =====================================================
   GET ALL BATCHES BY EXAM ID
===================================================== */

export const getBatchesByExam = async (req, res) => {
  try {
    const { examId } = req.params;

    const batches = await ExamBatch.find({
      examId,
      isActive: true,
      isPublished: true
    })
      .select("year shift name examId")
      .populate("examId", "name");

    const response = batches.map((b) => ({
      id: b._id,
      examName: b.examId.name,
      year: b.year,
      shift: b.shift,
      batchName: b.name
    }));

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch exam batches",
      error: err.message
    });
  }
};

/* =====================================================
   GET SINGLE BATCH DETAILS
===================================================== */

export const getExamBatchById = async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await ExamBatch.findById(batchId)
      .populate("examId", "name code conductingBody")
      .populate("sections.subjectId", "name code")
      .select("-sections.questionIds"); // ❌ remove questions

    if (!batch) {
      return res.status(404).json({
        message: "Exam batch not found"
      });
    }

    res.status(200).json(batch);

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch exam batch",
      error: err.message
    });
  }
};


/* =====================================================
   GET FULL EXAM QUESTIONS (INTERNAL USE)
===================================================== */

export const getExamBatchQuestions = async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await ExamBatch.findById(batchId)
      .populate("sections.subjectId", "name")
      .lean();

    if (!batch) {
      return res.status(404).json({
        message: "Exam batch not found"
      });
    }

    const subjectMap = {};

    // -------------------------------------------------
    // LOOP EACH SECTION
    // -------------------------------------------------
    for (const section of batch.sections) {

      const questions = await Question.find({
        _id: { $in: section.questionIds },
        isActive: true
      })
        .select(
          "heading questionText questionType options subjectId"
        )
        .lean();

      if (!subjectMap[section.subjectId._id]) {
        subjectMap[section.subjectId._id] = {
          subjectId: section.subjectId._id,
          subjectName: section.subjectId.name,
          questions: []
        };
      }

      for (const q of questions) {
        subjectMap[section.subjectId._id].questions.push({
          questionId: q._id,
          heading: q.heading,
          questionText: q.questionText,
          questionType: q.questionType,

          options: q.options.map(opt => ({
            optionId: opt.optionId,
            value: opt.value
          }))
        });
      }
    }

    // -------------------------------------------------
    // FINAL RESPONSE
    // -------------------------------------------------
    res.status(200).json({
      batchId: batch._id,
      batchName: batch.name,
      durationMinutes: batch.durationMinutes,
      markingScheme: batch.markingScheme,

      subjects: Object.values(subjectMap)
    });

  } catch (err) {
    console.error("EXAM QUESTION API ERROR:", err);

    res.status(500).json({
      message: "Failed to load exam questions",
      error: err.message
    });
  }
};
