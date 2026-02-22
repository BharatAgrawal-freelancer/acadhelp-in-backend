import PaidContent from "../../models/paidContentModel.js";

export const getAllPaidContent = async (req, res) => {
  try {
    const contents = await PaidContent.find()
      .sort({ createdAt: -1 }); // latest first

    return res.status(200).json({
      success: true,
      count: contents.length,
      contents
    });

  } catch (error) {
    console.error("GET ALL PAID CONTENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};