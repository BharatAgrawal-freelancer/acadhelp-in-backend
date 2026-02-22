import express from "express";
import { addDiscountPurchase } from "../controllers/discountController.js";
import { protect } from "../middleware/adminAuthMiddleware.js";
const router = express.Router();

// POST → Add Discount Purchase
router.post("/add/:userId", protect , addDiscountPurchase);

export default router;