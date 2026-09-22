import { useMemo } from "react";
import { getAgentsSorted } from "../utils/calculations.js";
import { formatNumber } from "../utils/format.js";

const COLUMNS = [
  { key: "agent_id", label: "מזהה סוכן" },
  { key: "total_bookings", label: "סה״כ הזמנות" },
  { key: "paid_bookings", label: "שולמו" },
  { key: "cancelled_bookings", label: "בוטלו" },
  { key: "total_pax", label: "סה״כ נוסעים" },
  { key: "unique_destinations", label: "יעדים ייחודיים" },
  { key: "total_revenue", label: "סה״כ הכנסה" },
  { key: "total_profit", label: "סה״כ רווח" },
];

export default function AgentsTable({ agents }) {
  const sorted = useMemo(() => getAgentsSorted(agents), [agents]);

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gray-100">
        ביצועי סוכנים{" "}
        <span className="text-sm font-normal text-gray-400">(ממוין לפי סה״כ הכנסה)</span>
      </h3>
      <div className="overflow-x-auto rounded-2xl border border-rim-500 bg-panel-900/90 panel-texture">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="text-right text-gray-400">
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  className="whitespace-nowrap border-b-2 border-redline/70 px-4 py-3 font-semibold"
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((a) => (
              <tr
                key={a.agent_id}
                className="digital-num border-b border-rim-600/60 transition-colors last:border-none hover:bg-redline/10"
              >
                <td className="px-4 py-2.5 font-semibold text-gray-100">{a.agent_id}</td>
                <td className="px-4 py-2.5">{formatNumber(a.total_bookings)}</td>
                <td className="px-4 py-2.5">{formatNumber(a.paid_bookings)}</td>
                <td className="px-4 py-2.5 text-redline-bright">
                  {formatNumber(a.cancelled_bookings)}
                </td>
                <td className="px-4 py-2.5">{formatNumber(a.total_pax)}</td>
                <td className="px-4 py-2.5">{formatNumber(a.unique_destinations)}</td>
                <td className="px-4 py-2.5 font-semibold">{formatNumber(a.total_revenue)} ₪</td>
                <td className="px-4 py-2.5">{formatNumber(a.total_profit)} ₪</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
