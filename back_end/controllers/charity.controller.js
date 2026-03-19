import Charity from "../models/charity.model.js";
import Donation from "../models/donation.model.js";
import { summarizeCharity } from "../services/aiService.service.js";

export const createCharity = async (req, res) => {
  try {

    const { title, description, goalAmount } = req.body;

    const aiResult = await summarizeCharity(description);

    const charity = new Charity({
      title,
      description,

      shortDescription: aiResult?.shortDescription || description.substring(0, 100),
      highlightMessage: aiResult?.highlightMessage || "Join us to make a difference!",
      goalAmount: goalAmount || 0,
      status: "active",
    });

    await charity.save();
    res.status(201).json(charity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getAllCharities = async (req, res) => {
  try {
    const charities = await Charity.find().sort({ createdAt: -1 });
    res.status(200).json(charities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCharityStats = async (req, res) => {
  try {
    const charities = await Charity.find();
    const totalDonated = charities.reduce((sum, charity) => sum + (charity.currentAmount || 0), 0);
    const totalGoal = charities.reduce((sum, charity) => sum + (charity.goalAmount || 0), 0);
    const activeCampaigns = charities.filter(c => c.status === 'active').length;
    
    res.status(200).json({
      totalDonated,
      totalGoal,
      activeCampaigns,
      totalCampaigns: charities.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCharityWithDonations = async (req, res) => {
  try {
    const { id } = req.params;
    const charity = await Charity.findById(id);
    if (!charity) {
      return res.status(404).json({ message: "Charity not found" });
    }

    const donations = await Donation.find({ charityId: id }).sort({ createdAt: -1 });
    
    // Mask donor names: only keep first 3 chars
    const maskedDonations = donations.map(d => {
      const name = d.donorName || "Anonymous";
      const maskedName = name.length <= 3 ? name + "***" : name.substring(0, 3) + "***";
      return {
        _id: d._id,
        amount: d.amount,
        donorName: maskedName,
        message: d.message,
        createdAt: d.createdAt
      };
    });

    res.status(200).json({ charity, donations: maskedDonations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const donateToCharity = async (req, res) => {
  try {
    const { id } = req.params;
    const { donorName, amount, message } = req.body;

    const charity = await Charity.findById(id);
    if (!charity) {
      return res.status(404).json({ message: "Charity not found" });
    }

    const donation = new Donation({
      charityId: id,
      donorName: donorName || "Anonymous",
      amount: Number(amount),
      message
    });

    await donation.save();

    charity.currentAmount = (charity.currentAmount || 0) + Number(amount);
    await charity.save();

    res.status(201).json({ message: "Donation successful", donation, currentAmount: charity.currentAmount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCharity = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, goalAmount, status } = req.body;

    const charity = await Charity.findById(id);
    if (!charity) {
      return res.status(404).json({ message: "Charity not found" });
    }

    if (title) charity.title = title;
    if (description) {
      charity.description = description;
      // Optionally re-summarize if description changes significantly
      const aiResult = await summarizeCharity(description);
      if (aiResult) {
        charity.shortDescription = aiResult.shortDescription;
        charity.highlightMessage = aiResult.highlightMessage;
      }
    }
    if (goalAmount !== undefined) charity.goalAmount = goalAmount;
    if (status) charity.status = status;

    await charity.save();
    res.status(200).json(charity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCharity = async (req, res) => {
  try {
    const { id } = req.params;
    const charity = await Charity.findByIdAndDelete(id);
    if (!charity) {
      return res.status(404).json({ message: "Charity not found" });
    }
    // Also delete associated donations
    await Donation.deleteMany({ charityId: id });
    
    res.status(200).json({ message: "Charity and associated donations deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
