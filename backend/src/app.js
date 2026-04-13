import express from "express";
import cors from "cors";
import binRoutes from "./routes/binRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", binRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", routeRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

export default app;