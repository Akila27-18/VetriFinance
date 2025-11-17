import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function GetStarted() {
  const nav = useNavigate();

  return (
    <div
      className="min-h-screen px-6 md:px-16 py-12"
      style={{
        background: "linear-gradient(135deg,#fff 0%,#fff7f2 40%,#ffe6d5 100%)",
      }}
    >
      {/* HERO */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h1 className="text-4xl font-bold mb-4">
            Get started with Vetri Finance
          </h1>

          <p className="text-gray-600 mb-6">
            Set up your account, connect UPI/bank, invite your partner, and
            start tracking shared expenses in minutes.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => nav("/signup")}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Create Account
            </button>
            <Link
              to="/learn-more"
              className="px-6 py-3 border rounded-lg hover:bg-gray-100 transition"
            >
              Learn more
            </Link>
          </div>
        </motion.div>

        {/* Replace this image */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <img
            src="/src/assets/illustrations/get-started-hero.jpg"
            className="w-full h-72 object-cover rounded-xl shadow-xl"
            alt="Getting Started Illustration"
          />
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="mt-16 grid md:grid-cols-3 gap-6">
        <Feature
          img="/src/assets/icons/budget.jpg"
          title="Set up budgets"
          text="Create and manage monthly budgets effortlessly."
        />
        <Feature
          img="/src/assets/icons/upi.jpg"
          title="Connect UPI & Bank"
          text="Auto-capture transactions from linked accounts."
        />
        <Feature
          img="/src/assets/icons/partner.png"
          title="Invite Partner"
          text="Collaborate and track shared expenses in realtime."
        />
      </section>

      {/* MINI CAROUSEL */}
      <section className="mt-16">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-semibold mb-4"
        >
          A quick walkthrough
        </motion.h3>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3500 }}
          pagination={{ clickable: true }}
          loop
          className="rounded-xl overflow-hidden"
        >
          <SwiperSlide>
            <ImageSlide
              img="/src/assets/illustrations/walkthrough-1.jpg"
              title="Automatic expense tracking"
              text="Linked UPI and bank transactions are categorized instantly."
            />
          </SwiperSlide>

          <SwiperSlide>
            <ImageSlide
              img="/src/assets/illustrations/walkthrough-2.jpg"
              title="Plan monthly budgets"
              text="Visualize and adjust planned vs actual spending."
            />
          </SwiperSlide>

          <SwiperSlide>
            <ImageSlide
              img="/src/assets/illustrations/walkthrough-3.jpg"
              title="Partner chat & bill splitting"
              text="Discuss expenses and split bills inside chat."
            />
          </SwiperSlide>
        </Swiper>
      </section>

      {/* CTA BOX */}
      <section className="mt-16 bg-white p-6 rounded-xl shadow flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-semibold text-lg">
            Ready to simplify your finances?
          </div>
          <div className="text-sm text-gray-500">
            Create your free account — secure & fast.
          </div>
        </div>

        <button
          onClick={() => nav("/signup")}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          Create account
        </button>
      </section>
    </div>
  );
}

// Feature Card Component
const Feature = ({ img, title, text }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="bg-white rounded-xl shadow p-6 text-center"
  >
    <img src={img} className="w-16 h-16 mx-auto mb-3" alt={title} />
    <div className="font-semibold mb-1">{title}</div>
    <p className="text-gray-500 text-sm">{text}</p>
  </motion.div>
);

// Carousel Slide Component
const ImageSlide = ({ img, title, text }) => (
  <div className="bg-white p-6 rounded-xl shadow flex items-center gap-6">
    <img src={img} className="w-40 h-32 rounded-lg object-cover" alt={title} />
    <div>
      <div className="font-semibold text-lg">{title}</div>
      <div className="text-sm text-gray-500">{text}</div>
    </div>
  </div>
);
