import React, { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChatBoxInteractive() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setLoading(true);
    setInput("");
    // استدعاء API التوليد (مثال وهمي)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, { role: "user", content: input }] }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: "حدث خطأ في التوليد!" }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <h2>💬 محادثة تفاعلية مع الذكاء الاصطناعي</h2>
      <div style={{ border: "1px solid #ccc", padding: 10, minHeight: 200 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.role === "user" ? "right" : "left" }}>
            <b>{msg.role === "user" ? "أنت" : "المساعد"}:</b> {msg.content}
          </div>
        ))}
        {loading && <div>جاري التوليد...</div>}
      </div>
      <div style={{ marginTop: 10 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب رسالتك..."
          style={{ width: "80%" }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading} style={{ width: "18%" }}>
          إرسال
        </button>
      </div>
    </div>
  );
}
