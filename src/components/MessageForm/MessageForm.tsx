import React from "react";

export default function MessageForm({ text, setText, handleSubmit }) {
  return (
    <div className="flex items-center">
      <input
        type="text"
        className="w-full p-2 border rounded border-gray-300"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 ml-2 rounded"
        onClick={handleSubmit}
      >
        Send
      </button>
    </div>
  );
}
