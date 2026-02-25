import ChapterRanking from "../models/ChapterRankingModel.js";


export const getAllChapterRankings = async (req, res) => {
  try {
    const { subjectId, class: className, sortBy } = req.query;

    let filter = {};

    if (subjectId) filter.subjectId = subjectId;
    if (className) filter.class = Number(className);

    let query = ChapterRanking.find(filter);


    if (sortBy === "toughness") {
      query = query.sort({ toughnessRanking: 1 });
    } else if (sortBy === "pyq") {
      query = query.sort({ pyqRanking: 1 });
    } else if (sortBy === "avgQuestions") {
      query = query.sort({ avgQuestions: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const data = await query;

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};