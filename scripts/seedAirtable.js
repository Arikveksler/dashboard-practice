import bookings from "../src/data/bookings.json" with { type: "json" };
import agents from "../src/data/agentPerformance.json" with { type: "json" };
import { listTables, createTable, listAllRecords, createRecordsBatch } from "../server/airtable.js";

const TYPE_CHOICES = ["חבילה", "טיסה בלבד", "מלון בלבד", "קרוז", "טיול מודרך"];
const CHANNEL_CHOICES = ["אתר", "טלפון", "וואטסאפ", "סוכן משנה", "מטא Ads"];
const STATUS_CHOICES = ["שולם", "ממתין לתשלום", "בוטל"];

const BOOKINGS_SCHEMA = {
  name: "bookings",
  fields: [
    { name: "id", type: "singleLineText" },
    { name: "date", type: "date", options: { dateFormat: { name: "iso" } } },
    { name: "city", type: "singleLineText" },
    { name: "country", type: "singleLineText" },
    { name: "pax", type: "number", options: { precision: 0 } },
    { name: "type", type: "singleSelect", options: { choices: TYPE_CHOICES.map((name) => ({ name })) } },
    { name: "agent_id", type: "number", options: { precision: 0 } },
    { name: "channel", type: "singleSelect", options: { choices: CHANNEL_CHOICES.map((name) => ({ name })) } },
    { name: "status", type: "singleSelect", options: { choices: STATUS_CHOICES.map((name) => ({ name })) } },
    { name: "revenue", type: "number", options: { precision: 2 } },
    { name: "profit", type: "number", options: { precision: 2 } },
    { name: "nights", type: "number", options: { precision: 0 } },
  ],
};

const AGENTS_SCHEMA = {
  name: "agent_performance",
  fields: [
    { name: "agent_id", type: "number", options: { precision: 0 } },
    { name: "total_bookings", type: "number", options: { precision: 0 } },
    { name: "paid_bookings", type: "number", options: { precision: 0 } },
    { name: "cancelled_bookings", type: "number", options: { precision: 0 } },
    { name: "total_pax", type: "number", options: { precision: 0 } },
    { name: "unique_destinations", type: "number", options: { precision: 0 } },
    { name: "total_revenue", type: "number", options: { precision: 2 } },
    { name: "total_profit", type: "number", options: { precision: 2 } },
  ],
};

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ensureTable(schema) {
  const tables = await listTables();
  const existing = tables.find((t) => t.name === schema.name);
  if (existing) {
    console.log(`✓ טבלה "${schema.name}" כבר קיימת, לא נוצרת מחדש`);
    return existing;
  }
  const created = await createTable(schema);
  console.log(`+ נוצרה טבלה "${schema.name}"`);
  return created;
}

async function seedTable(tableName, records) {
  const existingRecords = await listAllRecords(tableName);
  if (existingRecords.length > 0) {
    console.log(`✓ טבלה "${tableName}" כבר מכילה ${existingRecords.length} רשומות, מדלג על הזרעה`);
    return;
  }
  const batches = chunk(records, 10);
  let inserted = 0;
  for (const batch of batches) {
    await createRecordsBatch(tableName, batch);
    inserted += batch.length;
    process.stdout.write(`\r  מכניס ${tableName}: ${inserted}/${records.length}`);
    await sleep(220);
  }
  console.log(`\n+ הוזנו ${inserted} רשומות לטבלה "${tableName}"`);
}

async function main() {
  console.log("בודק/יוצר טבלאות...");
  await ensureTable(BOOKINGS_SCHEMA);
  await ensureTable(AGENTS_SCHEMA);

  console.log("מזריע נתונים...");
  await seedTable(
    "bookings",
    bookings.map((b) => ({ ...b, agent_id: Number(b.agent_id) }))
  );
  await seedTable(
    "agent_performance",
    agents.map((a) => ({ ...a, agent_id: Number(a.agent_id) }))
  );

  console.log("סיום.");
}

main().catch((err) => {
  console.error("שגיאה בהזרעת הנתונים:", err.message);
  process.exit(1);
});
