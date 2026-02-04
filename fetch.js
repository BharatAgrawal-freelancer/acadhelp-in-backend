/**
 * fetchQuestionIds.js
 * -------------------
 * सभी existing Question IDs निकालने के लिए
 */

import mongoose from "mongoose";

// 🔁 CHANGE THIS
const MONGO_URI = "mongodb+srv://mentormate:MeNtOrMaTe13579@cluster0.br0aexl.mongodb.net/evalo";

// 🔁 अगर model already है तो वही import करो
// import Question from "./models/Question.js";

// 🔹 QUICK INLINE SCHEMA (safe for ID fetch)
const QuestionSchema = new mongoose.Schema(
  {},
  { collection: "questions", strict: false }
);

const Question = mongoose.model("Question", QuestionSchema);

async function fetchQuestionIds() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    const questions = await Question.find(
      {},          // all documents
      { _id: 1 }   // only _id
    ).lean();

    const ids = questions.map(q => q._id.toString());

    console.log(`\n📌 TOTAL QUESTIONS FOUND: ${ids.length}\n`);

    ids.forEach(id => console.log(id));

    // 👉 OPTIONAL: save to file
    // import fs from "fs";
    // fs.writeFileSync("questionIds.json", JSON.stringify(ids, null, 2));

    await mongoose.disconnect();
    console.log("\n🔌 MongoDB disconnected");

  } catch (err) {
    console.error("❌ Error fetching question IDs:", err);
    process.exit(1);
  }
}

fetchQuestionIds();
