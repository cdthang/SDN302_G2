import Charity from "../models/charity.model.js";
import { summarizeCharity } from "../services/aiService.service.js";

export const createCharity = async (req, res) => {
  try {
    const { title, description } = req.body;

    const aiResult = await summarizeCharity(description);

    const charity = new Charity({
      title,
      description,
      shortDescription: aiResult.shortDescription,
      highlightMessage: aiResult.highlightMessage,
      status: "active",
    });

    await charity.save();
    res.status(201).json(charity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCharities = async (req, res) => {
  try {
    const charities = await Charity.find().sort({ createdAt: -1 });
    res.json(charities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
