import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//Hàm phụ để parse JSON an toàn
const safeParseJSON = (content, fallback) => {
  try {
    return JSON.parse(content);
  } catch (err) {
    console.warn("⚠️ Không thể parse JSON từ AI:", content);
    return fallback;
  }
};

export const classifyPost = async (title, description) => {
  const prompt = `
  Phân loại bài đăng vào danh mục phù hợp và gợi ý tags liên quan.
  Dữ liệu:
  - Tiêu đề: ${title}
  - Mô tả: ${description}

  Trả về đúng định dạng JSON:
  {
    "category": "Tên danh mục (ví dụ: Electronics, Clothing, Furniture, ...)",
    "tags": ["tag1", "tag2", "tag3"]
  }
  `;

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const content = res.choices?.[0]?.message?.content?.trim() || "{}";
    return safeParseJSON(content, { category: "Uncategorized", tags: [] });
  } catch (error) {
    console.error("Lỗi khi gọi AI classifyPost:", error.message);
    return { category: "Uncategorized", tags: [] };
  }
};

export const summarizeCharity = async (description) => {
  const prompt = `
  Tóm tắt ngắn gọn và tạo highlight message cảm xúc cho chiến dịch từ thiện sau:
  ${description}

  Trả về đúng định dạng JSON:
  {
    "shortDescription": "Tóm tắt khoảng 1-2 câu",
    "highlightMessage": "Một thông điệp nổi bật truyền cảm hứng"
  }
  `;

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const content = res.choices?.[0]?.message?.content?.trim() || "{}";
    return safeParseJSON(content, {
      shortDescription: "Không có mô tả ngắn.",
      highlightMessage: "Không có thông điệp nổi bật.",
    });
  } catch (error) {
    console.error("Lỗi khi gọi AI summarizeCharity:", error.message);
    return {
      shortDescription: "Không có mô tả ngắn.",
      highlightMessage: "Không có thông điệp nổi bật.",
    };
  }
};