import { useId, useMemo } from "react";
import useAnimatedValue from "../hooks/useAnimatedValue.js";
import { formatNumber } from "../utils/format.js";
import {
  START_ANGLE,
  END_ANGLE,
  describeArc,
  valueToAngle,
  polarToCartesian,
} from "../utils/gaugeMath.js";

const SIZE_MAP = {
  sm: { box: 132, numClass: "text-2xl", labelClass: "text-[11px]" },
  md: { box: 168, numClass: "text-3xl", labelClass: "text-xs" },
  lg: { box: 200, numClass: "text-4xl", labelClass: "text-sm" },
};

const CX = 60;
const CY = 58;
const R_TRACK = 48;
const R_TICK_OUT = 48;
const R_TICK_IN = 41;
const R_LABEL = 57;
const TICK_COUNT = 10;
const VIEW_W = 120;
const VIEW_H = 108;

export default function GaugeCard({
  value = 0,
  min = 0,
  max = 100,
  label,
  sublabel,
  unit = "",
  decimals = 0,
  size = "md",
  variant = "normal",
  redlineFrom = 0.78,
  badge,
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const animated = useAnimatedValue(value);
  const dims = SIZE_MAP[size] || SIZE_MAP.md;
  const isDanger = variant === "danger";
  const isHighlight = variant === "highlight";

  const needleAngle = valueToAngle(animated, min, max);
  const redlineStartAngle = START_ANGLE + (END_ANGLE - START_ANGLE) * redlineFrom;

  const ticks = useMemo(() => {
    return Array.from({ length: TICK_COUNT + 1 }, (_, i) => {
      const angle = START_ANGLE + (i / TICK_COUNT) * (END_ANGLE - START_ANGLE);
      const outer = polarToCartesian(CX, CY, R_TICK_OUT, angle);
      const inner = polarToCartesian(CX, CY, R_TICK_IN, angle);
      const danger = isDanger || angle >= redlineStartAngle;
      return { key: i, x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y, danger };
    });
  }, [redlineStartAngle, isDanger]);

  const needleTip = polarToCartesian(CX, CY, 38, 0);
  const needleBaseL = polarToCartesian(CX, CY, 5, -90);
  const needleBaseR = polarToCartesian(CX, CY, 5, 90);

  const trackPath = describeArc(CX, CY, R_TRACK, START_ANGLE, END_ANGLE);
  const redlinePath = describeArc(CX, CY, R_TRACK, redlineStartAngle, END_ANGLE);
  const dangerFullPath = describeArc(CX, CY, R_TRACK, START_ANGLE, END_ANGLE);

  const zeroLabelPos = polarToCartesian(CX, CY, R_LABEL, START_ANGLE);
  const maxLabelPos = polarToCartesian(CX, CY, R_LABEL, END_ANGLE);

  return (
    <div
      className={`relative mx-auto flex min-w-0 flex-col items-center gap-1 rounded-2xl border p-3 panel-texture transition-colors ${
        isHighlight
          ? "border-redline/70 bg-panel-900 shadow-glow"
          : isDanger
          ? "border-redline-dark/70 bg-panel-900"
          : "border-rim-500 bg-panel-900/90 hover:border-redline/40"
      }`}
      style={{ width: "100%", maxWidth: dims.box + 24 }}
    >
      {badge && (
        <span className="absolute -top-3 rounded-full border border-redline/70 bg-panel-950 px-2 py-0.5 text-[10px] font-bold text-redline-bright shadow-glow-sm">
          {badge}
        </span>
      )}

      <svg
        width="100%"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="overflow-visible"
        style={{ maxWidth: dims.box }}
      >
        <defs>
          <linearGradient id={`redgrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8a0400" />
            <stop offset="100%" stopColor="#ff1e1e" />
          </linearGradient>
          <radialGradient id={`hub-${uid}`} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#3a3a3a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </radialGradient>
          <filter id={`glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* outer rim */}
        <circle cx={CX} cy={CY} r={55} fill="none" stroke="#2a2a2a" strokeWidth="2" />
        <circle cx={CX} cy={CY} r={52.5} fill="none" stroke="#3a3a3a" strokeWidth="1" opacity="0.6" />

        {/* background track */}
        <path d={trackPath} fill="none" stroke="#232323" strokeWidth="7" strokeLinecap="round" />

        {/* redline / danger arc */}
        {isDanger ? (
          <path
            d={dangerFullPath}
            fill="none"
            stroke={`url(#redgrad-${uid})`}
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.85"
          />
        ) : (
          <path
            d={redlinePath}
            fill="none"
            stroke={`url(#redgrad-${uid})`}
            strokeWidth="7"
            strokeLinecap="round"
          />
        )}

        {/* ticks */}
        {ticks.map((t) => (
          <line
            key={t.key}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.danger ? "#ff5555" : "#9a9a9a"}
            strokeWidth={t.danger ? 1.6 : 1.1}
          />
        ))}

        <text
          x={zeroLabelPos.x}
          y={zeroLabelPos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="digital-num"
          fontSize="6"
          fill="#7a7a7a"
        >
          {formatNumber(min)}
        </text>
        <text
          x={maxLabelPos.x}
          y={maxLabelPos.y}
          textAnchor="middle"
          dominantBaseline="middle"
          className="digital-num"
          fontSize="6"
          fill="#7a7a7a"
        >
          {formatNumber(max)}
        </text>

        {/* needle */}
        <g
          style={{
            transform: `rotate(${needleAngle}deg)`,
            transformOrigin: `${CX}px ${CY}px`,
          }}
          filter={`url(#glow-${uid})`}
        >
          <polygon
            points={`${needleBaseL.x},${needleBaseL.y} ${needleTip.x},${needleTip.y} ${needleBaseR.x},${needleBaseR.y}`}
            className="fill-redline-bright"
          />
        </g>
        <circle cx={CX} cy={CY} r={7} fill={`url(#hub-${uid})`} stroke="#e10600" strokeWidth="1.2" />
      </svg>

      <div className="flex flex-col items-center gap-0.5 -mt-1">
        <div className={`digital-num font-bold leading-none ${dims.numClass}`} style={{ color: "#f5f5f5" }}>
          {formatNumber(animated, decimals)}
          {unit && <span className="ms-1 text-redline-bright text-[0.55em] align-top">{unit}</span>}
        </div>
        {sublabel && (
          <div className="text-redline-bright font-semibold text-xs">{sublabel}</div>
        )}
        <div className={`text-center text-gray-400 ${dims.labelClass} leading-tight max-w-[14ch]`}>
          {label}
        </div>
      </div>
    </div>
  );
}
