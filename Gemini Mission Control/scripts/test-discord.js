const webhookUrl = "https://discord.com/api/webhooks/1473459019975884881/3AsnfhR7GF7rxIIJl0DI3OAkFnXmZioJ1s3GqHoBou16JeJAJ_9mANKzfBG5T_2JvfBj";

async function sendTest() {
    const payload = {
        embeds: [{
            title: "MISSION CONTROL: TEST ALERT",
            description: "This is a direct test message from Mission Control to verify the Discord Bridge connection.",
            color: 3447003, // Blue
            timestamp: new Date().toISOString(),
            footer: {
                text: "Debug Utility | Antigravity"
            }
        }]
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log("Test alert sent successfully!");
        } else {
            console.error("Failed to send test alert:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

sendTest();
