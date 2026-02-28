import Student from "../models/StudentModel.js";
import User from "../models/User.js";
import Subject from "../models/SubjectModel.js";
import Chapter from "../models/ChapterModel.js";
import StudentExamBatch from "../models/StudentExamBatchModel.js";
/* =====================================================
   CREATE / UPDATE PROFILE
===================================================== */
export const createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.userId;

    // ✅ Name bhi frontend se lo
    const {
      name,
      targetExam,
      targetYear,
      classLevel,
      language,
      darkMode
    } = req.body;

    let student = await Student.findOne({ userId });

    // -------------------------------------------------
    // ✅ CREATE NEW PROFILE
    // -------------------------------------------------
    if (!student) {
      student = await Student.create({
        userId,

        // ✅ Save Name
        name,

        targetExam,
        targetYear,
        classLevel,

        preferences: {
          language,
          darkMode
        },

        isNew: true
      });
    }

    // -------------------------------------------------
    // ✅ UPDATE EXISTING PROFILE
    // -------------------------------------------------
    else {
      // ✅ Update Name also
      student.name = name;

      student.targetExam = targetExam;
      student.targetYear = targetYear;
      student.classLevel = classLevel;

      student.preferences.language = language;
      student.preferences.darkMode = darkMode;

      student.isNew = true;

      await student.save();
    }

    // -------------------------------------------------
    // ✅ RESPONSE
    // -------------------------------------------------
    res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      student
    });

  } catch (err) {
      // ✅ FULL ERROR LOGS (Backend Terminal में दिखेगा)
  console.log("🔥 INTERNAL SERVER ERROR IN PROFILE API");
  console.log("➡️ Error Message:", err.message);

  // अगर Mongo/Mongoose validation error है
  console.log("➡️ Full Error Object:", err);

  // पूरा stack trace (सबसे useful)
  console.log("➡️ Error Stack:", err.stack);

  // अगर error details मौजूद हैं
  if (err.errors) {
    console.log("➡️ Mongoose Validation Errors:", err.errors);
  }
    res.status(500).json({


      success: false,
      error: err.message
    });
  }
};

/* =====================================================
   GET FULL STUDENT PROFILE
===================================================== */
export const getStudentProfile = async (req, res) => {
  try {

    const userId = req.userId;

    const student = await Student.findOne({ userId })

      // ONLY populate exam batch
      .populate({
        path: "testStatistics.tests.examBatchId",
        model: "StudentExamBatch"
      })

      // remove unnecessary mongo fields if you want clean response
      .lean();

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found"
      });
    }

    const user = await User.findById(userId)
      .select("email name profilePhoto provider createdAt")
      .lean();

    res.status(200).json({
      success: true,
      student,
      user
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      error: err.message
    });

  }
};
/* =====================================================
   IS NEW USER CHECK
===================================================== */

export const isNewStudent = async (req, res) => {
  try {
    const userId = req.userId;

    const student = await Student.findOne({ userId });

    // if profile not created yet
    if (!student) {
      return res.json({ isNew: true });
    }

    res.json({
      isNew: student.isNew
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyPaidContents = async (req, res) => {
  try {
    const userId = req.userId;

    // 1. Find User
    const user = await User.findById(userId).select("purchasedContents");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Return Purchased Contents (raw IDs only)
    res.json({
      success: true,
      purchasedContents: user.purchasedContents,
    });
  } catch (error) {
    console.error("PaidContent Fetch Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   MARK STUDENT AS NOT NEW
===================================================== */
export const markStudentAsOld = async (req, res) => {
  try {
    const userId = req.userId; // 🔥 From middleware (JWT decoded)

    const student = await Student.findOne({ userId });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    // If already false, avoid unnecessary DB write
    if (student.isNew === false) {
      return res.status(200).json({
        success: true,
        message: "Student already marked as not new",
      });
    }

    student.isNew = false;
    await student.save();

    return res.status(200).json({
      success: true,
      message: "Student marked as not new successfully",
    });

  } catch (err) {
    console.error("Mark Student As Old Error:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};