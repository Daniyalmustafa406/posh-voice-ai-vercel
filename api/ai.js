export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Only POST allowed" });
  }

  try {
    const { message } = req.body;

    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Tum POSH car subscription assistant ho." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    const aiReply =
      data?.choices?.[0]?.message?.content || "Koi reply nahi mila.";

    return res.status(200).json({ response: aiReply });

  } catch (error) {
    console.log("AI Error:", error);
    return res.status(500).json({ error: "Backend crash hogaya!" });
  }
}
