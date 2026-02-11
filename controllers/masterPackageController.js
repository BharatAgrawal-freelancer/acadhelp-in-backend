import axios from "axios";
import MasterPackagePdf from "../models/MasterPackageModel.js";

/* ✅ Stream PDF to Frontend */
export const streamMasterPdf = async (req, res) => {
  try {
    const { id } = req.params;

    const pdfDoc = await MasterPackagePdf.findById(id);
    if (!pdfDoc) return res.status(404).json({ message: "PDF not found" });

    const response = await axios.get(pdfDoc.pdfUrl, {
      responseType: "stream",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline");

    response.data.pipe(res);

  } catch (error) {
    console.log("STREAM ERROR:", error.message); // ✅ ADD THIS
    res.status(500).json({ message: error.message });
  }
};
