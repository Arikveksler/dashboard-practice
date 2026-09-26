const API_BASE = "https://api.airtable.com/v0";

function authHeaders() {
  const token = process.env.AIRTABLE_TOKEN;
  if (!token) throw new Error("AIRTABLE_TOKEN חסר בקובץ .env");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

function baseId() {
  const id = process.env.AIRTABLE_BASE_ID;
  if (!id) throw new Error("AIRTABLE_BASE_ID חסר בקובץ .env");
  return id;
}

export async function listTables() {
  const res = await fetch(`${API_BASE}/meta/bases/${baseId()}/tables`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`listTables failed: ${res.status} ${await res.text()}`);
  const body = await res.json();
  return body.tables;
}

export async function createTable(schema) {
  const res = await fetch(`${API_BASE}/meta/bases/${baseId()}/tables`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(schema),
  });
  if (!res.ok) throw new Error(`createTable(${schema.name}) failed: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function listAllRecords(table) {
  let all = [];
  let offset;
  do {
    const url = new URL(`${API_BASE}/${baseId()}/${encodeURIComponent(table)}`);
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);
    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) throw new Error(`listAllRecords(${table}) failed: ${res.status} ${await res.text()}`);
    const body = await res.json();
    all = all.concat(body.records);
    offset = body.offset;
  } while (offset);
  return all;
}

export async function createRecordsBatch(table, records) {
  const res = await fetch(`${API_BASE}/${baseId()}/${encodeURIComponent(table)}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ records: records.map((fields) => ({ fields })) }),
  });
  if (!res.ok) throw new Error(`createRecordsBatch(${table}) failed: ${res.status} ${await res.text()}`);
  return res.json();
}

export function reshapeBooking(record) {
  const f = record.fields;
  return {
    id: f.id ?? "",
    date: f.date ?? "",
    city: f.city ?? "",
    country: f.country ?? "",
    pax: Number(f.pax) || 0,
    type: f.type ?? "",
    agent_id: String(f.agent_id ?? ""),
    channel: f.channel ?? "",
    status: f.status ?? "",
    revenue: Number(f.revenue) || 0,
    profit: Number(f.profit) || 0,
    nights: Number(f.nights) || 0,
  };
}

export function reshapeAgent(record) {
  const f = record.fields;
  return {
    agent_id: String(f.agent_id ?? ""),
    total_bookings: Number(f.total_bookings) || 0,
    paid_bookings: Number(f.paid_bookings) || 0,
    cancelled_bookings: Number(f.cancelled_bookings) || 0,
    total_pax: Number(f.total_pax) || 0,
    unique_destinations: Number(f.unique_destinations) || 0,
    total_revenue: Number(f.total_revenue) || 0,
    total_profit: Number(f.total_profit) || 0,
  };
}
