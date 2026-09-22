import { useMemo } from "react";
import GaugeCard from "./GaugeCard.jsx";
import SectionTitle from "./SectionTitle.jsx";
import BarList from "./BarList.jsx";
import {
  getChannelBreakdown,
  getTopChannelByCount,
  getTopChannelByRevenue,
} from "../utils/calculations.js";
import { niceMax } from "../utils/gaugeMath.js";

export default function ChannelsSection({ bookings }) {
  const breakdown = useMemo(() => getChannelBreakdown(bookings), [bookings]);
  const topByCount = useMemo(() => getTopChannelByCount(bookings), [bookings]);
  const topByRevenue = useMemo(() => getTopChannelByRevenue(bookings), [bookings]);

  const maxCount = niceMax(Math.max(...breakdown.map((c) => c.count)));

  return (
    <section>
      <SectionTitle
        eyebrow="Lead Sources"
        title="מקורות לידים"
        subtitle="פילוח הזמנות לפי ערוץ מכירה"
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {breakdown.map((c) => (
          <GaugeCard
            key={c.channel}
            size="sm"
            value={c.count}
            max={maxCount}
            unit="הזמנות"
            label={`ערוץ: ${c.channel}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[auto_auto_1fr]">
        <GaugeCard
          value={topByCount.count}
          max={maxCount}
          unit="הזמנות"
          variant="highlight"
          badge="🏆 ערוץ מוביל"
          sublabel={topByCount.channel}
          label="הערוץ עם הכי הרבה הזמנות"
        />
        <GaugeCard
          value={topByRevenue.revenue}
          max={niceMax(Math.max(...breakdown.map((c) => c.revenue)))}
          unit="₪"
          variant="highlight"
          badge="💰 הכנסה מובילה"
          sublabel={topByRevenue.channel}
          label="הערוץ עם ההכנסה הגבוהה ביותר"
        />
        <div className="rounded-2xl border border-rim-500 bg-panel-900/90 p-5 panel-texture">
          <h3 className="mb-4 text-sm font-semibold text-gray-300">הכנסה לפי ערוץ</h3>
          <BarList data={breakdown} valueKey="revenue" labelKey="channel" unit="₪" />
        </div>
      </div>
    </section>
  );
}
