import Question from "../models/QuestionModel.js";

/**
 * FINAL EXAM SUBMIT CONTROLLER
 */
export const submitFinalExam = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || answers.length === 0) {
      return res.status(400).json({
        message: "No answers submitted",
      });
    }

    // -----------------------------
    // Load all questionIds
    // -----------------------------
    const questionIds = answers.map((a) => a.questionId);

    const questions = await Question.find({
      _id: { $in: questionIds },
    });

    // -----------------------------
    // Stats variables
    // -----------------------------
    let totalQuestions = questions.length;

    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    let totalTime = 0;
    let totalScore = 0;

    // Score config (example)
    const marksCorrect = 4;
    const marksWrong = -1;

    // Detailed report
    const report = [];

    // -----------------------------
    // Evaluate each answer
    // -----------------------------
    for (let ans of answers) {
      const question = questions.find(
        (q) => q._id.toString() === ans.questionId
      );

      if (!question) continue;

      totalTime += ans.timeSpentSeconds || 0;

      // correct option
      const correctOption = question.options.find(
        (opt) => opt.isCorrect === true
      );

      // User didn't attempt
      if (!ans.selectedOption) {
        unattempted++;

        report.push({
          questionId: question._id,
          status: "UNATTEMPTED",
          correctAnswer: correctOption?.value,
        });

        continue;
      }

      // Match answer
      if (ans.selectedOption === correctOption?.value) {
        correct++;
        totalScore += marksCorrect;

        report.push({
          questionId: question._id,
          status: "CORRECT",
          correctAnswer: correctOption?.value,
        });
      } else {
        wrong++;
        totalScore += marksWrong;

        report.push({
          questionId: question._id,
          status: "WRONG",
          correctAnswer: correctOption?.value,
        });
      }
    }

    // -----------------------------
    // Accuracy %
    // -----------------------------
    const attempted = totalQuestions - unattempted;

    const accuracy =
      attempted === 0 ? 0 : ((correct / attempted) * 100).toFixed(2);

    // -----------------------------
    // Percentage Score
    // -----------------------------
    const maxScore = totalQuestions * marksCorrect;

    const percentage = ((totalScore / maxScore) * 100).toFixed(2);

    // -----------------------------
    // Percentile (Approx Formula)
    // -----------------------------
    // Real percentile needs all students data
    // Here we give estimated percentile
    let percentile = 0;

    if (percentage >= 90) percentile = 99;
    else if (percentage >= 75) percentile = 95;
    else if (percentage >= 60) percentile = 85;
    else if (percentage >= 40) percentile = 70;
    else percentile = 50;

    // -----------------------------
    // Final Response
    // -----------------------------
    return res.status(200).json({
      message: "Exam Submitted Successfully ✅",

      summary: {
        totalQuestions,
        attempted,
        correct,
        wrong,
        unattempted,

        totalScore,
        maxScore,

        accuracy: `${accuracy}%`,
        percentage: `${percentage}%`,
        percentile: `${percentile}%`,

        totalTimeSeconds: totalTime,
        totalTimeMinutes: (totalTime / 60).toFixed(1),
      },

      report, // per question result
    });
  } catch (error) {
    console.error("Exam Submit Error:", error);

    return res.status(500).json({
      message: "Server Error while submitting exam",
    });
  }
};
