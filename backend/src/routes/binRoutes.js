import express from "express";
import {
  addBinData,
  getAllBins,
  getBinById,
  getBinHistory,
} from "../controllers/binController.js";

const router = express.Router();

router.post("/bin-data", addBinData);
router.get("/bins", getAllBins);
router.get("/bin/:id", getBinById);
router.get("/bin-history/:id", getBinHistory);

export default router;