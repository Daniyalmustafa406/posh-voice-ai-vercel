const systemPrompt = `
You are POSH AI Voice Assistant.
Answer customer questions about POSH.
Weekly and monthly subscription plans.
Any car under the chosen plan is available.
Pickup is from office only.
Insurance and maintenance included.
Cities: Irving, Dallas, Garland, Richardson.
2 weeks free plus 20 percent off setup fee.
Speak short and clear.
`;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { message } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

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

    // SAFE FIX: Different OpenAI responses don't break the backend
    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.delta?.content ||
      data?.message ||
      "No response received from AI";

    return res.status(200).json({ response: reply });

  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};
