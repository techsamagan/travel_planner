import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sunrise,
  Sun,
  Moon,
  Wallet,
  ListChecks,
  CalendarDays,
  UtensilsCrossed,
  Ticket,
  BedDouble,
  MapPin,
  Sparkles,
  RotateCcw,
  Check,
  Coffee,
  Camera,
  Wine,
} from "lucide-react";

const TIME_META = {
  Morning: { icon: Sunrise, ring: "from-amber-400 to-orange-500", tint: "text-amber-700 dark:text-amber-400" },
  Afternoon: { icon: Sun, ring: "from-sky-700 to-blue-600", tint: "text-sky-700" },
  Evening: { icon: Moon, ring: "from-sky-700 to-purple-500", tint: "text-sky-700" },
};

const ACTIVITY_ICONS = [Camera, Coffee, MapPin, Wine, UtensilsCrossed, Ticket];

function activityIcon(title = "", time) {
  const t = title.toLowerCase();
  if (/(eat|food|dinner|lunch|breakfast|tasting|restaurant|market|cuisine|kaiseki|meal)/.test(t)) return UtensilsCrossed;
  if (/(museum|temple|shrine|palace|tour|gallery|historic|walk|sightsee)/.test(t)) return MapPin;
  if (/(wine|bar|cocktail|jazz|night)/.test(t)) return Wine;
  if (/(coffee|café|cafe|tea)/.test(t)) return Coffee;
  if (/(photo|sunset|view|scenic)/.test(t)) return Camera;
  return time === "Evening" ? Wine : ACTIVITY_ICONS[title.length % ACTIVITY_ICONS.length];
}

const TABS = [
  { key: "days", label: "Itinerary", icon: CalendarDays },
  { key: "budget", label: "Budget", icon: Wallet },
  { key: "packing", label: "Packing", icon: ListChecks },
];

export default function ItineraryView({ data, source, onReset }) {
  const [tab, setTab] = useState("days");
  const [activeDay, setActiveDay] = useState(data.days[0]?.dayNumber ?? 1);
  const [checked, setChecked] = useState({});

  const day = data.days.find((d) => d.dayNumber === activeDay) || data.days[0];

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl glass p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 dark:bg-white/5 px-3 py-1 text-xs font-medium text-sky-700">
              <Sparkles className="h-3.5 w-3.5" />
              {source === "ai" ? "AI-generated" : "Sample itinerary"}
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{data.tripTitle}</h1>
            <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">{data.summary}</p>
          </div>
          <button onClick={onReset} className="btn-ghost shrink-0">
            <RotateCcw className="h-4 w-4" /> New trip
          </button>
        </div>

        {/* Quick stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat icon={CalendarDays} label="Days" value={data.days.length} />
          <Stat icon={Wallet} label="Total budget" value={`$${data.budgetEstimation.total.toLocaleString()}`} />
          <Stat icon={MapPin} label="Activities" value={data.days.reduce((n, d) => n + d.activities.length, 0)} />
          <Stat icon={ListChecks} label="Packing items" value={data.packingList.length} />
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 rounded-2xl glass p-1.5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="relative flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors"
          >
            {tab === t.key && (
              <motion.span
                layoutId="tab-pill"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-700 to-blue-600 shadow-lg shadow-sky-300/50"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className={`relative z-10 flex items-center gap-2 ${tab === t.key ? "text-white" : "text-slate-600 dark:text-slate-300"}`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ---- Itinerary / Days ---- */}
        {tab === "days" && (
          <motion.div
            key="days"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
            className="mt-6 grid gap-6 lg:grid-cols-[200px_1fr]"
          >
            {/* Day sidebar */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {data.days.map((d) => {
                const active = d.dayNumber === activeDay;
                return (
                  <button
                    key={d.dayNumber}
                    onClick={() => setActiveDay(d.dayNumber)}
                    className={`shrink-0 rounded-2xl border p-4 text-left transition-all lg:w-full ${
                      active
                        ? "border-sky-400/70 bg-sky-100 dark:bg-white/5 shadow-lg shadow-sky-300/40"
                        : "border-sky-200 dark:border-white/10 bg-sky-100 dark:bg-white/5 hover:bg-sky-200 dark:hover:bg-white/10"
                    }`}
                  >
                    <p className={`text-xs font-bold ${active ? "text-sky-700" : "text-slate-600 dark:text-slate-300"}`}>
                      DAY {d.dayNumber}
                    </p>
                    <p className="mt-0.5 whitespace-nowrap text-sm font-semibold lg:whitespace-normal">{d.theme}</p>
                  </button>
                );
              })}
            </div>

            {/* Timeline */}
            <div className="rounded-3xl glass p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDay}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-sky-700">DAY {day.dayNumber}</p>
                      <h3 className="text-2xl font-bold">{day.theme}</h3>
                    </div>
                    <span className="rounded-full bg-sky-100 dark:bg-white/5 px-3 py-1 text-sm text-slate-600 dark:text-slate-300">
                      ${day.activities.reduce((n, a) => n + a.cost, 0)} est.
                    </span>
                  </div>

                  <div className="relative space-y-6 pl-2">
                    {/* vertical line */}
                    <div className="absolute bottom-2 left-[26px] top-2 w-px bg-gradient-to-b from-sky-400/60 via-white/10 to-transparent" />
                    {day.activities.map((a, i) => {
                      const meta = TIME_META[a.time] || TIME_META.Morning;
                      const ActIcon = activityIcon(a.title, a.time);
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="relative flex gap-4"
                        >
                          <span
                            className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.ring} shadow-lg`}
                          >
                            <ActIcon className="h-5 w-5 text-white" />
                          </span>
                          <div className="flex-1 rounded-2xl border border-sky-200 dark:border-white/10 bg-sky-100 dark:bg-white/5 p-4 transition-colors hover:bg-sky-200/70 dark:hover:bg-white/[0.07]">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className={`flex items-center gap-1.5 text-xs font-semibold ${meta.tint}`}>
                                  <meta.icon className="h-3.5 w-3.5" /> {a.time}
                                </p>
                                <h4 className="mt-1 font-semibold">{a.title}</h4>
                              </div>
                              {a.cost > 0 ? (
                                <span className="shrink-0 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                                  ${a.cost}
                                </span>
                              ) : (
                                <span className="shrink-0 rounded-lg bg-sky-100 dark:bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                                  Free
                                </span>
                              )}
                            </div>
                            {a.description && (
                              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{a.description}</p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ---- Budget ---- */}
        {tab === "budget" && (
          <motion.div
            key="budget"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
            className="mt-6"
          >
            <BudgetPanel budget={data.budgetEstimation} days={data.days} />
          </motion.div>
        )}

        {/* ---- Packing ---- */}
        {tab === "packing" && (
          <motion.div
            key="packing"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
            className="mt-6 rounded-3xl glass p-6 md:p-8"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold">Packing list</h3>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {Object.values(checked).filter(Boolean).length}/{data.packingList.length} packed
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {data.packingList.map((item, i) => {
                const on = !!checked[i];
                return (
                  <button
                    key={i}
                    onClick={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
                    className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${
                      on ? "border-emerald-300 dark:border-emerald-400/40 bg-emerald-50 dark:bg-emerald-500/15" : "border-sky-200 dark:border-white/10 bg-sky-100 dark:bg-white/5 hover:bg-sky-200 dark:hover:bg-white/10"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-all ${
                        on ? "border-emerald-500 bg-emerald-500" : "border-sky-300 dark:border-white/20"
                      }`}
                    >
                      {on && <Check className="h-4 w-4 text-white" />}
                    </span>
                    <span className={`text-sm ${on ? "text-slate-600 dark:text-slate-300 line-through" : "text-slate-700 dark:text-slate-200"}`}>{item}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-sky-200 dark:border-white/10 bg-sky-100 dark:bg-white/5 p-4">
      <Icon className="h-5 w-5 text-sky-700" />
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="text-xs text-slate-600 dark:text-slate-300">{label}</p>
    </div>
  );
}

function BudgetPanel({ budget, days }) {
  const rows = useMemo(
    () => [
      { key: "food", label: "Food & dining", icon: UtensilsCrossed, color: "from-amber-400 to-orange-500", value: budget.food },
      { key: "activities", label: "Activities", icon: Ticket, color: "from-cyan-400 to-blue-500", value: budget.activities },
      { key: "stay", label: "Lodging", icon: BedDouble, color: "from-sky-700 to-purple-500", value: budget.stay },
    ],
    [budget]
  );
  const total = budget.total || 1;
  const perDay = Math.round(budget.total / Math.max(1, days.length));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-3xl glass p-6 md:p-8">
        <h3 className="mb-6 text-xl font-bold">Estimated budget breakdown</h3>
        <div className="space-y-6">
          {rows.map((r, i) => {
            const pct = Math.round((r.value / total) * 100);
            return (
              <div key={r.key}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${r.color}`}>
                      <r.icon className="h-4 w-4 text-white" />
                    </span>
                    {r.label}
                  </span>
                  <span className="text-sm font-semibold">
                    ${r.value.toLocaleString()} <span className="text-slate-600 dark:text-slate-300">· {pct}%</span>
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-sky-100 dark:bg-white/5">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${r.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, delay: i * 0.12, ease: "easeOut" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-3xl bg-gradient-to-br from-sky-700 to-blue-600 p-6 text-white shadow-xl shadow-sky-300/50">
          <p className="text-sm text-white/80">Total estimated cost</p>
          <p className="mt-1 text-4xl font-extrabold">${budget.total.toLocaleString()}</p>
          <p className="mt-2 text-sm text-white/80">≈ ${perDay.toLocaleString()} / day</p>
        </div>
        <div className="rounded-3xl glass p-6">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Good to know</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Estimates cover food, activities, and lodging for the whole trip. Flights and
            incidentals aren't included — keep a ~10% buffer for spontaneity.
          </p>
        </div>
      </div>
    </div>
  );
}
