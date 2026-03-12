import fetch from "node-fetch";

const API_KEY = process.env.AI_STUDIO_API_KEY || process.env.OPENAI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

const extractJSON = (text) => {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : "{}";
};

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
    console.error("Gemini API error:", error.message);
    return "{}";
  }
};

export const classifyPost = async (title, description) => {
  const prompt = `
  Phân loại bài đăng vào danh mục phù hợp và gợi ý tags liên quan.

  Tiêu đề: ${title}
  Mô tả: ${description}

  Chỉ trả về JSON:

  {
    "category": "Electronics | Clothing | Furniture | Books | Others",
    "tags": ["tag1","tag2","tag3"]
  }
  `;

  const responseText = await callGeminiAPI(prompt);

  try {
    const clean = extractJSON(responseText);

    return JSON.parse(clean);
  } catch (e) {
    console.warn("AI JSON parse error:", responseText);

    return {
      category: "Uncategorized",
      tags: [],
    };
  }
};

export const summarizeCharity = async (description) => {
  const prompt = `
  Tóm tắt chiến dịch từ thiện sau và tạo highlight message:

  ${description}

  Chỉ trả về JSON:

  {
    "shortDescription": "1-2 câu tóm tắt",
    "highlightMessage": "Thông điệp truyền cảm hứng"
  }
  `;

  const responseText = await callGeminiAPI(prompt);

  try {
    const clean = extractJSON(responseText);

    return JSON.parse(clean);
  } catch (e) {
    console.warn("AI JSON parse error:", responseText);

    return {
      shortDescription: "Không có mô tả ngắn.",
      highlightMessage: "Không có thông điệp nổi bật.",
    };
  }
};
