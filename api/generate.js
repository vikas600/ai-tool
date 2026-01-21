export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "Missing GEMINI_API_KEY in environment variables" });
    }

    const payload = req.body;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey, // ✅ SAME AS CURL
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error || "Gemini API request failed",
      });
    }

    if (!data?.candidates?.length) {
      return res.status(200).json({
        message: "[No answer returned by Gemini API]",
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Error in /api/generate:", err);
    return res.status(500).json({
      error: err.message || "Internal Server Error",
    });
  }
}
