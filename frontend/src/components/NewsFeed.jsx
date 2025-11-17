import React, { useEffect, useState } from "react";

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

  useEffect(() => {
    if (!API_KEY) {
      setError("Missing API Key. Add VITE_FINNHUB_API_KEY in .env file.");
      return;
    }

    fetch(`https://finnhub.io/api/v1/news?category=general&token=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          setError("Invalid API response");
          return;
        }
        setNews(data.slice(0, 6)); // show first 6 news
      })
      .catch(() => setError("Failed to load news."));
  }, [API_KEY]);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="font-semibold text-lg mb-3">Live Financial News</h2>

      {error && (
        <div className="text-red-500 text-sm mb-2">{error}</div>
      )}

      {news.length === 0 && !error && (
        <div className="text-gray-500 text-sm">Loading news...</div>
      )}

      <ul className="space-y-3">
        {news.map((item, index) => (
          <li key={index} className="border-b pb-2">
            <a 
              href={item.url} 
              target="_blank" 
              className="font-medium text-blue-600 hover:underline"
            >
              {item.headline}
            </a>
            <div className="text-gray-500 text-xs">
              {new Date(item.datetime * 1000).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
