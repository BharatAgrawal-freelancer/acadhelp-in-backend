import Exam from "../models/ExamModel.js";

/* =====================================================
   GET ALL EXAMS (CARD VIEW)
===================================================== */

export const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find({ isActive: true })
      .select("name img conductingBody")
      .sort({ createdAt: -1 });

    res.status(200).json(exams);

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch exams",
      error: err.message
    });
  }
};

/* =====================================================
   GET EXAM BY ID (FULL DATA)
===================================================== */

export const getExamById = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findById(id)
      .populate("sections.subjectId", "name code");

    if (!exam) {
      return res.status(404).json({
        message: "Exam not found"
      });
    }
console.log(exam);
    res.status(200).json(exam);

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch exam",
      error: err.message
    });
  }
};
