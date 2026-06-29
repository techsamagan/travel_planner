import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Brain,
  Route as RouteIcon,
  Wallet,
  Users,
  Plane,
  MapPin,
  Calendar,
  Star,
  ArrowRight,
  Compass,
  Globe2,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const features = [
  {
    icon: Brain,
    title: "AI Personalization",
    desc: "Every itinerary is crafted around your vibe, pace, and travel companions — not a generic template.",
    color: "from-sky-700 to-purple-500",
  },
  {
    icon: RouteIcon,
    title: "Real-time Routing",
    desc: "Smart day-by-day sequencing that minimizes backtracking and maximizes your time on the ground.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Wallet,
    title: "Budget Optimization",
    desc: "Transparent cost breakdowns for food, activities, and stays so there are zero surprises.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Users,
    title: "Collaborative Planning",
    desc: "Built for solo wanderers, couples, families, and friend groups — plans adapt to who's coming.",
    color: "from-pink-500 to-rose-500",
  },
];

const testimonials = [
  { name: "Sofia Marlowe", role: "Digital Nomad", quote: "It planned a 7-day Lisbon trip in 20 seconds that beat my travel agent. Genuinely unreal.", avatar: "SM" },
  { name: "Daniel Okafor", role: "Photographer", quote: "The routing alone saved me hours of backtracking. Every sunset spot was timed perfectly.", avatar: "DO" },
  { name: "Aiko Tanaka", role: "Food Blogger", quote: "Foodie mode found hole-in-the-wall spots I'd never have discovered. My followers loved it.", avatar: "AT" },
  { name: "Marcus Brandt", role: "Family of 4", quote: "Finally a planner that gets traveling with kids. Pacing was spot on, budget was honest.", avatar: "MB" },
  { name: "Elena Rossi", role: "Solo Traveler", quote: "Felt like a local concierge in my pocket. The packing list was a small but lovely touch.", avatar: "ER" },
  { name: "Liam Walsh", role: "Adventure Junkie", quote: "Adventure mode is no joke — it built a Patagonia route that pushed me just right.", avatar: "LW" },
];

const steps = [
  { icon: MapPin, title: "Tell us where", desc: "Pick a destination and how many days you have." },
  { icon: Sparkles, title: "Pick your vibe", desc: "Choose a travel style and who's coming along." },
  { icon: Calendar, title: "Get your plan", desc: "A complete, timed itinerary with budgets — instantly." },
];

function FloatingCard({ className, delay = 0, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className={`absolute hidden rounded-2xl glass p-4 shadow-2xl lg:block ${className}`}
      style={{ animation: `float 6s ease-in-out ${delay}s infinite` }}
    >
      {children}
    </motion.div>
  );
}

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="aurora" />
      <Navbar />

      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-40 text-center md:pt-48">
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-slate-600 dark:text-slate-300">
            <Sparkles className="h-4 w-4 text-sky-700" />
            Powered by frontier AI travel intelligence
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="mx-auto mt-8 max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl"
        >
          Your Next Adventure,{" "}
          <span className="bg-gradient-to-r from-sky-700 via-blue-500 to-blue-600 bg-clip-text text-transparent">
            Engineered by AI
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300 md:text-xl"
        >
          Wanderwise turns a single sentence into a complete, day-by-day itinerary —
          tailored to your vibe, your people, and your budget. Plan less, wander more.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link to="/auth" className="btn-primary text-base">
            Start Planning Free <ArrowRight className="h-5 w-5" />
          </Link>
          <a href="#how" className="btn-ghost text-base">
            <Compass className="h-5 w-5" /> See how it works
          </a>
        </motion.div>

        {/* Interactive preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative mx-auto mt-20 max-w-3xl"
        >
          <FloatingCard className="-left-10 top-10" delay={0.2}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
                <Wallet className="h-5 w-5 text-white" />
              </span>
              <div className="text-left">
                <p className="text-xs text-slate-600 dark:text-slate-300">Total budget</p>
                <p className="font-bold">$1,840</p>
              </div>
            </div>
          </FloatingCard>

          <FloatingCard className="-right-12 top-28" delay={0.6}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500">
                <Globe2 className="h-5 w-5 text-white" />
              </span>
              <div className="text-left">
                <p className="text-xs text-slate-600 dark:text-slate-300">Destination</p>
                <p className="font-bold">Kyoto, Japan</p>
              </div>
            </div>
          </FloatingCard>

          <div className="overflow-hidden rounded-3xl glass p-2 shadow-2xl">
            <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 p-6 text-left">
              <div className="flex items-center justify-between border-b border-sky-200 dark:border-white/10 pb-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Day 2 · Cultural</p>
                  <h3 className="text-xl font-bold">Temples & Tea Ceremony</h3>
                </div>
                <span className="rounded-full bg-sky-100 dark:bg-white/5 px-3 py-1 text-xs font-medium text-sky-700">
                  Generated in 18s
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { time: "Morning", title: "Fushimi Inari Shrine hike", icon: MapPin, tint: "text-amber-400" },
                  { time: "Afternoon", title: "Gion district & matcha tasting", icon: Sparkles, tint: "text-sky-700" },
                  { time: "Evening", title: "Kaiseki dinner by the river", icon: Star, tint: "text-pink-400" },
                ].map((row) => (
                  <div key={row.time} className="flex items-center gap-4 rounded-xl bg-sky-100 dark:bg-white/5 p-3">
                    <row.icon className={`h-5 w-5 ${row.tint}`} />
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{row.time}</p>
                      <p className="font-medium">{row.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ------------------------------------------------------------ Features */}
      <section id="features" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tight md:text-5xl"
          >
            Everything you need to travel smarter
          </motion.h2>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={1}
            className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300"
          >
            A complete planning engine that thinks like a seasoned local guide.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              whileHover={{ y: -6 }}
              className="group rounded-2xl glass p-6 transition-shadow hover:shadow-2xl hover:shadow-sky-300/30"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} shadow-lg`}>
                <f.icon className="h-6 w-6 text-white" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------- How it works */}
      <section id="how" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <div className="rounded-3xl glass p-10 md:p-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Three steps to your perfect trip</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300">From idea to a fully timed itinerary — faster than booking a coffee.</p>
          </div>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="relative text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-700 to-blue-600 shadow-xl shadow-sky-300/50">
                  <s.icon className="h-7 w-7 text-white" />
                </div>
                <p className="mt-2 text-sm font-bold text-sky-700">Step {i + 1}</p>
                <h3 className="mt-1 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- Testimonials */}
      <section id="reviews" className="relative z-10 py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Loved by travelers worldwide</h2>
          <div className="mt-4 flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm">4.9/5 from 12,000+ trips planned</span>
          </div>
        </div>

        {/* Marquee */}
        <div className="group relative mt-14 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#e9f4ff] dark:from-slate-950 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#e9f4ff] dark:from-slate-950 to-transparent" />
          <div className="flex w-max gap-6 animate-marquee group-hover:[animation-play-state:paused]">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="w-80 shrink-0 rounded-2xl glass p-6 text-left">
                <div className="flex">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">“{t.quote}”</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-700 to-blue-600 text-sm font-bold text-white">
                    {t.avatar}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- CTA */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-700 via-blue-500 to-blue-600 p-12 text-center shadow-2xl shadow-sky-300/50 md:p-16"
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-200 dark:bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-sky-200 dark:bg-white/10 blur-2xl" />
          <h2 className="relative text-4xl font-bold tracking-tight text-white md:text-5xl">
            Ready to plan your next escape?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-white/80">
            Join thousands of travelers turning ideas into adventures. It's free to start.
          </p>
          <div className="relative mt-8 flex justify-center">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-sky-700 shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              Start Planning Free <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* -------------------------------------------------------------- Footer */}
      <footer className="relative z-10 border-t border-sky-200 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
          <div className="flex items-center gap-2 font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-700 to-blue-600">
              <Plane className="h-4 w-4 text-white" />
            </span>
            Wanderwise
          </div>
          <div className="flex gap-8 text-sm text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-sky-700">Features</a>
            <a href="#how" className="hover:text-sky-700">How it works</a>
            <a href="#reviews" className="hover:text-sky-700">Reviews</a>
            <Link to="/auth" className="hover:text-sky-700">Sign in</Link>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">© {new Date().getFullYear()} Wanderwise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
