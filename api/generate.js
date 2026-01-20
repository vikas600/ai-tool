
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing API key in environment variables" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: `API request failed with status ${response.status}`,
      });
    }

    const data = await response.json();

    if (!data?.candidates?.length) {
      return res.status(200).json({ message: "[No answer returned by Gemini API]" });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Error in /api/generate:", err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
}
