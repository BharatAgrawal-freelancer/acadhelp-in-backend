import mongoose from "mongoose";
import Student from "../models/StudentModel.js";
import Question from "../models/QuestionModel.js";

/* ================= CREATE NEW FOLDER ================= */

/* ================= GET ALL FOLDERS ================= */
export const getFolders = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.userId });

    if (!student)
      return res.status(404).json({ message: "Student not found" });

    res.status(200).json({
      totalFolders: student.bookmarks.length,
      folders: student.bookmarks
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const createFolder = async (req, res) => {
  try {
    const { folderName, description } = req.body;

    if (!folderName)
      return res.status(400).json({ message: "Folder name required" });

    const student = await Student.findOne({ userId: req.userId });

    if (!student)
      return res.status(404).json({ message: "Student not found" });

    // Prevent duplicate folder name
    const existing = student.bookmarks.find(
      (f) => f.folderName.toLowerCase() === folderName.toLowerCase()
    );

    if (existing)
      return res.status(400).json({ message: "Folder already exists" });

    student.bookmarks.push({
      folderName,
      description,
      questions: []
    });

    await student.save();

    res.status(200).json({
      message: "Folder created successfully",
      bookmarks: student.bookmarks
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE FOLDER ================= */
export const deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.params;

    const student = await Student.findOne({ userId: req.userId });

    student.bookmarks = student.bookmarks.filter(
      (f) => f._id.toString() !== folderId
    );

    await student.save();

    res.json({ message: "Folder deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= RENAME FOLDER ================= */
export const renameFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { newName } = req.body;

    const student = await Student.findOne({ userId: req.userId });

    const folder = student.bookmarks.id(folderId);

    if (!folder)
      return res.status(404).json({ message: "Folder not found" });

    folder.folderName = newName;

    await student.save();

    res.json({ message: "Folder renamed successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= ADD QUESTION TO FOLDER ================= */
export const addQuestionToFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { questionId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(questionId))
      return res.status(400).json({ message: "Invalid Question ID" });

    const student = await Student.findOne({ userId: req.userId });

    const folder = student.bookmarks.id(folderId);

    if (!folder)
      return res.status(404).json({ message: "Folder not found" });

    // Prevent duplicate
    if (folder.questions.includes(questionId))
      return res.status(400).json({ message: "Question already bookmarked" });

    folder.questions.push(questionId);

    await student.save();

    res.json({ message: "Question added successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= VIEW ALL QUESTIONS IN FOLDER ================= */
export const getFolderQuestions = async (req, res) => {
  try {
    const { folderId } = req.params;

    const student = await Student.findOne({ userId: req.userId });

    const folder = student.bookmarks.id(folderId);

    if (!folder)
      return res.status(404).json({ message: "Folder not found" });

    const questions = await Question.find({
      _id: { $in: folder.questions }
    }).select("img questionText preferredExamTypes");

    res.json({
      folderName: folder.folderName,
      totalQuestions: questions.length,
      questions
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};