export function formatNumber(value, decimals = 0) {
  const num = Number(value) || 0;
  return num.toLocaleString("he-IL", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
