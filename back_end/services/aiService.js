import fetch from "node-fetch";

const API_KEY = process.env.AI_STUDIO_API_KEY || process.env.OPENAI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

const callGeminiAPI = async (prompt) => {
  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

    const content =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "{}";

    return content;
  } catch (error) {
    console.error("Lỗi khi gọi Gemini API:", error.message);
    return "{}";
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

  const responseText = await callGeminiAPI(prompt);

  try {
    return JSON.parse(responseText);
  } catch (e) {
    console.warn("Không thể parse JSON từ AI:", responseText);
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

  const responseText = await callGeminiAPI(prompt);

  try {
    return JSON.parse(responseText);
  } catch (e) {
    console.warn("Không thể parse JSON từ AI:", responseText);
    return {
      shortDescription: "Không có mô tả ngắn.",
      highlightMessage: "Không có thông điệp nổi bật.",
    };
  }
};
