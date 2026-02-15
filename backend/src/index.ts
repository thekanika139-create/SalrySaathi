import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import treasuryRoutes from "./routes/treasury";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/treasury", treasuryRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
