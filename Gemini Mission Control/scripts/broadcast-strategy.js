const webhookUrl = "https://discord.com/api/webhooks/1473459019975884881/3AsnfhR7GF7rxIIJl0DI3OAkFnXmZioJ1s3GqHoBou16JeJAJ_9mANKzfBG5T_2JvfBj";

async function broadcastStrategy() {
    const payload = {
        embeds: [{
            title: "STRATEGIC BRIEF: FOUNDRY V1 (2026)",
            color: 3447003, // Blue
            fields: [
                {
                    name: "🎯 The Arbitrage",
                    value: "Legal/Compliance sectors: 1-week human timelines reduced to **15 minutes** via Foundry agentic workflows."
                },
                {
                    name: "💰 Pricing: The Triad",
                    value: "**Nexus**: $5k-15k/mo\n**Sovereign**: $25k+/mo\n**Omni-Agent**: 10-20% Performance-based"
                },
                {
                    name: "⚡ Core Alpha",
                    value: "Workflow Codification + Model Agnosticism + HITL Orchestration."
                }
            ],
            footer: {
                text: "Mission Control | Strategic Intel"
            },
            timestamp: new Date().toISOString()
        }]
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log("Strategy broadcast successful!");
        } else {
            console.error("Broadcast failed:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

broadcastStrategy();
