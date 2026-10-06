const express = require("express");
const cookieSession = require("cookie-session");

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET is not set");
}

const app = express();
app.use(express.json());
app.use(
  cookieSession({
    name: "ledger",
    secret: sessionSecret,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  })
);

const entries = [];
let nextId = 1;

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/sessions", (req, res) => {
  const { user } = req.body || {};
  if (typeof user !== "string" || user.trim() === "") {
    return res.status(400).json({ error: "user is required" });
  }
  req.session.user = user.trim();
  res.json({ user: req.session.user });
});

app.get("/entries", (req, res) => {
  res.json({ entries });
});

app.post("/entries", (req, res) => {
  const { account, amount, memo } = req.body || {};
  if (typeof account !== "string" || account.trim() === "") {
    return res.status(400).json({ error: "account is required" });
  }
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return res.status(400).json({ error: "amount must be a number" });
  }
  const entry = {
    id: nextId++,
    account: account.trim(),
    amount,
    memo: typeof memo === "string" ? memo : "",
    createdBy: req.session.user || null,
    createdAt: new Date().toISOString(),
  };
  entries.push(entry);
  res.status(201).json(entry);
});

app.listen(3000, "127.0.0.1", (err) => {
  if (err) throw err;
  console.log("heron-ledger listening on http://127.0.0.1:3000");
});
