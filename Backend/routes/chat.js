import express from "express";
import Thread from "../models/thread.js";
import getOpenAPIResponse from "../utils/openai.js";


const router = express.Router();

// ------------------------
// POST: Create a test thread
// ------------------------
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      thread: "abc",
      title: "Testing New Thread"
    });

    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save in DB" });
  }
});


// GET: All threads (latest first)
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});


// GET: One thread by threadId

router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ thread: threadId });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found!" });
    }

    return res.json(thread.message); 
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch chat!" });
  }
});


// POST: Send a message to thread

router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing required field!" });
  }

  try {
    let thread = await Thread.findOne({ thread: threadId });

    if (!thread) {
      thread = new Thread({
        thread: threadId,
        title: message,
        message: [{ role: "user", content: message }]
      });
    } else {
      thread.message.push({ role: "user", content: message });
    }

    const assistantReply = await getOpenAPIResponse(message);

    thread.message.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();
    await thread.save();

    return res.json({ reply: assistantReply });
  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
});


// DELETE: Delete thread by threadId

router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const deleted = await Thread.findOneAndDelete({ thread: threadId });

    if (!deleted) {
      return res.status(404).json({ error: "Thread not found!" });
    }

    return res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete thread!" });
  }
});

export default router;
