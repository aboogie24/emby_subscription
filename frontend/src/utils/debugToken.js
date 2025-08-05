import axios from "axios";

export const checkDebugToken = async () => {
  try {
    const res = await axios.get("http://localhost:8000/debug-token", {
      withCredentials: true // ✅ ensures cookie is sent
    });
    console.log("Debug Token Response:", res.data);
  } catch (err) {
    console.error("Debug Token Error:", err.response?.data || err.message);
  }
};
