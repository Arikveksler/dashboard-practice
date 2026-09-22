import { formatNumber } from "../utils/format.js";

export default function BarList({ data, valueKey = "value", labelKey = "label", unit = "" }) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);

  return (
    <div className="flex flex-col gap-2.5">
      {data
        .slice()
        .sort((a, b) => b[valueKey] - a[valueKey])
        .map((d) => {
          const pct = (d[valueKey] / max) * 100;
          return (
            <div key={d[labelKey]} className="flex items-center gap-3">
              <div className="w-28 shrink-0 truncate text-xs text-gray-300" title={d[labelKey]}>
                {d[labelKey]}
              </div>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-panel-800 ring-1 ring-rim-500">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-redline-bright to-redline-dark shadow-glow-sm transition-all duration-1000 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="digital-num w-20 shrink-0 text-left text-xs font-semibold text-gray-200">
                {formatNumber(d[valueKey])}
                {unit && <span className="text-redline-bright"> {unit}</span>}
              </div>
            </div>
          );
        })}
    </div>
  );
}
