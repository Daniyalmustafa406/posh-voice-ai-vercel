const systemPrompt = `
You are POSH AI Voice Assistant.

Your job:
- Answer customer questions about POSH.
- Weekly and monthly subscription plans.
- Any car under the chosen plan is available.
- Pickup is from office only.
- Insurance and maintenance included.
- Cities: Irving, Dallas, Garland, Richardson.
- 2 weeks free plus 20 percent off setup fee.
- Speak in short, clear sentences.
`;

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing API key" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
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

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
