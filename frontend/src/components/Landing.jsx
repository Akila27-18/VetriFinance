import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper";
import { Autoplay, Pagination } from "swiper/modules";


// Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// Hero Carousel Images
import finance1 from "../assets/illustrations/finance-1.jpg";
import finance2 from "../assets/illustrations/finance-2.jpg";
import finance3 from "../assets/illustrations/finance-3.jpg";

// Feature Icons
import iconBudget from "../assets/icon-budget.webp";
import iconExpense from "../assets/icon-expense.jpg";
import iconChat from "../assets/icon-chat.jpg";

// Highlight Images
import highlight1 from "../assets/illustrations/highlight-1.jpg";
import highlight2 from "../assets/illustrations/highlight-2.jpg";
import highlight3 from "../assets/illustrations/highlight-3.jpg";

// Feature Card Component
const FeatureCard = ({ imgSrc, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white shadow-lg rounded-xl p-5 flex flex-col items-center text-center"
  >
    <img src={imgSrc} alt={title} className="w-16 h-16 mb-4" />
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-gray-500 text-sm">{description}</p>
  </motion.div>
);

export default function Landing() {
  return (
    <div
      className="px-6 md:px-16 py-12 relative"
      style={{
        background:
          "linear-gradient(135deg, #fff 0%, #fff7f2 40%, #ffe6d5 100%)",
      }}
    >
      {/* Decorative Blur Background Shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200 opacity-30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-300 opacity-20 blur-3xl rounded-full"></div>

      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-10 items-center relative z-10">
        <div>
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold"
          >
            Manage money together — simply
          </motion.h1>

          <motion.p
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-600"
          >
            Vetri Finance helps couples and individuals track expenses, plan
            budgets, receive summarized financial news, and collaborate with
            partner chat.
          </motion.p>

          <div className="mt-6 flex gap-3">
            <a
              href="/signup"
              className="px-5 py-3 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition"
            >
              Sign up
            </a>
            <a
              href="/learn-more"
              className="px-5 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Learn more
            </a>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            Designed for India-first UPI and bank integrations.
          </div>
        </div>

        {/* Swiper Carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl shadow-xl overflow-hidden"
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            loop={true}
            className="w-full h-72"
          >
            <SwiperSlide>
              <img src={finance1} className="object-cover w-full h-full" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={finance2} className="object-cover w-full h-full" />
            </SwiperSlide>
            <SwiperSlide>
              <img src={finance3} className="object-cover w-full h-full" />
            </SwiperSlide>
          </Swiper>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="mt-20 grid md:grid-cols-3 gap-8">
        <FeatureCard
          imgSrc={iconBudget}
          title="Budget Planning"
          description="Create and manage monthly budgets effortlessly with real-time tracking."
        />
        <FeatureCard
          imgSrc={iconExpense}
          title="Expense Tracking"
          description="Track your expenses automatically through UPI and bank integrations."
        />
        <FeatureCard
          imgSrc={iconChat}
          title="Partner Chat"
          description="Collaborate with your partner, discuss finances and plan together."
        />
      </section>

      {/* Highlight Images */}
      <section className="mt-20 grid md:grid-cols-3 gap-4">
        <motion.img
          src={highlight1}
          className="rounded-xl w-full h-48 object-cover"
          whileHover={{ scale: 1.05 }}
        />
        <motion.img
          src={highlight2}
          className="rounded-xl w-full h-48 object-cover"
          whileHover={{ scale: 1.05 }}
        />
        <motion.img
          src={highlight3}
          className="rounded-xl w-full h-48 object-cover"
          whileHover={{ scale: 1.05 }}
        />
      </section>

      {/* CTA Section */}
      <section className="mt-20 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold mb-4"
        >
          Start managing your finances today
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 mb-6"
        >
          Join Vetri Finance and take control of your financial future with
          powerful tools tailored for Indian users.
        </motion.p>

        <motion.a
          href="/get-started"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition"
        >
          Get Started
        </motion.a>
      </section>
    </div>
  );
}
