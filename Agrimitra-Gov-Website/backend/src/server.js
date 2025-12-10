// src/server.js
require("dotenv").config({ path: "./config.env" });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// Initialize Firebase Admin via env-driven config
const { db } = require("../config/firebase");

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.set("trust proxy", 1);

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// Farmers: list and detail
app.get("/api/farmers", async (_req, res) => {
  try {
    const snap = await db.ref("userid").once("value");
    const val = snap.val() || {};
    const farmers = Object.entries(val).map(([id, u]) => ({
      id,
      name: u.name || "",
      citylabel: u.citylabel || "",
      state: u.state || "",
      phone: u.phone || "",
      email: u.email || "",
    }));
    res.json(farmers);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/farmers/:id", async (req, res) => {
  try {
    const snap = await db.ref(`userid/${req.params.id}`).once("value");
    if (!snap.exists()) return res.status(404).json({ error: "Not found" });
    res.json({ id: req.params.id, ...snap.val() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Pest report
app.get("/api/pest-report", async (_req, res) => {
  try {
    const snap = await db.ref("Pest-report").once("value");
    res.json(snap.val() || {});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Create alert/scheme/report
app.post("/api/alerts", async (req, res) => {
  try {
    const ref = db.ref("alerts").push();
    const data = { ...req.body, createdAt: Date.now(), id: ref.key };
    await ref.set(data);
    res.status(201).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/schemes", async (req, res) => {
  try {
    const ref = db.ref("schemes").push();
    const data = { ...req.body, createdAt: Date.now(), id: ref.key };
    await ref.set(data);
    res.status(201).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/reports", async (req, res) => {
  try {
    const ref = db.ref("reports").push();
    const data = { ...req.body, createdAt: Date.now(), id: ref.key };
    await ref.set(data);
    res.status(201).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
