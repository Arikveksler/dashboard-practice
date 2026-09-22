export const SWEEP = 270;
export const START_ANGLE = -SWEEP / 2;
export const END_ANGLE = SWEEP / 2;

export function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.sin(rad),
    y: cy - r * Math.cos(rad),
  };
}

export function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

export function valueToAngle(value, min, max) {
  const clamped = Math.min(Math.max(value, min), max);
  const fraction = max === min ? 0 : (clamped - min) / (max - min);
  return START_ANGLE + fraction * SWEEP;
}

export function niceMax(value, headroom = 1.25) {
  if (!isFinite(value) || value <= 0) return 10;
  const target = value * headroom;
  const magnitude = Math.pow(10, Math.floor(Math.log10(target)));
  const normalized = target / magnitude;
  let nice;
  if (normalized <= 1) nice = 1;
  else if (normalized <= 2) nice = 2;
  else if (normalized <= 2.5) nice = 2.5;
  else if (normalized <= 5) nice = 5;
  else nice = 10;
  return nice * magnitude;
}
