// ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) setIsAuthed(true);
    else setIsAuthed(false);

    // Prevent initial flash
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
