import express from "express";
import { streamMasterPdf } from "../controllers/masterPackageController.js";

const router = express.Router();

/* ✅ Secure PDF Streaming Route */
router.get("/pdf/:id", streamMasterPdf);

export default router;
