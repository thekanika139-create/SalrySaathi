import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import treasuryRoutes from "./routes/treasury";
import eventsRoutes from "./routes/events";
import reportsRoutes from "./routes/reports";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Register routes
app.use("/auth", authRoutes);
app.use("/treasury", treasuryRoutes);
app.use("/events", eventsRoutes);
app.use("/reports", reportsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
