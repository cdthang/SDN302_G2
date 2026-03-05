import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const API_KEY = process.env.AI_STUDIO_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

const test = async () => {
  try {
    const prompt = "Xin chào, bạn có hoạt động không?";
    const res = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data = await res.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Không nhận được phản hồi từ AI.";

    console.log("✅ Kết quả AI trả về:");
    console.log(reply);
  } catch (err) {
    console.error("❌ Lỗi khi gọi Gemini API:", err.message);
  }
};

test();