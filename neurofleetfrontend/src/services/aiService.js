import axios from "axios";

const API_BASE_URL = "http://localhost:8083/api/ai";

export const askAI = async (text) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/predict`, text, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  } catch (error) {
    console.error("AI Request Error:", error);
    throw error;
  }
};
