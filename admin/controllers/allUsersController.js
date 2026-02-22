import User from "../../models/User.js";
import Student from "../../models/StudentModel.js";
import Subject from "../../models/SubjectModel.js";
import Formula from "../../models/FormulaModel.js";
import Chapter from "../../models/ChapterModel.js";
import Topic from "../../models/TopicModel.js";
import PaidContent from "../../models/paidContentModel.js";
// ===============================
// GET ALL USERS
// ===============================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("studentId") // 🔥 populate student data
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: users.length,
      users,
    });

  } catch (err) {
    console.error("GET ALL USERS ERROR:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ===============================
// GET SINGLE USER (WITH STUDENT DATA)
// ===============================
// ===============================
// GET SINGLE USER (FULL DETAILS)
// ===============================
export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find User
    const user = await User.findById(id)
      .populate({
        path: "purchasedContents.contentId",
        model: "PaidContent"
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Manually Find Student using userId
    const student = await Student.findOne({ userId: id })
      .populate([
        { path: "subjects.subjectId" },
        { path: "subjects.strongChapters" },
        { path: "subjects.weakChapters" },
        { path: "chapterAnalytics.chapterId" },
        { path: "bookmarks" },
        { path: "formulaAnalytics.formulaId" }
        // { path: "testStatistics.tests.examBatchId" }
      ]);

    return res.status(200).json({
      message: "User fetched successfully",
      user,
      student   // 👈 student manually attach
    });

  } catch (err) {
    console.error("GET SINGLE USER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};