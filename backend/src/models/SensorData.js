import mongoose from "mongoose";

const sensorDataSchema = new mongoose.Schema({
  binId: {
    type: String,
    required: true,
  },
  fillLevel: Number,
  gasLevel: Number,
  temperature: Number,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("SensorData", sensorDataSchema);