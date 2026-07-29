import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-2xl glass px-5 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-700 to-pink-600 shadow-lg shadow-rose-300/50">
            <Plane className="h-5 w-5 text-white" />
          </span>
          <span className="text-lg">Wanderwise</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-slate-600 dark:text-slate-300 md:flex">
          <a href="/#features" className="transition-colors hover:text-rose-700">Features</a>
          <a href="/#reviews" className="transition-colors hover:text-rose-700">Reviews</a>
          <a href="/#how" className="transition-colors hover:text-rose-700">How it works</a>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <Link to="/dashboard" className="hidden items-center gap-2 text-sm text-slate-600 dark:text-slate-300 transition-colors hover:text-rose-700 sm:flex">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 dark:border-white/10 bg-rose-100 dark:bg-white/5 px-4 py-2 text-sm font-medium transition-all hover:bg-rose-200 dark:hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="hidden text-sm text-slate-600 dark:text-slate-300 transition-colors hover:text-rose-700 sm:block">
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
      </div>
    </motion.header>
  );
}
