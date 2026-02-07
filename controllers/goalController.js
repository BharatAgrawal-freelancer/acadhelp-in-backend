import Goal from "../models/goalModel.js";

/* ---------------------------------------------------
   ✅ SAVE / UPDATE GOAL API
---------------------------------------------------*/
export const saveUserGoal = async (req, res) => {
  try {
    // ✅ UserId middleware se (req.userId)
    const userId = req.userId;

    // ✅ Body se values
    const { daily, weekly, monthly, yearly, date, totalQuestions } = req.body;

    // ✅ Find existing goal document
    let goalDoc = await Goal.findOne({ userId });

    // अगर goal document नहीं है तो create करो
    if (!goalDoc) {
      goalDoc = await Goal.create({
        userId,
        targets: {},
        dailyProgress: []
      });
    }

    /* -----------------------------------------------
       ✅ 1. Update TARGETS (Daily/Weekly/Monthly/Yearly)
    ------------------------------------------------ */
    if (daily || weekly || monthly || yearly) {
      goalDoc.targets.daily = daily ?? goalDoc.targets.daily;
      goalDoc.targets.weekly = weekly ?? goalDoc.targets.weekly;
      goalDoc.targets.monthly = monthly ?? goalDoc.targets.monthly;
      goalDoc.targets.yearly = yearly ?? goalDoc.targets.yearly;
    }

    /* -----------------------------------------------
       ✅ 2. If date + totalQuestions present → Daily Progress Save
    ------------------------------------------------ */
    if (date && totalQuestions !== undefined) {
      const progressDate = new Date(date);

      // check same date exists or not
      const existingEntry = goalDoc.dailyProgress.find(
        (d) =>
          new Date(d.date).toDateString() === progressDate.toDateString()
      );

      if (existingEntry) {
        existingEntry.totalQuestions = totalQuestions;
      } else {
        goalDoc.dailyProgress.push({
          date: progressDate,
          totalQuestions
        });
      }
    }

    // ✅ Save updated document
    await goalDoc.save();

    return res.status(200).json({
      success: true,
      message: "Goal Updated Successfully",
      data: goalDoc
    });
  } catch (error) {
    console.error("❌ Goal Save Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save goal",
      error: error.message
    });
  }
};

/* ---------------------------------------------------
   ✅ GET GOAL SUMMARY API (Today + Weekly + Monthly + Yearly)
---------------------------------------------------*/
export const getUserGoalSummary = async (req, res) => {
  try {
    const userId = req.userId;

    const goalDoc = await Goal.findOne({ userId });

    if (!goalDoc) {
      return res.status(404).json({
        success: false,
        message: "No goal found for this user"
      });
    }

    // ✅ Today's Date
    const today = new Date();

    // Helper: Same Day check
    const isSameDay = (d1, d2) =>
      new Date(d1).toDateString() === new Date(d2).toDateString();

    // Helper: Last N Days filter
    const lastNDays = (days) => {
      const start = new Date();
      start.setDate(today.getDate() - days);

      return goalDoc.dailyProgress.filter(
        (d) => new Date(d.date) >= start
      );
    };

    // ✅ Today Progress
    const todayEntry = goalDoc.dailyProgress.find((d) =>
      isSameDay(d.date, today)
    );

    const todayQuestions = todayEntry ? todayEntry.totalQuestions : 0;

    // ✅ Weekly Progress (Last 7 days)
    const weeklyTotal = lastNDays(7).reduce(
      (sum, d) => sum + d.totalQuestions,
      0
    );

    // ✅ Monthly Progress (Last 30 days)
    const monthlyTotal = lastNDays(30).reduce(
      (sum, d) => sum + d.totalQuestions,
      0
    );

    // ✅ Yearly Progress (Last 365 days)
    const yearlyTotal = lastNDays(365).reduce(
      (sum, d) => sum + d.totalQuestions,
      0
    );

    return res.status(200).json({
      success: true,
      message: "Goal Summary Loaded",

      targets: goalDoc.targets,

      progress: {
        today: todayQuestions,
        weekly: weeklyTotal,
        monthly: monthlyTotal,
        yearly: yearlyTotal
      }
    });
  } catch (error) {
    console.error("❌ Goal Fetch Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch goals",
      error: error.message
    });
  }
};
