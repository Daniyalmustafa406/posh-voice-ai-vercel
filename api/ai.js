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
`

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST allowed" })
    return
  }

  try {
    const body = req.body || {}
    const userText = body.message

    if (!userText) {
      res.status(400).json({ error: "No message provided" })
      return
    }

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: "gpt-5-nano",
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userText }
        ]
      })
    })

    const data = await openaiRes.json()

    const reply = data.output_text || "Sorry, I could not understand."

    res.status(200).json({ reply })
  } catch (err) {
    console.error("Server error", err)
    res.status(500).json({ reply: "Server error. Try again." })
  }
}
