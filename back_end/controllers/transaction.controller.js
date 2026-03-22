import Transaction from "../models/transaction.model.js";
import Post from "../models/post.models.js";
import Charity from "../models/charity.model.js";

const DEFAULT_SALE_COMMISSION = Number(process.env.SALE_COMMISSION_RATE || 5);
const DEFAULT_DONATION_COMMISSION = Number(process.env.DONATION_COMMISSION_RATE || 0);

export const createTransaction = async (req, res) => {
  try {
    const {
      type,
      amount,
      postId,
      charityId,
      paymentMethod = "manual",
      metadata = {},
    } = req.body;

    if (!["sale", "donation"].includes(type)) {
      return res.status(400).json({ message: "Loại giao dịch không hợp lệ" });
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: "Số tiền phải lớn hơn 0" });
    }

    let commissionRate = type === "sale" ? DEFAULT_SALE_COMMISSION : DEFAULT_DONATION_COMMISSION;
    let sellerId = null;

    if (type === "sale") {
      if (!postId) {
        return res.status(400).json({ message: "Thiếu mã bài đăng cho giao dịch mua bán" });
      }

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Không tìm thấy bài đăng" });
      }

      sellerId = post.userId;
      post.status = "sold";
      await post.save();
    }

    if (type === "donation") {
      if (!charityId) {
        return res.status(400).json({ message: "Thiếu mã chiến dịch cho giao dịch ủng hộ" });
      }

      const charity = await Charity.findById(charityId);
      if (!charity) {
        return res.status(404).json({ message: "Không tìm thấy chiến dịch" });
      }

      charity.currentAmount = (charity.currentAmount || 0) + numericAmount;
      await charity.save();
    }

    const commissionAmount = (numericAmount * commissionRate) / 100;
    const netAmount = numericAmount - commissionAmount;

    const transaction = await Transaction.create({
      type,
      amount: numericAmount,
      commissionRate,
      commissionAmount,
      netAmount,
      payerId: req.user?.id || null,
      sellerId,
      postId: postId || null,
      charityId: charityId || null,
      paymentMethod,
      metadata,
      status: "paid",
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ payerId: req.user.id }, { sellerId: req.user.id }],
    })
      .populate("postId", "title")
      .populate("charityId", "title")
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const { type, status } = req.query;
    const query = {};

    if (type) query.type = type;
    if (status) query.status = status;

    const transactions = await Transaction.find(query)
      .populate("payerId", "username email")
      .populate("sellerId", "username email")
      .populate("postId", "title")
      .populate("charityId", "title")
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
