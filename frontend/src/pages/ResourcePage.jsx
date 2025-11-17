// src/pages/ResourcePage.jsx
import React from "react";
import { useParams } from "react-router-dom";

export default function ResourcePage() {
  const { slug } = useParams();

  const titles = {
    "budget-templates": "Budget Templates",
    "saving-tips": "Saving Tips",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-4">
        {titles[slug] || "Resource"}
      </h1>

      <p className="text-gray-600">
        This is the resource page for: <strong>{slug}</strong>.
      </p>

      <p className="mt-3 text-gray-500">
        You can customize this page content later.
      </p>
    </div>
  );
}
