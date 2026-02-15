import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const db = new PrismaClient();

router.get("/streams", async (req, res) => {
  const streams = await db.stream.findMany();
  res.json(streams);
});

router.get("/bonuses", async (req, res) => {
  const bonuses = await db.bonus.findMany();
  res.json(bonuses);
});

export default router;
