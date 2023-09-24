import React from "react";

export default function MessageForm({ text, setText, handleSubmit }) {
  return (
    <div className="p-4 flex items-center fixed bottom-0 w-[65%]">
      <input
        type="text"
        className="border border-gray-300 bg-slate-100 rounded-lg px-4 py-2 w-full"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="ml-2 bg-violet-500 text-white px-4 py-2 rounded-lg"
        onClick={handleSubmit}
      >
        Send
      </button>
    </div>
  );
}
