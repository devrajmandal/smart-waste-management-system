import SensorData from "../models/SensorData.js";
import Bin from "../models/Bin.js";
import { getBinStatus } from "../utils/statusHelper.js";

export const addBinData = async (req, res) => {
  try {
    const { binId, fillLevel, gasLevel, temperature } = req.body;

    if (!binId || fillLevel === undefined || gasLevel === undefined || temperature === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newData = await SensorData.create({
      binId,
      fillLevel,
      gasLevel,
      temperature,
      timestamp: new Date(),
    });

    const status = getBinStatus(fillLevel, gasLevel, temperature);

    const updatedBin = await Bin.findOneAndUpdate(
      { binId },
      { status },
      {
        returnDocument: "after",
        upsert: true,
      }
    );

    res.status(201).json({
      message: "Data stored successfully",
      data: newData,
      bin: updatedBin,
    });

  } catch (error) {
    console.error("AddBinData Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllBins = async (req, res) => {
  try {
    const bins = await Bin.find();
    res.json(bins);
  } catch (error) {
    console.error("GetAllBins Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getBinById = async (req, res) => {
  try {
    const bin = await Bin.findOne({ binId: req.params.id });

    if (!bin) {
      return res.status(404).json({ error: "Bin not found" });
    }

    res.json(bin);
  } catch (error) {
    console.error("GetBinById Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getBinHistory = async (req, res) => {
  try {
    const data = await SensorData.find({
      binId: req.params.id,
    }).sort({ timestamp: 1 });

    res.json(data);
  } catch (error) {
    console.error("GetBinHistory Error:", error);
    res.status(500).json({ error: error.message });
  }
};