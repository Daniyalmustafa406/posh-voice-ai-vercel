const systemPrompt = `
You are POSH AI Voice Assistant.
You answer customer questions about:
- Weekly and monthly subscription plans
- Any car under the chosen plan is allowed
- Pickup from office only
- Insurance and maintenance included
- Cities: Irving, Dallas, Garland, Richardson
- 2 weeks free plus 20 percent off setup fee
Speak in short, clear responses.
`;

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing API key" });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "No response";

    return res.status(200).json({ response: reply });
  } catch (err) {
    console.error("AI Server Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
