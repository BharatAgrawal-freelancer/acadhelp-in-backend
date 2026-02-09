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
   GET FULL EXAM QUESTIONS (FOR EXAM RUNNER)
===================================================== */
export const getExamBatchQuestions = async (req, res) => {
  try {
    const { batchId } = req.params;

    // ✅ Load Batch + Subject Names
    const batch = await ExamBatch.findById(batchId)
      .populate("sections.subjectId", "name")
      .lean();

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Exam batch not found"
      });
    }

    const subjectMap = {};

    /* -----------------------------------------------
       LOOP THROUGH EACH SECTION
    ------------------------------------------------ */
    for (const section of batch.sections) {
      // ✅ Fetch Active Questions Only + Include img
      const questions = await Question.find({
        _id: { $in: section.questionIds }
      })
        .select("heading questionText questionType img options")
        .lean();

      // ✅ Initialize Subject Entry
      const subjectId = section.subjectId._id.toString();

      if (!subjectMap[subjectId]) {
        subjectMap[subjectId] = {
          subjectId: section.subjectId._id,
          subjectName: section.subjectId.name,
          questions: []
        };
      }

      /* -----------------------------------------------
         FORMAT QUESTIONS FOR FRONTEND
      ------------------------------------------------ */
      questions.forEach(q => {
        subjectMap[subjectId].questions.push({
          questionId: q._id,

          heading: q.heading || "",
          questionText: q.questionText,

          // ✅ Question Type
          questionType: q.questionType,

          // ✅ Include Question Image URL
          img: q.img || "",

          // ✅ Options Formatting
          options: q.options.map((opt, idx) => ({
            optionId: opt.optionId || idx,
            value: opt.value
          }))
        });
      });
    }

    /* -----------------------------------------------
       FINAL RESPONSE OBJECT
    ------------------------------------------------ */
    const finalResponse = {
      success: true,

      batchId: batch._id,
      batchName: batch.name,
      durationMinutes: batch.durationMinutes,
      markingScheme: batch.markingScheme,

      subjects: Object.values(subjectMap)
    };

    /* -----------------------------------------------
       ✅ LOG FINAL RESPONSE
    ------------------------------------------------ */
    console.log("✅ Final Exam Batch Response Sent:");
    console.log(JSON.stringify(finalResponse, null, 2));

    /* -----------------------------------------------
       SEND RESPONSE TO FRONTEND
    ------------------------------------------------ */
    return res.status(200).json(finalResponse);

  } catch (err) {
    console.error("❌ Exam Batch API Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to load exam questions",
      error: err.message
    });
  }
};
