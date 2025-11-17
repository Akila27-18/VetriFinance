// src/components/ResourcePage.jsx
import React from "react";
import { useParams } from "react-router-dom";

export default function ResourcePage() {
  const { slug } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Resource: {slug}</h1>
      <p>Here you can display information for the resource "{slug}".</p>
    </div>
  );
}
