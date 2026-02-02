const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { sendPush } = require("./push");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const sockets = {};
const pushTokens = {};
const challenges = {};

io.on("connection", (socket) => {
    socket.on("register", (userId) => {
        sockets[userId] = socket.id;
    });

    socket.on("session_end", ({ challengeId }) => {
        const c = challenges[challengeId];
        if (c) {
            const other = sockets[c.to] === socket.id ? c.from : c.to;
            if (sockets[other]) {
                io.to(sockets[other]).emit("session_terminated", { challengeId });
            }
        }
    });

    socket.on("disconnect", () => {
        Object.keys(sockets).forEach((u) => {
            if (sockets[u] === socket.id) delete sockets[u];
        });
    });
});

app.post("/register-push", (req, res) => {
    const { userId, token } = req.body;
    pushTokens[userId] = token;
    res.json({ success: true });
});

app.post("/challenge", async (req, res) => {
    const { from, to } = req.body;
    const id = Date.now().toString();

    challenges[id] = { from, to, status: "PENDING" };

    if (sockets[to]) {
        io.to(sockets[to]).emit("challenge_received", { challengeId: id, from });
    } else if (pushTokens[to]) {
        await sendPush(
            pushTokens[to],
            "Incoming Challenge",
            `Challenge from ${from}`,
            { challengeId: id }
        );
    }

    res.json({ challengeId: id });
});

app.post("/challenge/respond", async (req, res) => {
    const { challengeId, accepted } = req.body;
    const c = challenges[challengeId];

    if (!c) return res.status(404).json({ error: "Challenge not found" });

    c.status = accepted ? "ACCEPTED" : "DECLINED";

    if (sockets[c.from]) {
        io.to(sockets[c.from]).emit("challenge_response", { challengeId, accepted });
    } else if (pushTokens[c.from]) {
        await sendPush(
            pushTokens[c.from],
            accepted ? "Challenge Accepted!" : "Challenge Declined",
            `${c.to} has ${accepted ? "accepted" : "declined"} your challenge.`,
            { challengeId, accepted, type: "HANDSHAKE_RESPONSE" }
        );
    }

    res.json({ success: true });
});

server.listen(3000, () =>
    console.log("Backend running on http://localhost:3000")
);
