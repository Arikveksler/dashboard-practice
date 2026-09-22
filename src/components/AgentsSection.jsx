import { useMemo, useState } from "react";
import GaugeCard from "./GaugeCard.jsx";
import SectionTitle from "./SectionTitle.jsx";
import { getAgentsSorted } from "../utils/calculations.js";
import { niceMax } from "../utils/gaugeMath.js";
import { formatNumber } from "../utils/format.js";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function AgentsSection({ agents }) {
  const sorted = useMemo(() => getAgentsSorted(agents), [agents]);
  const [selectedAgent, setSelectedAgent] = useState(sorted[0]?.agent_id);

  const agent = sorted.find((a) => a.agent_id === selectedAgent) || sorted[0];

  const maxBookings = niceMax(Math.max(...agents.map((a) => a.total_bookings)));
  const maxCancelled = niceMax(Math.max(...agents.map((a) => a.cancelled_bookings)), 1.6);
  const maxDest = niceMax(Math.max(...agents.map((a) => a.unique_destinations)));
  const maxRevenue = niceMax(Math.max(...agents.map((a) => a.total_revenue)));
  const maxProfit = niceMax(Math.max(...agents.map((a) => a.total_profit)));

  return (
    <section>
      <SectionTitle
        eyebrow="Crew Performance"
        title="ביצועי סוכנים"
        subtitle="בחר סוכן כדי לראות את לוח המחוונים האישי שלו"
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {sorted.map((a) => (
          <button
            key={a.agent_id}
            onClick={() => setSelectedAgent(a.agent_id)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium digital-num transition-all ${
              a.agent_id === agent?.agent_id
                ? "border-redline bg-redline/20 text-redline-bright shadow-glow-sm"
                : "border-rim-500 bg-panel-900 text-gray-300 hover:border-redline/50 hover:text-white"
            }`}
          >
            סוכן #{a.agent_id}
          </button>
        ))}
      </div>

      {agent && (
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <GaugeCard
            size="sm"
            value={agent.total_bookings}
            max={maxBookings}
            unit="הזמנות"
            sublabel={`סוכן #${agent.agent_id}`}
            label="סה״כ הזמנות"
          />
          <GaugeCard
            size="sm"
            value={agent.paid_bookings}
            max={maxBookings}
            unit="הזמנות"
            label="הזמנות ששולמו"
          />
          <GaugeCard
            size="sm"
            value={agent.cancelled_bookings}
            max={maxCancelled}
            unit="הזמנות"
            variant="danger"
            label="הזמנות שבוטלו"
          />
          <GaugeCard
            size="sm"
            value={agent.unique_destinations}
            max={maxDest}
            unit="יעדים"
            label="יעדים ייחודיים ששירת"
          />
          <GaugeCard
            size="sm"
            value={agent.total_revenue}
            max={maxRevenue}
            unit="₪"
            label="הכנסה כוללת"
          />
          <GaugeCard
            size="sm"
            value={agent.total_profit}
            max={maxProfit}
            unit="₪"
            label="רווח כולל"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-rim-500 bg-panel-900/90 panel-texture">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="text-right text-gray-400">
              <th className="border-b-2 border-redline/70 px-4 py-3 font-semibold">דירוג</th>
              <th className="border-b-2 border-redline/70 px-4 py-3 font-semibold">סוכן</th>
              <th className="border-b-2 border-redline/70 px-4 py-3 font-semibold">הזמנות</th>
              <th className="border-b-2 border-redline/70 px-4 py-3 font-semibold">שולמו</th>
              <th className="border-b-2 border-redline/70 px-4 py-3 font-semibold">בוטלו</th>
              <th className="border-b-2 border-redline/70 px-4 py-3 font-semibold">הכנסה</th>
              <th className="border-b-2 border-redline/70 px-4 py-3 font-semibold">רווח</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((a, i) => (
              <tr
                key={a.agent_id}
                className="digital-num border-b border-rim-600/60 transition-colors last:border-none hover:bg-redline/10"
              >
                <td className="px-4 py-2.5 font-bold text-redline-bright">
                  {MEDALS[i] || `#${i + 1}`}
                </td>
                <td className="px-4 py-2.5 text-gray-100">{a.agent_id}</td>
                <td className="px-4 py-2.5">{formatNumber(a.total_bookings)}</td>
                <td className="px-4 py-2.5">{formatNumber(a.paid_bookings)}</td>
                <td className="px-4 py-2.5 text-redline-bright">
                  {formatNumber(a.cancelled_bookings)}
                </td>
                <td className="px-4 py-2.5 font-semibold">{formatNumber(a.total_revenue)} ₪</td>
                <td className="px-4 py-2.5">{formatNumber(a.total_profit)} ₪</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
