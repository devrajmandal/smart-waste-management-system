import mongoose from "mongoose";

const binSchema = new mongoose.Schema({
  binId: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
},
  status: {
    type: String,
    enum: ["EMPTY", "MODERATE", "FULL", "HAZARDOUS", "ALERT"],
    default: "EMPTY",
  },
}, { timestamps: true });

export default mongoose.model("Bin", binSchema);