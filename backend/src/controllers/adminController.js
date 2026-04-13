import Bin from "../models/Bin.js";

export const addBin = async (req, res) => {
  try {
    const { binId, lat, lng } = req.body;

    const newBin = await Bin.create({
      binId,
      location: { lat, lng },
    });

    res.status(201).json(newBin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBin = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const updated = await Bin.findOneAndUpdate(
      { binId: req.params.id },
      { location: { lat, lng } },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBin = async (req, res) => {
  try {
    await Bin.findOneAndDelete({ binId: req.params.id });
    res.json({ message: "Bin deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};