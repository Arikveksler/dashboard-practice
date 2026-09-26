import { useEffect, useState } from "react";
import staticBookings from "../data/bookings.json";
import staticAgents from "../data/agentPerformance.json";

const IS_STANDALONE = import.meta.env.MODE === "standalone";

export default function useDashboardData() {
  const [state, setState] = useState(() =>
    IS_STANDALONE
      ? { status: "success", bookings: staticBookings, agents: staticAgents, error: null }
      : { status: "loading", bookings: [], agents: [], error: null }
  );

  useEffect(() => {
    if (IS_STANDALONE) return;
    let cancelled = false;

    (async () => {
      try {
        const [bookingsRes, agentsRes] = await Promise.all([
          fetch("/api/bookings"),
          fetch("/api/agent-performance"),
        ]);
        if (!bookingsRes.ok || !agentsRes.ok) {
          throw new Error("השרת המקומי לא הצליח לטעון נתונים מ-Airtable");
        }
        const [bookings, agents] = await Promise.all([bookingsRes.json(), agentsRes.json()]);
        if (!cancelled) setState({ status: "success", bookings, agents, error: null });
      } catch (err) {
        if (!cancelled) {
          setState({ status: "error", bookings: [], agents: [], error: err.message });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
