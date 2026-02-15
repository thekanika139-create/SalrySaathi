import { Router } from "express";
import { createStream, withdrawStream, getStream } from "../services/blockchain";

const router = Router();

// Create Stream
router.post("/create", async (req, res) => {
  try {
    const { employee, amount, start, end } = req.body;
    const txHash = await createStream(employee, amount, start, end);
    res.json({ success: true, txHash });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Create failed" });
  }
});

// Withdraw
router.post("/withdraw", async (req, res) => {
  try {
    const { streamId } = req.body;
    const txHash = await withdrawStream(streamId);
    res.json({ success: true, txHash });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Withdraw failed" });
  }
});

// Get Stream
router.get("/:id", async (req, res) => {
  try {
    const data = await getStream(Number(req.params.id));
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Fetch failed" });
  }
});

export default router;

