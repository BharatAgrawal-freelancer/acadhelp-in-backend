import mongoose from "mongoose";
import Question from "../models/QuestionModel.js";
import SelfCreatedExamBatch from "../models/SelfCreatedExamBatchModel.js";

const { Types } = mongoose;

/*
  SUBJECT IDS
*/
const SUBJECTS = {
  MATH: "6970b46dc8987946e04aaf80",
  PHYSICS: "6970b46dc8987946e04aaf81",
  CHEMISTRY: "6970b46dc8987946e04aaf82"
};

const EXAM_ID = "6970b719c898792b9cda0b8e";

/*
  Utility → Get Random Questions
*/
const getRandomQuestions = async (subjectId, limit) => {
  return await Question.aggregate([
    {
      $match: {
        subjectId: new Types.ObjectId(subjectId)
      }
    },
    { $sample: { size: limit } }
  ]);
};

const getQuestionsByChapters = async (
  subjectId,
  chapterNames = [],
  limit = 25
) => {
  // 1️⃣ Fetch chapter-based questions
  const chapterQuestions = await Question.find({
    subjectId: new Types.ObjectId(subjectId),
    chapterName: { $in: chapterNames }
  }).lean();

  let selected = [];

  if (chapterQuestions.length >= limit) {
    // Shuffle & pick 25
    selected = chapterQuestions
      .sort(() => 0.5 - Math.random())
      .slice(0, limit);
  } else {
    selected = chapterQuestions;

    const remaining = limit - selected.length;

    if (remaining > 0) {
      const extra = await Question.aggregate([
        {
          $match: {
            subjectId: new Types.ObjectId(subjectId),
            _id: { $nin: selected.map(q => q._id) }
          }
        },
        { $sample: { size: remaining } }
      ]);

      selected = [...selected, ...extra];
    }
  }

  return selected;
};

export const createRandomJeeMainBatch = async (req, res) => {
  try {
    const userId = req.userId; // 🔥 from protect middleware

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔥 Fetch 25-25-25
    const [mathQ, physicsQ, chemistryQ] = await Promise.all([
      getRandomQuestions(SUBJECTS.MATH, 25),
      getRandomQuestions(SUBJECTS.PHYSICS, 25),
      getRandomQuestions(SUBJECTS.CHEMISTRY, 25)
    ]);

    if (
      mathQ.length < 25 ||
      physicsQ.length < 25 ||
      chemistryQ.length < 25
    ) {
      return res.status(400).json({
        message: "Not enough questions available in one or more subjects"
      });
    }

    const allQuestions = [...mathQ, ...physicsQ, ...chemistryQ];

    const batch = await SelfCreatedExamBatch.create({
      studentId: userId,
      examId: EXAM_ID,

      name: "JEE Main Full Mock (Random)",
      code: "JEE_RANDOM",

      totalMarks: 300,
      durationMinutes: 180,

      markingScheme: {
        correct: 4,
        incorrect: -1,
        unattempted: 0
      },

      totalQuestions: 75,

      sections: [
        {
          name: "Mathematics",
          subjectId: SUBJECTS.MATH,
          totalQuestions: 25,
          questionsToAttempt: 25,
          marksPerQuestion: 4,
          negativeMarks: -1,
          questionIds: mathQ.map(q => q._id)
        },
        {
          name: "Physics",
          subjectId: SUBJECTS.PHYSICS,
          totalQuestions: 25,
          questionsToAttempt: 25,
          marksPerQuestion: 4,
          negativeMarks: -1,
          questionIds: physicsQ.map(q => q._id)
        },
        {
          name: "Chemistry",
          subjectId: SUBJECTS.CHEMISTRY,
          totalQuestions: 25,
          questionsToAttempt: 25,
          marksPerQuestion: 4,
          negativeMarks: -1,
          questionIds: chemistryQ.map(q => q._id)
        }
      ],

      difficultyDistribution: {
        easy: allQuestions.filter(q => q.difficultyLevel === "Easy").length,
        medium: allQuestions.filter(q => q.difficultyLevel === "Medium").length,
        hard: allQuestions.filter(q => q.difficultyLevel === "Hard").length
      }
    });

    return res.status(201).json({
  batchId: batch._id
});
    

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

export const getSelfExamBatchById = async (req, res) => {
  try {
    const { batchId } = req.params;
    const userId = req.userId;

    const batch = await SelfCreatedExamBatch.findOne({
      _id: batchId,
      studentId: userId // 🔒 ownership check
    })
      .populate("examId", "name code conductingBody")
      .populate("sections.subjectId", "name code")
      .select("-sections.questionIds");

    if (!batch) {
      return res.status(404).json({
        message: "Exam batch not found"
      });
    }

    return res.status(200).json(batch);

  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch exam batch",
      error: err.message
    });
  }
};

export const getSelfExamBatchQuestions = async (req, res) => {
  try {
    const { batchId } = req.params;
    const userId = req.userId;

    const batch = await SelfCreatedExamBatch.findOne({
      _id: batchId,
      studentId: userId // 🔒 security check
    })
      .populate("sections.subjectId", "name")
      .lean();

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Exam batch not found"
      });
    }

    const subjectMap = {};

    for (const section of batch.sections) {

      const questions = await Question.find({
        _id: { $in: section.questionIds }
      })
        .select("heading questionText questionType img options")
        .lean();

      const subjectId = section.subjectId._id.toString();

      if (!subjectMap[subjectId]) {
        subjectMap[subjectId] = {
          subjectId: section.subjectId._id,
          subjectName: section.subjectId.name,
          questions: []
        };
      }

      questions.forEach(q => {
        subjectMap[subjectId].questions.push({
          questionId: q._id,
          heading: q.heading || "",
          questionText: q.questionText,
          questionType: q.questionType,
          img: q.img || "",
          options: q.options.map((opt, idx) => ({
            optionId: opt.optionId || idx,
            value: opt.value
          }))
        });
      });
    }

    const finalResponse = {
      success: true,
      batchId: batch._id,
      batchName: batch.name,
      durationMinutes: batch.durationMinutes,
      markingScheme: batch.markingScheme,
      subjects: Object.values(subjectMap)
    };

    return res.status(200).json(finalResponse);

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to load exam questions",
      error: err.message
    });
  }
};

export const createChapterBasedJeeMainBatch = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      mathChapters = [],
      physicsChapters = [],
      chemistryChapters = []
    } = req.body;

    // 🔒 Minimum 4 chapters per subject required
    if (
      mathChapters.length < 4 ||
      physicsChapters.length < 4 ||
      chemistryChapters.length < 4
    ) {
      return res.status(400).json({
        message:
          "Minimum 4 chapters required in Mathematics, Physics and Chemistry."
      });
    }

    const [mathQ, physicsQ, chemistryQ] = await Promise.all([
      getQuestionsByChapters(SUBJECTS.MATH, mathChapters, 25),
      getQuestionsByChapters(SUBJECTS.PHYSICS, physicsChapters, 25),
      getQuestionsByChapters(SUBJECTS.CHEMISTRY, chemistryChapters, 25)
    ]);

    if (
      mathQ.length < 25 ||
      physicsQ.length < 25 ||
      chemistryQ.length < 25
    ) {
      return res.status(400).json({
        message: "Not enough questions available to generate full test."
      });
    }

    const allQuestions = [...mathQ, ...physicsQ, ...chemistryQ];

    const batch = await SelfCreatedExamBatch.create({
      studentId: userId,
      examId: EXAM_ID,
      name: "JEE Main Chapter Mock",
      code: "JEE_CHAPTER",
      totalMarks: 300,
      durationMinutes: 180,
      markingScheme: {
        correct: 4,
        incorrect: -1,
        unattempted: 0
      },
      totalQuestions: 75,
      sections: [
        {
          name: "Mathematics",
          subjectId: SUBJECTS.MATH,
          totalQuestions: 25,
          questionsToAttempt: 25,
          marksPerQuestion: 4,
          negativeMarks: -1,
          questionIds: mathQ.map(q => q._id)
        },
        {
          name: "Physics",
          subjectId: SUBJECTS.PHYSICS,
          totalQuestions: 25,
          questionsToAttempt: 25,
          marksPerQuestion: 4,
          negativeMarks: -1,
          questionIds: physicsQ.map(q => q._id)
        },
        {
          name: "Chemistry",
          subjectId: SUBJECTS.CHEMISTRY,
          totalQuestions: 25,
          questionsToAttempt: 25,
          marksPerQuestion: 4,
          negativeMarks: -1,
          questionIds: chemistryQ.map(q => q._id)
        }
      ],
      difficultyDistribution: {
        easy: allQuestions.filter(q => q.difficultyLevel === "Easy").length,
        medium: allQuestions.filter(q => q.difficultyLevel === "Medium").length,
        hard: allQuestions.filter(q => q.difficultyLevel === "Hard").length
      }
    });

    return res.status(201).json({
      batchId: batch._id
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};