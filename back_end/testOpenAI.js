import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const test = async () => {
  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: "Xin chào, bạn có hoạt động không?" },
      ],
    });

    console.log("✅ Kết quả AI trả về:");
    console.log(res.choices[0].message.content);
  } catch (err) {
    console.error("❌ Lỗi khi gọi API:", err.message);
  }
};

test();