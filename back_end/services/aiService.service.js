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

    if (data.error) {
      console.error("Gemini API Error Object:", JSON.stringify(data.error, null, 2));
      return `Lỗi AI: ${data.error.message || "Unknown error"}`;
    }

    const content =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!content) {
      console.warn("Gemini API returned no content. Full data:", JSON.stringify(data, null, 2));
      return "AI không thể tạo nội dung cho yêu cầu này (có thể do vi phạm chính sách hoặc lỗi hệ thống).";
    }

    return content;
  } catch (error) {
    console.error("Gemini API Fetch Error:", error.message);
    return "Lỗi kết nối đến dịch vụ AI.";
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

export const generateCharityDescription = async (title) => {
  const prompt = `
  Viết một mô tả chi tiết, cảm động và truyền cảm hứng cho một chiến dịch từ thiện có tiêu đề là: "${title}".
  Nội dung nên bao gồm:
  1. Lý do thực hiện chiến dịch.
  2. Mục tiêu cụ thể.
  3. Lời kêu gọi hành động.

  Yêu cầu trả về định dạng plain text, không kèm ký hiệu markdown hay chú thích khác.
  `;

  const responseText = await callGeminiAPI(prompt);
  return responseText || "Vui lòng nhập tiêu đề để AI có thể hỗ trợ tạo nội dung.";
};
