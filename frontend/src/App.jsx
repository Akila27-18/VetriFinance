// App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

/* Components */
import Header from "./components/Header";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";

/* Dashboard pages */
import Insights from "./pages/Insights";
import Payments from "./pages/Payments";

/* Public pages */
import Signup from "./components/Signup";
import LearnMore from "./components/LearnMore";
import GetStarted from "./components/GetStarted";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";

/* Protected route wrapper */
import ProtectedRoute from "./components/ProtectedRoute";

/* Resources page */
import ResourcePage from "./pages/ResourcePage";

export default function App() {
  const location = useLocation();

  /** Hide header on these routes */
  const hideHeaderRoutes = ["/login", "/signup", "/forgot-password"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  /** Page animation */
  const pageTransition = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
    transition: { duration: 0.35 },
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Header visible only on non-auth pages */}
      {!shouldHideHeader && <Header />}

      <main className="max-w-6xl mx-auto p-6 relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>

            {/* ---------------- PUBLIC ROUTES ---------------- */}
            <Route
              path="/"
              element={<motion.div {...pageTransition}><Landing /></motion.div>}
            />

            <Route
              path="/signup"
              element={<motion.div {...pageTransition}><Signup /></motion.div>}
            />

            <Route
              path="/login"
              element={<motion.div {...pageTransition}><Login /></motion.div>}
            />

            <Route
              path="/forgot-password"
              element={<motion.div {...pageTransition}><ForgotPassword /></motion.div>}
            />

            <Route
              path="/learn-more"
              element={<motion.div {...pageTransition}><LearnMore /></motion.div>}
            />

            <Route
              path="/get-started"
              element={<motion.div {...pageTransition}><GetStarted /></motion.div>}
            />


            {/* ---------------- RESOURCES PAGE ---------------- */}
            <Route
              path="/resources/:slug"
              element={
                <motion.div {...pageTransition}>
                  <ProtectedRoute>
                    <ResourcePage />
                  </ProtectedRoute>
                </motion.div>
              }
            />


            {/* ---------------- DASHBOARD MAIN ---------------- */}
            <Route
              path="/dashboard"
              element={
                <motion.div {...pageTransition}>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </motion.div>
              }
            />


            {/* ---------------- DASHBOARD SUB-PAGES ---------------- */}
           <Route
            path="/dashboard/insights"
            element={
              <motion.div {...pageTransition}>
                <ProtectedRoute>
                  <Insights />
                </ProtectedRoute>
              </motion.div>
            }
          />


                    <Route
          path="/dashboard/payments"
          element={
            <motion.div {...pageTransition}>
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            </motion.div>
          }
        />


          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}
