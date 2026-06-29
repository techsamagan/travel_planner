import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  CalendarDays,
  Compass,
  Users,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Mountain,
  Landmark,
  Palmtree,
  UtensilsCrossed,
  PiggyBank,
  Gem,
  User,
  Heart,
  Home,
  PartyPopper,
} from "lucide-react";

const POPULAR_DESTINATIONS = [
  "Kyoto, Japan",
  "Lisbon, Portugal",
  "Bali, Indonesia",
  "Marrakech, Morocco",
  "Reykjavik, Iceland",
  "Mexico City, Mexico",
  "Queenstown, New Zealand",
  "Rome, Italy",
];

const TRAVEL_STYLES = [
  { value: "Adventure", icon: Mountain, desc: "Hikes, adrenaline, the wild" },
  { value: "Cultural", icon: Landmark, desc: "History, art, local life" },
  { value: "Relaxing", icon: Palmtree, desc: "Slow days, spas, calm" },
  { value: "Foodie", icon: UtensilsCrossed, desc: "Markets, tastings, dining" },
  { value: "Budget", icon: PiggyBank, desc: "Maximum trip, minimum spend" },
  { value: "Luxury", icon: Gem, desc: "Premium, curated, elevated" },
];

const COMPANIONS = [
  { value: "Solo", icon: User, desc: "Just me" },
  { value: "Couple", icon: Heart, desc: "Two of us" },
  { value: "Family", icon: Home, desc: "With the kids" },
  { value: "Friends", icon: PartyPopper, desc: "The whole crew" },
];

const STEPS = ["Destination", "Duration", "Vibe", "Companions"];

export default function PlannerForm({ onSubmit }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    destination: "",
    days: 5,
    travelStyle: "",
    companion: "",
  });
  const [showSuggest, setShowSuggest] = useState(false);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const filtered = POPULAR_DESTINATIONS.filter(
    (d) => form.destination && d.toLowerCase().includes(form.destination.toLowerCase()) && d.toLowerCase() !== form.destination.toLowerCase()
  );

  const canAdvance = [
    form.destination.trim().length >= 2,
    form.days >= 1 && form.days <= 14,
    Boolean(form.travelStyle),
    Boolean(form.companion),
  ][step];

  const isLast = step === STEPS.length - 1;

  function next() {
    if (!canAdvance) return;
    if (isLast) onSubmit(form);
    else setStep((s) => s + 1);
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-3 flex justify-between">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 flex-col items-center gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  i <= step
                    ? "bg-gradient-to-br from-sky-700 to-blue-600 text-white shadow-lg shadow-sky-300/50"
                    : "bg-sky-100 dark:bg-white/5 text-slate-600 dark:text-slate-300"
                }`}
              >
                {i + 1}
              </div>
              <span className={`hidden text-xs sm:block ${i <= step ? "text-slate-700 dark:text-slate-200" : "text-slate-600 dark:text-slate-300"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-sky-100 dark:bg-white/5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-sky-700 to-blue-600"
            initial={false}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="rounded-3xl glass p-8">
        <AnimatePresence mode="wait">
          {/* Step 0 — Destination */}
          {step === 0 && (
            <motion.div
              key="dest"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <StepHeader icon={MapPin} title="Where to?" subtitle="Tell us your dream destination." />
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600 dark:text-slate-300" />
                <input
                  autoFocus
                  value={form.destination}
                  onChange={(e) => {
                    set("destination", e.target.value);
                    setShowSuggest(true);
                  }}
                  onFocus={() => setShowSuggest(true)}
                  placeholder="e.g. Kyoto, Japan"
                  className="input-field pl-11 text-lg"
                  onKeyDown={(e) => e.key === "Enter" && next()}
                />
                <AnimatePresence>
                  {showSuggest && filtered.length > 0 && (
                    <motion.ul
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-sky-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl"
                    >
                      {filtered.slice(0, 5).map((d) => (
                        <li key={d}>
                          <button
                            type="button"
                            onClick={() => {
                              set("destination", d);
                              setShowSuggest(false);
                            }}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-sky-100 dark:bg-white/5"
                          >
                            <MapPin className="h-4 w-4 text-sky-700" />
                            {d}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              <p className="mt-5 mb-3 text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-300">Popular right now</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_DESTINATIONS.slice(0, 6).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      set("destination", d);
                      setShowSuggest(false);
                    }}
                    className={`rounded-full border px-4 py-2 text-sm transition-all ${
                      form.destination === d
                        ? "border-sky-400/70 bg-sky-100 dark:bg-white/5 text-sky-700"
                        : "border-sky-200 dark:border-white/10 bg-sky-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-sky-200 dark:hover:bg-white/10"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 1 — Duration */}
          {step === 1 && (
            <motion.div
              key="days"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <StepHeader icon={CalendarDays} title="How many days?" subtitle="We'll pace the trip just right." />
              <div className="flex items-center justify-center gap-6">
                <button
                  type="button"
                  onClick={() => set("days", Math.max(1, form.days - 1))}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-sky-200 dark:border-white/10 bg-sky-100 dark:bg-white/5 text-2xl transition-all hover:bg-sky-200 dark:hover:bg-white/10 active:scale-95"
                >
                  −
                </button>
                <div className="text-center">
                  <div className="bg-gradient-to-r from-sky-700 to-blue-600 bg-clip-text text-7xl font-extrabold text-transparent">
                    {form.days}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{form.days === 1 ? "day" : "days"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => set("days", Math.min(14, form.days + 1))}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-sky-200 dark:border-white/10 bg-sky-100 dark:bg-white/5 text-2xl transition-all hover:bg-sky-200 dark:hover:bg-white/10 active:scale-95"
                >
                  +
                </button>
              </div>
              <input
                type="range"
                min={1}
                max={14}
                value={form.days}
                onChange={(e) => set("days", Number(e.target.value))}
                className="mt-8 w-full accent-sky-500"
              />
              <div className="mt-2 flex justify-between text-xs text-slate-600 dark:text-slate-300">
                <span>1 day</span>
                <span>2 weeks</span>
              </div>
            </motion.div>
          )}

          {/* Step 2 — Travel style */}
          {step === 2 && (
            <motion.div
              key="style"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <StepHeader icon={Compass} title="What's your vibe?" subtitle="Pick the travel style that fits you." />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {TRAVEL_STYLES.map((s) => {
                  const active = form.travelStyle === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => set("travelStyle", s.value)}
                      className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all ${
                        active
                          ? "border-sky-400/70 bg-sky-100 dark:bg-white/5 shadow-lg shadow-sky-300/40"
                          : "border-sky-200 dark:border-white/10 bg-sky-100 dark:bg-white/5 hover:bg-sky-200 dark:hover:bg-white/10"
                      }`}
                    >
                      <s.icon className={`h-7 w-7 ${active ? "text-sky-700" : "text-slate-600 dark:text-slate-300"}`} />
                      <span className="text-sm font-semibold">{s.value}</span>
                      <span className="text-xs text-slate-600 dark:text-slate-300">{s.desc}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 3 — Companions */}
          {step === 3 && (
            <motion.div
              key="companion"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <StepHeader icon={Users} title="Who's coming?" subtitle="We'll tailor the pace and picks." />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {COMPANIONS.map((c) => {
                  const active = form.companion === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => set("companion", c.value)}
                      className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all ${
                        active
                          ? "border-sky-400/70 bg-sky-100 dark:bg-white/5 shadow-lg shadow-sky-300/40"
                          : "border-sky-200 dark:border-white/10 bg-sky-100 dark:bg-white/5 hover:bg-sky-200 dark:hover:bg-white/10"
                      }`}
                    >
                      <c.icon className={`h-7 w-7 ${active ? "text-sky-700" : "text-slate-600 dark:text-slate-300"}`} />
                      <span className="text-sm font-semibold">{c.value}</span>
                      <span className="text-xs text-slate-600 dark:text-slate-300">{c.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="mt-6 rounded-2xl border border-sky-200 dark:border-white/10 bg-sky-100 dark:bg-white/5 p-4 text-sm">
                <p className="mb-2 font-semibold text-slate-700 dark:text-slate-200">Trip summary</p>
                <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                  <span>📍 {form.destination || "—"}</span>
                  <span>📅 {form.days} days</span>
                  <span>🧭 {form.travelStyle || "—"}</span>
                  <span>👥 {form.companion || "—"}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav buttons */}
        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn-ghost disabled:invisible"
          >
            <ArrowLeft className="h-5 w-5" /> Back
          </button>
          <button type="button" onClick={next} disabled={!canAdvance} className="btn-primary">
            {isLast ? (
              <>
                <Sparkles className="h-5 w-5" /> Craft my itinerary
              </>
            ) : (
              <>
                Continue <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function StepHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-700 to-blue-600 shadow-lg shadow-sky-300/50">
        <Icon className="h-6 w-6 text-white" />
      </span>
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
      </div>
    </div>
  );
}
