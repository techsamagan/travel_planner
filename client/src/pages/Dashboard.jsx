import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import PlannerForm from "../components/PlannerForm.jsx";
import LoadingState from "../components/LoadingState.jsx";
import ItineraryView from "../components/ItineraryView.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";

export default function Dashboard() {
  const { user } = useAuth();
  const [stage, setStage] = useState("form"); // form | loading | result
  const [itinerary, setItinerary] = useState(null);
  const [source, setSource] = useState(null);
  const [error, setError] = useState("");
  const [pendingDestination, setPendingDestination] = useState("");

  async function handleGenerate(form) {
    setError("");
    setPendingDestination(form.destination);
    setStage("loading");
    try {
      const res = await api.generateItinerary({
        destination: form.destination,
        days: form.days,
        travelStyle: form.travelStyle,
        companion: form.companion,
      });
      setItinerary(res.itinerary);
      setSource(res.source);
      setStage("result");
    } catch (err) {
      setError(err.message || "Failed to generate itinerary.");
      setStage("form");
    }
  }

  function reset() {
    setItinerary(null);
    setSource(null);
    setError("");
    setStage("form");
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="aurora" />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-32">
        {stage === "form" && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Hey {user?.name?.split(" ")[0] || "traveler"} 👋
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300">Let's design your next adventure. Answer a few quick questions.</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mx-auto mb-6 flex max-w-2xl items-center gap-2 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <PlannerForm onSubmit={handleGenerate} />
          </motion.div>
        )}

        {stage === "loading" && <LoadingState destination={pendingDestination} />}

        {stage === "result" && itinerary && (
          <ItineraryView data={itinerary} source={source} onReset={reset} />
        )}
      </main>
    </div>
  );
}
