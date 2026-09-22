import { useMemo, useState } from "react";
import GaugeCard from "./GaugeCard.jsx";
import SectionTitle from "./SectionTitle.jsx";
import BarList from "./BarList.jsx";
import {
  DESTINATIONS,
  getDestinationBreakdown,
  getDestinationStats,
  getTopDestination,
} from "../utils/calculations.js";
import { niceMax } from "../utils/gaugeMath.js";

export default function DestinationsSection({ bookings }) {
  const [selectedCity, setSelectedCity] = useState(DESTINATIONS[0]);

  const breakdown = useMemo(() => getDestinationBreakdown(bookings), [bookings]);
  const selectedStats = useMemo(
    () => getDestinationStats(bookings, selectedCity),
    [bookings, selectedCity]
  );
  const topDestination = useMemo(() => getTopDestination(bookings), [bookings]);

  const maxCount = niceMax(Math.max(...breakdown.map((d) => d.count)));
  const maxRevenue = niceMax(Math.max(...breakdown.map((d) => d.revenue)));

  return (
    <section>
      <SectionTitle
        eyebrow="Navigation"
        title="יעדים"
        subtitle="בחר יעד כדי לראות את הביצועים שלו בלוח המחוונים"
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {DESTINATIONS.map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all ${
              city === selectedCity
                ? "border-redline bg-redline/20 text-redline-bright shadow-glow-sm"
                : "border-rim-500 bg-panel-900 text-gray-300 hover:border-redline/50 hover:text-white"
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <GaugeCard
            value={topDestination.count}
            max={maxCount}
            unit="הזמנות"
            variant="highlight"
            badge="🏆 מוביל"
            sublabel={topDestination.city}
            label="יעד עם הכי הרבה הזמנות"
          />
          <GaugeCard
            value={selectedStats.count}
            max={maxCount}
            unit="הזמנות"
            sublabel={selectedCity}
            label="מספר הזמנות ליעד הנבחר"
          />
          <GaugeCard
            value={selectedStats.revenue}
            max={maxRevenue}
            unit="₪"
            sublabel={selectedCity}
            label="הכנסה מהיעד הנבחר"
          />
          <GaugeCard
            value={selectedStats.avgPax}
            max={niceMax(6)}
            decimals={1}
            unit="נוסעים"
            sublabel={selectedCity}
            label="ממוצע נוסעים להזמנה ביעד"
          />
        </div>

        <div className="rounded-2xl border border-rim-500 bg-panel-900/90 p-5 panel-texture">
          <h3 className="mb-4 text-sm font-semibold text-gray-300">
            כל היעדים לפי מספר הזמנות
          </h3>
          <BarList data={breakdown} valueKey="count" labelKey="city" unit="הזמנות" />
        </div>
      </div>
    </section>
  );
}
