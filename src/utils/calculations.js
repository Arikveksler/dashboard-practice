export const DESTINATIONS = [
  "פריז",
  "רומא",
  "ברצלונה",
  "לונדון",
  "אתונה",
  "דובאי",
  "בנגקוק",
  "ניו יורק",
  "לרנקה",
  "פראג",
  "אמסטרדם",
  "טביליסי",
];

export const CHANNELS = ["אתר", "טלפון", "וואטסאפ", "סוכן משנה", "מטא Ads"];

const PAID = "שולם";
const CANCELLED = "בוטל";

export function getOverviewStats(bookings) {
  const total = bookings.length;
  const paid = bookings.filter((b) => b.status === PAID);
  const cancelled = bookings.filter((b) => b.status === CANCELLED);

  const totalRevenue = paid.reduce((s, b) => s + b.revenue, 0);
  const totalProfit = paid.reduce((s, b) => s + b.profit, 0);
  const totalPax = bookings.reduce((s, b) => s + b.pax, 0);
  const avgNights = total ? bookings.reduce((s, b) => s + b.nights, 0) / total : 0;

  return {
    totalBookings: total,
    totalRevenue,
    totalProfit,
    totalPax,
    paidPct: total ? (paid.length / total) * 100 : 0,
    cancelledPct: total ? (cancelled.length / total) * 100 : 0,
    avgNights,
  };
}

export function getDestinationBreakdown(bookings) {
  return DESTINATIONS.map((city) => {
    const rows = bookings.filter((b) => b.city === city);
    const paidRows = rows.filter((b) => b.status === PAID);
    const revenue = paidRows.reduce((s, b) => s + b.revenue, 0);
    const avgPax = rows.length ? rows.reduce((s, b) => s + b.pax, 0) / rows.length : 0;
    return { city, count: rows.length, revenue, avgPax };
  });
}

export function getDestinationStats(bookings, city) {
  const rows = bookings.filter((b) => b.city === city);
  const paidRows = rows.filter((b) => b.status === PAID);
  const revenue = paidRows.reduce((s, b) => s + b.revenue, 0);
  const avgPax = rows.length ? rows.reduce((s, b) => s + b.pax, 0) / rows.length : 0;
  return { city, count: rows.length, revenue, avgPax };
}

export function getTopDestination(bookings) {
  const breakdown = getDestinationBreakdown(bookings);
  return breakdown.reduce((top, cur) => (cur.count > top.count ? cur : top), breakdown[0]);
}

export function getChannelBreakdown(bookings) {
  return CHANNELS.map((channel) => {
    const rows = bookings.filter((b) => b.channel === channel);
    const paidRows = rows.filter((b) => b.status === PAID);
    const revenue = paidRows.reduce((s, b) => s + b.revenue, 0);
    return { channel, count: rows.length, revenue };
  });
}

export function getTopChannelByCount(bookings) {
  const breakdown = getChannelBreakdown(bookings);
  return breakdown.reduce((top, cur) => (cur.count > top.count ? cur : top), breakdown[0]);
}

export function getTopChannelByRevenue(bookings) {
  const breakdown = getChannelBreakdown(bookings);
  return breakdown.reduce((top, cur) => (cur.revenue > top.revenue ? cur : top), breakdown[0]);
}

export function getAgentsSorted(agents) {
  return [...agents].sort((a, b) => b.total_revenue - a.total_revenue);
}
