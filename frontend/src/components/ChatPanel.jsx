
// frontend/src/components/ChatPanel.jsx
import React, { useEffect, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws/chat/";

export default function ChatPanel() {
  const [messages, setMessages] = useState([]); // persistent messages
  const [text, setText] = useState("");
  const [status, setStatus] = useState("connecting");
  const [typingUsers, setTypingUsers] = useState([]);
  const wsRef = useRef(null);
  const scroller = useRef(null);

  // Load history on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/chat/messages/?limit=200`)
      .then((r) => r.json())
      .then((json) => {
        if (json?.ok) setMessages(json.data || []);
      })
      .catch(() => {
        // fallback: empty
      });
    connect();
    return () => cleanup();
    // eslint-disable-next-line
  }, []);

  // auto-scroll
  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages, typingUsers]);

  function connect() {
    setStatus("connecting");
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("online");
      console.info("WS connected");
    };

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        handleWsMessage(msg);
      } catch (err) {
        console.error("ws parse error", err);
      }
    };

    ws.onclose = () => {
      setStatus("offline");
      // reconnect after a bit
      setTimeout(connect, 1500);
    };

    ws.onerror = (err) => {
      console.error("WS error", err);
      ws.close();
    };
  }

  function cleanup() {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }

  function handleWsMessage(msg) {
    if (!msg?.type) return;
    if (msg.type === "message") {
      setMessages((m) => [...m, msg.data]);
    } else if (msg.type === "typing") {
      const from = msg.data?.from;
      if (!from) return;
      setTypingUsers((prev) => {
        if (prev.includes(from)) return prev;
        setTimeout(() => setTypingUsers((cur) => cur.filter((x) => x !== from)), 2000);
        return [...prev, from];
      });
    } else if (msg.type === "ack") {
      // optional: mark delivered (server ack)
    } else if (msg.type === "seen") {
      // update UI for seen status if implemented
    } else if (msg.type === "status") {
      // server status
    }
  }

  function sendTyping() {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "typing", payload: { from: "You" } }));
    }
  }

  function sendMessage() {
    const trimmed = text.trim();
    if (!trimmed) return;
    const payload = {
      type: "message",
      payload: {
        from: "You",
        text: trimmed,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    };
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    } else {
      // optimistic fallback
      setMessages((m) => [...m, { id: "tmp-" + Date.now(), from_user: "You", text: trimmed, time: payload.payload.time }]);
    }
    setText("");
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-medium">Partner Chat</div>
        <div className={`text-xs ${status === "online" ? "text-green-600" : status === "connecting" ? "text-yellow-500" : "text-red-500"}`}>
          {status === "online" ? "Live" : status === "connecting" ? "Connecting..." : "Offline"}
        </div>
      </div>

      <div className="h-44 overflow-y-auto space-y-3 mb-3 pr-1" ref={scroller}>
        {messages.map((m) => (
          <div key={m.id || m.created_at || Math.random()} className={`max-w-[85%] p-2 rounded-lg ${m.from_user === "You" ? "ml-auto bg-[#FF6A00] text-white" : "mr-auto bg-gray-100 text-gray-900"}`}>
            <div className="text-sm break-words">{m.text}</div>
            <div className="text-[10px] opacity-70 mt-1">{m.from_user || m.from} • {m.time}</div>
          </div>
        ))}

        {typingUsers.length > 0 && (
          <div className="mr-auto bg-gray-200 text-gray-600 px-3 py-1 rounded-lg inline-block text-sm animate-pulse">
            {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing…
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => { setText(e.target.value); sendTyping(); }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button onClick={sendMessage} className="px-3 py-2 bg-[#FF6A00] text-white rounded hover:bg-orange-600">
          Send
        </button>
      </div>
    </div>
  );
}
