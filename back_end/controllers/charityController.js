import Charity from "../models/Charity.js";
import { summarizeCharity } from "../services/aiService.js";

export const createCharity = async (req, res) => {
  try {
    const { name, description, creatorId } = req.body;

    const aiResult = await summarizeCharity(description);

    const charity = new Charity({
      name,
      description,
      shortDescription: aiResult.shortDescription,
      highlightMessage: aiResult.highlightMessage,
      status: "Pending",
    });

    await charity.save();
    res.status(201).json(charity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};