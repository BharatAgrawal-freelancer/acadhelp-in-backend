import Student from "../models/StudentModel.js";
import User from "../models/User.js";
import Subject from "../models/SubjectModel.js";
import Chapter from "../models/ChapterModel.js";

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

        isNew: false
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

      student.isNew = false;

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

    // find student
    const student = await Student.findOne({ userId })
      .populate("subjects.subjectId")
      .populate("subjects.strongChapters")
      .populate("subjects.weakChapters");

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found"
      });
    }

    // find user
    const user = await User.findById(userId).select(
      "email name profilePhoto provider createdAt"
    );

    res.status(200).json({
      student,
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
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
