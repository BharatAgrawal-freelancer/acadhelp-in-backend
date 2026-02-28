import Video from "../models/videoModel.js";

/**
 * GET /api/videos
 * Pagination: ?page=1
 */
export const getPaginatedVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 30;
    const skip = (page - 1) * limit;

    const total = await Video.countDocuments();
    const videos = await Video.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      totalVideos: total,
      count: videos.length,
      videos
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/videos/search?keyword=ai
 */
export const searchVideos = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Keyword is required"
      });
    }

    const videos = await Video.find({
      title: { $regex: keyword, $options: "i" }
    });

    res.json({
      success: true,
      count: videos.length,
      videos
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/videos/random?limit=10
 */
export const getRandomVideos = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const videos = await Video.aggregate([
      { $sample: { size: limit } }
    ]);

    res.json({
      success: true,
      count: videos.length,
      videos
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};