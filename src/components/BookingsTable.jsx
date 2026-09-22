import { useMemo, useState } from "react";
import { formatNumber } from "../utils/format.js";

const COLUMNS = [
  { key: "id", label: "מזהה" },
  { key: "date", label: "תאריך" },
  { key: "city", label: "עיר" },
  { key: "country", label: "מדינה" },
  { key: "pax", label: "נוסעים" },
  { key: "type", label: "סוג" },
  { key: "agent_id", label: "סוכן" },
  { key: "channel", label: "ערוץ" },
  { key: "status", label: "סטטוס" },
  { key: "revenue", label: "הכנסה" },
  { key: "profit", label: "רווח" },
  { key: "nights", label: "לילות" },
];

const PAGE_SIZE_OPTIONS = [25, 50];

const STATUS_STYLES = {
  שולם: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  "ממתין לתשלום": "bg-amber-500/15 text-amber-300 border-amber-500/40",
  בוטל: "bg-redline/15 text-redline-bright border-redline/50",
};

export default function BookingsTable({ bookings }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter((b) =>
      COLUMNS.some((c) => String(b[c.key]).toLowerCase().includes(q))
    );
  }, [bookings, query]);

  const sorted = useMemo(() => {
    const rows = [...filtered];
    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv), "he")
        : String(bv).localeCompare(String(av), "he");
    });
    return rows;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function handleSort(key) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-100">
          כל ההזמנות{" "}
          <span className="digital-num text-sm font-normal text-gray-400">
            ({formatNumber(sorted.length)} מתוך {formatNumber(bookings.length)})
          </span>
        </h3>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="חיפוש חופשי בכל העמודות…"
            className="w-56 rounded-lg border border-rim-500 bg-panel-950 px-3 py-1.5 text-sm text-gray-100 placeholder:text-gray-500 focus:border-redline focus:outline-none"
          />
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-lg border border-rim-500 bg-panel-950 px-2 py-1.5 text-sm text-gray-100 focus:border-redline focus:outline-none"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} בעמוד
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-rim-500 bg-panel-900/90 panel-texture">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            <tr className="text-right text-gray-400">
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  onClick={() => handleSort(c.key)}
                  className="cursor-pointer select-none whitespace-nowrap border-b-2 border-redline/70 px-3 py-3 font-semibold hover:text-redline-bright"
                >
                  {c.label}
                  {sortKey === c.key && (
                    <span className="text-redline-bright"> {sortDir === "asc" ? "▲" : "▼"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((b) => (
              <tr
                key={b.id}
                className="digital-num border-b border-rim-600/60 transition-colors last:border-none hover:bg-redline/10"
              >
                <td className="whitespace-nowrap px-3 py-2 text-gray-200">{b.id}</td>
                <td className="whitespace-nowrap px-3 py-2 text-gray-300">{b.date}</td>
                <td className="whitespace-nowrap px-3 py-2 font-sans text-gray-100">{b.city}</td>
                <td className="whitespace-nowrap px-3 py-2 font-sans text-gray-400">{b.country}</td>
                <td className="whitespace-nowrap px-3 py-2">{b.pax}</td>
                <td className="whitespace-nowrap px-3 py-2 font-sans text-gray-300">{b.type}</td>
                <td className="whitespace-nowrap px-3 py-2">{b.agent_id}</td>
                <td className="whitespace-nowrap px-3 py-2 font-sans text-gray-300">{b.channel}</td>
                <td className="whitespace-nowrap px-3 py-2 font-sans">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[b.status] || ""}`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-2 font-semibold text-gray-100">
                  {formatNumber(b.revenue)} ₪
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-gray-300">
                  {formatNumber(b.profit)} ₪
                </td>
                <td className="whitespace-nowrap px-3 py-2">{b.nights}</td>
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-3 py-8 text-center text-gray-500">
                  לא נמצאו תוצאות
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
        <span>
          עמוד {currentPage} מתוך {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-rim-500 px-3 py-1 disabled:opacity-30 hover:border-redline hover:text-redline-bright"
          >
            הקודם
          </button>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-lg border border-rim-500 px-3 py-1 disabled:opacity-30 hover:border-redline hover:text-redline-bright"
          >
            הבא
          </button>
        </div>
      </div>
    </div>
  );
}
