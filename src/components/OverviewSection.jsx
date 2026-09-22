import { useMemo } from "react";
import GaugeCard from "./GaugeCard.jsx";
import SectionTitle from "./SectionTitle.jsx";
import { getOverviewStats } from "../utils/calculations.js";
import { niceMax } from "../utils/gaugeMath.js";

export default function OverviewSection({ bookings }) {
  const stats = useMemo(() => getOverviewStats(bookings), [bookings]);

  return (
    <section>
      <SectionTitle
        eyebrow="לוח מחוונים ראשי"
        title="מבט כללי — כל הנתונים"
        subtitle="סיכום מחושב מתוך כל 720 ההזמנות בדאטה"
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <GaugeCard
          size="lg"
          value={stats.totalBookings}
          max={niceMax(stats.totalBookings)}
          unit="הזמנות"
          label="סה״כ הזמנות מכל הדאטה"
        />
        <GaugeCard
          size="lg"
          value={stats.totalRevenue}
          max={niceMax(stats.totalRevenue)}
          unit="₪"
          label="סה״כ הכנסה מהזמנות ששולמו"
        />
        <GaugeCard
          size="lg"
          value={stats.totalProfit}
          max={niceMax(stats.totalProfit)}
          unit="₪"
          label="סה״כ רווח מהזמנות ששולמו"
        />
        <GaugeCard
          size="lg"
          value={stats.totalPax}
          max={niceMax(stats.totalPax)}
          unit="נוסעים"
          label="סה״כ נוסעים בכל ההזמנות"
        />
        <GaugeCard
          value={stats.paidPct}
          max={100}
          decimals={1}
          unit="%"
          label="אחוז הזמנות ששולמו"
        />
        <GaugeCard
          value={stats.cancelledPct}
          max={niceMax(Math.max(stats.cancelledPct, 15), 1.6)}
          decimals={1}
          unit="%"
          variant="danger"
          label="אחוז ביטולים"
        />
        <GaugeCard
          value={stats.avgNights}
          max={niceMax(stats.avgNights)}
          decimals={1}
          unit="לילות"
          label="ממוצע לילות להזמנה"
        />
      </div>
    </section>
  );
}
