export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Only POST allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message missing" });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API key missing in backend" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Tum POSH car subscription assistant ho. Tumhari language friendly, simple aur helpful honi chahiye."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    return res.status(200).json({
      response:
        data?.choices?.[0]?.message?.content || "No response from AI model"
    });
  } catch (error) {
    console.log("Backend Error: ", error);
    return res.status(500).json({ error: "Server crashed" });
  }
}
