import useDashboardData from "./hooks/useDashboardData.js";
import OverviewSection from "./components/OverviewSection.jsx";
import DestinationsSection from "./components/DestinationsSection.jsx";
import ChannelsSection from "./components/ChannelsSection.jsx";
import AgentsSection from "./components/AgentsSection.jsx";
import BookingsTable from "./components/BookingsTable.jsx";
import AgentsTable from "./components/AgentsTable.jsx";

export default function App() {
  const { status, bookings, agents, error } = useDashboardData();

  return (
    <div className="min-h-screen pb-20" dir="rtl">
      <header className="border-b border-rim-500 bg-panel-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-6 sm:px-6">
          <span className="brand-font text-xs font-semibold tracking-[0.35em] text-redline-bright">
            TRAVEL AGENCY DASHBOARD
          </span>
          <h1 className="brand-font text-2xl font-bold text-gray-50 sm:text-3xl">
            לוח מחוונים — סוכנות נסיעות
          </h1>
          <p className="text-sm text-gray-400">
            720 הזמנות · 12 יעדים · 6 סוכנים · אוקטובר 2025–ספטמבר 2026
          </p>
        </div>
      </header>

      {status === "loading" && (
        <div className="flex flex-col items-center gap-3 px-4 py-32 text-center text-gray-400">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-rim-500 border-t-redline-bright" />
          <p>טוען נתונים חיים מ-Airtable…</p>
        </div>
      )}

      {status === "error" && (
        <div className="mx-auto max-w-xl px-4 py-32 text-center">
          <p className="text-lg font-semibold text-redline-bright">שגיאה בטעינת הנתונים</p>
          <p className="mt-2 text-sm text-gray-400">{error}</p>
          <p className="mt-4 text-xs text-gray-500">
            ודא שהרצת גם את שרת ה-API (`npm run dev` מריץ את שניהם יחד).
          </p>
        </div>
      )}

      {status === "success" && (
        <main className="mx-auto flex max-w-7xl flex-col gap-16 px-4 pt-10 sm:px-6">
          <OverviewSection bookings={bookings} />
          <DestinationsSection bookings={bookings} />
          <ChannelsSection bookings={bookings} />
          <AgentsSection agents={agents} />

          <section className="flex flex-col gap-12">
            <BookingsTable bookings={bookings} />
            <AgentsTable agents={agents} />
          </section>
        </main>
      )}

      <footer className="mt-16 border-t border-rim-500 px-4 py-6 text-center text-xs text-gray-500">
        דאטה לצורכי תרגול בלבד · נבנה עם React + Tailwind
      </footer>
    </div>
  );
}
