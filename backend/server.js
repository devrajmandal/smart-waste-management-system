import app from "./src/app.js";
import connectDB from "./src/utils/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});