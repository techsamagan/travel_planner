import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plane, Sparkles, MapPin, Wallet, ListChecks } from "lucide-react";

const PHASES = [
  { icon: MapPin, text: "Scouting the best spots…" },
  { icon: Sparkles, text: "Matching your travel vibe…" },
  { icon: Plane, text: "Sequencing the perfect route…" },
  { icon: Wallet, text: "Balancing your budget…" },
  { icon: ListChecks, text: "Packing the final details…" },
];

export default function LoadingState({ destination }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % PHASES.length), 1800);
    return () => clearInterval(id);
  }, []);

  const Active = PHASES[phase].icon;

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Animated header */}
      <div className="rounded-3xl glass p-8 text-center">
        <div className="relative mx-auto mb-6 h-24 w-24">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-dashed border-sky-400/50"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-3 flex items-center justify-center rounded-full bg-gradient-to-br from-sky-700 to-blue-600 shadow-xl shadow-sky-300/60"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              key={phase}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Active className="h-9 w-9 text-white" />
            </motion.div>
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold">Crafting your {destination ? `${destination} ` : ""}adventure</h2>
        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-slate-600 dark:text-slate-300"
        >
          {PHASES[phase].text}
        </motion.p>

        <div className="mt-6 flex justify-center gap-2">
          {PHASES.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === phase ? "w-8 bg-sky-500" : "w-1.5 bg-white/15"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Skeleton preview */}
      <div className="mt-6 space-y-4">
        <div className="flex gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="shimmer h-9 flex-1 rounded-xl bg-sky-100 dark:bg-white/5" />
          ))}
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl glass p-5">
            <div className="shimmer mb-4 h-5 w-1/3 rounded bg-sky-100 dark:bg-white/5" />
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center gap-4">
                  <div className="shimmer h-10 w-10 shrink-0 rounded-xl bg-sky-100 dark:bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <div className="shimmer h-3 w-1/4 rounded bg-sky-100 dark:bg-white/5" />
                    <div className="shimmer h-4 w-3/4 rounded bg-sky-100 dark:bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
