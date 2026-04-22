import express from "express";
import {
  addBinData,
  getAllBins,
  getBinById,
  getBinHistory,
} from "../controllers/binController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/bin-data", addBinData);

router.get("/bins", protect, getAllBins);
router.get("/bins/:id", protect, getBinById);
router.get("/history/:id", protect, getBinHistory);

export default router;