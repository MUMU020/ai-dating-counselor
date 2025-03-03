"use client";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setResponse("오류가 발생했습니다. 다시 시도해주세요.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">AI 연애 상담소 💬</h1>
      <textarea
        className="w-full max-w-lg p-2 border border-gray-300 rounded-lg bg-gray-800 text-white"
        rows={4}
        placeholder="연애 고민을 입력하세요..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        onClick={handleSendMessage}
        disabled={loading}
      >
        {loading ? "상담 중..." : "상담하기"}
      </button>
      {response && (
        <div className="mt-4 p-4 bg-gray-800 border border-gray-600 rounded-lg max-w-lg w-full">
          <strong>AI 답변:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
