import express from "express";
import { listAllRecords, reshapeBooking, reshapeAgent } from "./airtable.js";

const CACHE_TTL_MS = 45_000;
const cache = new Map();

async function getCached(key, loader) {
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.data;
  const data = await loader();
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  return data;
}

const app = express();

app.get("/api/bookings", async (req, res) => {
  try {
    const data = await getCached("bookings", async () =>
      (await listAllRecords("bookings")).map(reshapeBooking)
    );
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "שגיאה בטעינת הזמנות מ-Airtable" });
  }
});

app.get("/api/agent-performance", async (req, res) => {
  try {
    const data = await getCached("agent_performance", async () =>
      (await listAllRecords("agent_performance")).map(reshapeAgent)
    );
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "שגיאה בטעינת ביצועי סוכנים מ-Airtable" });
  }
});

const port = process.env.PORT || 8787;
app.listen(port, () => {
  console.log(`Airtable API server listening on http://localhost:${port}`);
});
