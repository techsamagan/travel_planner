import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#how", label: "How it works" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const signOut = () => {
    close();
    logout();
    navigate("/");
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 px-4"
    >
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-2xl glass px-4 py-3 sm:px-5">
        <Link to="/" onClick={close} className="flex items-center gap-2 font-bold tracking-tight">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-700 to-pink-600 shadow-lg shadow-rose-300/50">
            <Plane className="h-5 w-5 text-white" />
          </span>
          <span className="text-lg">Wanderwise</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-8 text-sm text-slate-600 dark:text-slate-300 md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-rose-700">
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* Desktop auth actions */}
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 transition-colors hover:text-rose-700"
                >
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-200 dark:border-white/10 bg-rose-100 dark:bg-white/5 px-4 py-2 text-sm font-medium transition-all hover:bg-rose-200 dark:hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" className="text-sm text-slate-600 dark:text-slate-300 transition-colors hover:text-rose-700">
                  Log in
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-rose-700 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-300/50 transition-all hover:brightness-110"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-white/70 text-slate-600 transition-all hover:bg-white hover:text-rose-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl glass p-3 md:hidden"
          >
            <nav className="flex flex-col">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-rose-100 hover:text-rose-700 dark:text-slate-200 dark:hover:bg-white/5"
                >
                  {l.label}
                </a>
              ))}

              <div className="my-2 h-px bg-rose-200/70 dark:bg-white/10" />

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={close}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-rose-100 hover:text-rose-700 dark:text-slate-200 dark:hover:bg-white/5"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <button
                    onClick={signOut}
                    className="mt-1 flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-100 px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-rose-200 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    onClick={close}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-rose-100 hover:text-rose-700 dark:text-slate-200 dark:hover:bg-white/5"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/auth"
                    onClick={close}
                    className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-700 to-pink-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-300/50 transition-all hover:brightness-110"
                  >
                    Get started
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
