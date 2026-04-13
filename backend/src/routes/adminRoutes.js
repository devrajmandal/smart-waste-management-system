import express from "express";
import { addBin, updateBin, deleteBin } from "../controllers/adminController.js";

const router = express.Router();

router.post("/add-bin", addBin);
router.put("/update-bin/:id", updateBin);
router.delete("/delete-bin/:id", deleteBin);

export default router;