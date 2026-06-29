import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Sparkles,
  MapPin,
  Globe2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Auth() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setError("");
  };

  function validate() {
    if (mode === "register" && form.name.trim().length < 2) return "Please enter your name.";
    if (!EMAIL_RE.test(form.email)) return "Please enter a valid email address.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      if (mode === "login") {
        await login(form.email.trim(), form.password);
      } else {
        await register(form.name.trim(), form.email.trim(), form.password);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      <div className="aurora" />
      <div className="absolute right-5 top-5 z-20">
        <ThemeToggle />
      </div>

      {/* ---- Left: brand / showcase panel ---- */}
      <div className="relative z-10 hidden flex-col justify-between overflow-hidden p-12 lg:flex">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-700 to-blue-600 shadow-lg shadow-sky-300/50">
            <Plane className="h-5 w-5 text-white" />
          </span>
          <span className="text-lg">Wanderwise</span>
        </Link>

        <div className="max-w-md">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold leading-tight"
          >
            Your next adventure is one sentence away.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-slate-600 dark:text-slate-300"
          >
            Sign in to craft fully personalized, day-by-day itineraries with transparent budgets and smart routing.
          </motion.p>

          <div className="mt-8 space-y-3">
            {[
              { icon: Sparkles, text: "AI-personalized to your travel style" },
              { icon: MapPin, text: "Timed morning-to-evening plans" },
              { icon: Globe2, text: "Works for any destination on earth" },
            ].map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 rounded-xl glass px-4 py-3"
              >
                <row.icon className="h-5 w-5 text-sky-700" />
                <span className="text-sm text-slate-700 dark:text-slate-200">{row.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300">© {new Date().getFullYear()} Wanderwise</p>
      </div>

      {/* ---- Right: auth card ---- */}
      <div className="relative z-10 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md rounded-3xl glass p-8 shadow-2xl"
        >
          <Link to="/" className="mb-8 flex items-center justify-center gap-2 font-bold lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-700 to-blue-600">
              <Plane className="h-5 w-5 text-white" />
            </span>
            <span className="text-lg">Wanderwise</span>
          </Link>

          {/* Mode toggle */}
          <div className="mb-7 flex rounded-xl bg-sky-100 dark:bg-white/5 p-1">
            {["login", "register"].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError("");
                }}
                className="relative flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors"
              >
                {mode === m && (
                  <motion.span
                    layoutId="auth-toggle"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-sky-700 to-blue-600 shadow-lg shadow-sky-300/50"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={`relative z-10 ${mode === m ? "text-white" : "text-slate-600 dark:text-slate-300"}`}>
                  {m === "login" ? "Log in" : "Sign up"}
                </span>
              </button>
            ))}
          </div>

          <h1 className="text-2xl font-bold">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {mode === "login" ? "Sign in to continue planning." : "Start planning your next adventure free."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">Full name</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600 dark:text-slate-300" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Alex Rivera"
                      className="input-field pl-11"
                      autoComplete="name"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600 dark:text-slate-300" />
                <input
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                  className="input-field pl-11"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600 dark:text-slate-300" />
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={update("password")}
                  placeholder="••••••••"
                  className="input-field pl-11 pr-11"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-300 transition-colors hover:text-slate-600 dark:text-slate-300"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" disabled={submitting} className="btn-primary w-full text-base">
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {mode === "login" ? "Signing in…" : "Creating account…"}
                </>
              ) : mode === "login" ? (
                "Log in"
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
              className="font-semibold text-sky-700 transition-colors hover:text-sky-700"
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
