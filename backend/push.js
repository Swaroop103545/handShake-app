const fetch = require("node-fetch");

async function sendPush(token, title, body, data = {}) {
    await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            to: token,
            title,
            body,
            priority: "high",
            sound: "default",
            channelId: "handshake-calls",
            data,
        }),
    });
}

module.exports = { sendPush };
