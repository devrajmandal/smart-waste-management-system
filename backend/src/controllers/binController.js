import SensorData from "../models/SensorData.js";
import Bin from "../models/Bin.js";
import { getBinStatus } from "../utils/statusHelper.js";

export const addBinData = async (req, res) => {
  try {
    const { binId, fillLevel, gasLevel, temperature, timestamp } = req.body;

    // Save sensor data
    const newData = await SensorData.create({
      binId,
      fillLevel,
      gasLevel,
      temperature,
      timestamp,
    });

    // Determine status
    const status = getBinStatus(fillLevel, gasLevel, temperature);

    // Update or create bin
    const updatedBin = await Bin.findOneAndUpdate(
      { binId },
      { status },
      { new: true, upsert: true }
    );

    res.status(201).json({
      message: "Data stored successfully",
      data: newData,
      bin: updatedBin,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllBins = async (req, res) => {
  try {
    const bins = await Bin.find();
    res.json(bins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBinById = async (req, res) => {
  try {
    const bin = await Bin.findOne({ binId: req.params.id });
    res.json(bin);
  } catch (error) {
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
    res.status(500).json({ error: error.message });
  }
};